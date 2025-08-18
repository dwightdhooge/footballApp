import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Fixture, Event } from "../../../types/api";
import { useMatchData } from "../../../hooks/useMatchData";
import {
  TabNavigation,
  MatchInfo,
  EventsList,
  LineupsGrid,
} from "../../../components";
import { useTranslation } from "react-i18next";

type TabType = "info" | "events" | "lineups";

const MatchDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item: fixture, leagueId, season } = route.params as {
    item: Fixture;
    leagueId?: number;
    season?: number;
  };

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const { t } = useTranslation();

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {t("navigation.matchDetail")}
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Content */}
      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
});

export default MatchDetailScreen;
