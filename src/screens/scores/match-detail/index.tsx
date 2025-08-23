import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Fixture, Event, Player } from "../../../types/api";
import { ScoresStackParamList } from "../../../types/navigation";
import { useMatchData } from "@/hooks/useMatchData";
import {
  TabNavigation,
  MatchInfo,
  EventsList,
  LineupsGrid,
} from "../../../components";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { PlayerProfile } from "../../../types/api";

type TabType = "info" | "events" | "lineups";
type MatchDetailNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "MatchDetail"
>;

const MatchDetailScreen: React.FC = () => {
  const navigation = useNavigation<MatchDetailNavigationProp>();
  const route = useRoute();
  const { item: fixture, leagueId, season } = route.params as {
    item: Fixture;
    leagueId?: number;
    season?: number;
  };

  const [activeTab, setActiveTab] = useState<TabType>("info");
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

  const navigateToPlayer = (player: Player) => {
    // Create minimal PlayerProfile object - PlayerDetailScreen will fetch the full profile from API
    const minimalPlayerProfile: PlayerProfile = {
      player: {
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
        position: player.pos || "",
        photo: "",
      },
    };

    navigation.navigate("PlayerDetail", { item: minimalPlayerProfile });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <MatchInfo
            fixture={fixture}
            events={events}
            showHalfTimeScore={true}
            showGoals={true}
            showDetails={true}
          />
        );
      case "events":
        return (
          <EventsList
            events={events}
            isLoading={isLoadingEvents}
            error={eventsError}
            onEventPress={handleEventPress}
            homeTeamName={fixture.teams.home.name}
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
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

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
    content: {
      flex: 1,
    },
  });

export default MatchDetailScreen;
