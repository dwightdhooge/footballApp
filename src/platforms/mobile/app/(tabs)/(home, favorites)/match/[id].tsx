import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Fixture, Event, Player } from "@/core/types/api";
import { useMatchData } from "@/core/hooks/useMatchData";
import { TabNavigation } from "@/components/match/TabNavigation";
import { MatchInfo } from "@/components/match/MatchInfo";
import { EventsList } from "@/components/match/EventsList";
import { LineupsGrid } from "@/components/match/LineupsGrid";
import { Stats } from "@/components/match/Stats";
import { PlaceholderState } from "@/components/utility/PlaceholderState";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/context/ThemeContext";

type TabType = "events" | "lineups" | "stats";

export default function MatchDetailScreen() {
  const { id, fixture: fixtureParam, leagueId, season } = useLocalSearchParams<{
    id: string;
    fixture?: string;
    leagueId?: string;
    season?: string;
  }>();

  const [activeTab, setActiveTab] = useState<TabType>("events");
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Parse fixture from URL params if provided, otherwise we'll need to fetch it
  const fixture: Fixture | null = fixtureParam
    ? JSON.parse(fixtureParam)
    : null;
  const parsedLeagueId = leagueId ? parseInt(leagueId) : undefined;
  const parsedSeason = season ? parseInt(season) : undefined;

  // Use our custom hook for data fetching
  const {
    events,
    lineups,
    isLoadingEvents,
    isLoadingLineups,
    eventsError,
    lineupsError,
    refetchEvents,
    refetchLineups,
  } = useMatchData(parseInt(id), parsedLeagueId, parsedSeason);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleEventPress = (event: Event) => {
    // Optional: Handle event press for future functionality
    console.log("Event pressed:", event);
  };

  const handlePlayerPress = (player: any) => {
    // Optional: Navigate to player detail in future
    console.log("Player pressed:", player);
  };

  const handleTeamPress = (team: any) => {
    router.push({
      pathname: `/team/[id]`,
      params: {
        id: team.id.toString(),
        name: team.name,
        logo: team.logo,
        country: team.country || "Unknown",
      },
    });
  };

  const navigateToPlayer = (player: Player) => {
    router.push({
      pathname: `/player/[id]`,
      params: {
        id: player.id.toString(),
        name: player.name,
        firstname: player.name.split(" ")[0] || "",
        lastname: player.name.split(" ").slice(1).join(" ") || "",
        position: player.position || "",
        number: player.number?.toString() || "",
      },
    });
  };

  const renderTabContent = () => {
    if (!fixture) {
      return (
        <PlaceholderState
          message={t("common.loading")}
          icon="hourglass-outline"
        />
      );
    }

    switch (activeTab) {
      case "events":
        return (
          <EventsList
            events={events}
            isLoading={isLoadingEvents}
            error={eventsError}
            onEventPress={handleEventPress}
            homeTeam={fixture.teams.home}
            awayTeam={fixture.teams.away}
            onRetry={refetchEvents}
          />
        );
      case "lineups":
        return (
          <LineupsGrid
            lineups={lineups}
            isLoading={isLoadingLineups}
            error={lineupsError}
            onPlayerPress={handlePlayerPress}
            events={events} // Pass events for player status calculation
            onRetry={refetchLineups}
            navigateToPlayer={navigateToPlayer}
          />
        );
      case "stats":
        return <Stats fixture={fixture} />;
      default:
        return null;
    }
  };

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.matchNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: fixture
            ? `${fixture.teams.home.name} vs ${fixture.teams.away.name}`
            : t("matchDetail.title"),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      {/* Match Info - Always visible at the top */}
      {fixture && (
        <View style={styles.headerContainer}>
          <MatchInfo
            fixture={fixture}
            events={events}
            showHalfTimeScore={true}
            showGoals={true}
            showDetails={true}
            onTeamPress={handleTeamPress}
          />

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      )}

      {/* Tab Content */}
      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
  });
