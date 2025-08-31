import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Fixture, Event, Player } from "@/core/types/api";
import { ScoresStackParamList } from "@/core/types/navigation";
import { useMatchData } from "@/core/hooks/useMatchData";
import { TabNavigation } from "@/components/match/TabNavigation";
import { MatchInfo } from "@/components/match/MatchInfo";
import { EventsList } from "@/components/match/EventsList";
import { LineupsGrid } from "@/components/match/LineupsGrid";
import { Stats } from "@/components/match/Stats";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/context/ThemeContext";

type TabType = "events" | "lineups" | "stats";
type MatchDetailNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "MatchDetail"
>;

export const MatchDetailScreen: React.FC = () => {
  const navigation = useNavigation<MatchDetailNavigationProp>();
  const route = useRoute();
  const { item: fixture, leagueId, season } = route.params as {
    item: Fixture;
    leagueId?: number;
    season?: number;
  };

  const [activeTab, setActiveTab] = useState<TabType>("events");
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Use our new custom hook for data fetching
  const {
    events,
    lineups,
    isLoadingEvents,
    isLoadingLineups,
    eventsError,
    lineupsError,
    refetchEvents,
    refetchLineups,
  } = useMatchData(fixture.fixture.id, leagueId, season);

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
    navigation.navigate("TeamDetail", {
      item: team,
    });
  };

  const navigateToPlayer = (player: Player) => {
    // Create minimal Player object - PlayerDetailScreen will fetch the full profile from API
    const minimalPlayer: Player = {
      id: player.id,
      name: player.name,
      firstname: player.name.split(" ")[0] || "",
      lastname: player.name.split(" ").slice(1).join(" ") || "",
      age: 0,
      birth: {
        date: "",
        place: "",
        country: "",
      },
      nationality: "",
      height: "",
      weight: "",
      number: player.number || 0,
      position: player.position || "",
      photo: "",
    };

    navigation.navigate("PlayerDetail", { item: minimalPlayer });
  };

  const renderTabContent = () => {
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

  // Show loading state for the entire screen while initial data is being fetched
  const isInitialLoading =
    (activeTab === "events" && isLoadingEvents) ||
    (activeTab === "lineups" && isLoadingLineups);

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Match Info - Always visible at the top */}
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

      {/* Tab Content */}
      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
};

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
