import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/context/ThemeContext";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useFavorites } from "@/core/context/FavoritesContext";
import { useLeagueData } from "@/core/hooks/useLeagueData";
import { Ionicons } from "@expo/vector-icons";

import { CachedImage } from "@/components/common/CachedImage";
import { SeasonDropdown } from "@/components/common/SeasonDropdown";
import { RoundDropdown } from "@/components/common/RoundDropdown";
import { StandingsTable } from "@/components/league/StandingsTable";
import { League, Fixture } from "@/core/types/api";
import { MatchCard } from "@/components/match/MatchCard";
import { PlaceholderState } from "@/components/utility/PlaceholderState";

export default function LeagueDetailScreen() {
  const { id, name, logo, countryName, seasons } = useLocalSearchParams<{
    id: string;
    name?: string;
    logo?: string;
    countryName?: string;
    seasons?: string;
  }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isItemFavorite, toggleFavoriteItem } = useFavorites();

  const styles = getStyles(theme);

  // Parse seasons from URL params if provided
  const parsedSeasons = seasons ? JSON.parse(seasons) : [];

  // Create a league object for the hook
  const leagueItem: League = {
    league: {
      id: parseInt(id),
      name: name || "League",
      logo: logo || "",
      type: "League",
    },
    country: {
      name: countryName || "Country",
      code: "",
      flag: "",
    },
    seasons: parsedSeasons,
  };

  const isLeagueFavorite = isItemFavorite(leagueItem, "league");

  // Local state for UI
  const [activeTab, setActiveTab] = useState<"standings" | "matches">(
    "standings"
  );
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  // Hook for all data logic
  const {
    standings,
    fixtures,
    rounds,
    currentRound,
    selectedSeason,
    setSelectedSeason,
    availableSeasons,
    isLoadingStandings,
    isLoadingFixtures,
    isLoadingRounds,
    standingsError,
    fixturesError,
    roundsError,
    refetchStandings,
    refetchFixtures,
    refetchRounds,
  } = useLeagueData(parseInt(id), parsedSeasons, undefined, selectedRound);

  // Set selected round when current round changes
  useEffect(() => {
    if (currentRound && !selectedRound) {
      setSelectedRound(currentRound);
    }
  }, [currentRound, selectedRound]);

  const handleSeasonChange = (season: any) => {
    setSelectedSeason(season);
    setSelectedRound(null);
  };

  const handleTabChange = (tab: "standings" | "matches") => {
    setActiveTab(tab);
  };

  const handleRoundChange = (round: string) => {
    setSelectedRound(round);
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

  const handleMatchPress = (fixture: Fixture) => {
    router.push({
      pathname: `/match/[id]`,
      params: {
        id: fixture.fixture.id.toString(),
        fixture: JSON.stringify(fixture),
        leagueId: id,
        season: selectedSeason?.year?.toString(),
      },
    });
  };

  const renderSeasonDropdown = () => (
    <View style={styles.seasonContainer}>
      <SeasonDropdown
        seasons={availableSeasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
        disabled={isLoadingStandings || isLoadingFixtures || isLoadingRounds}
        placeholder={t("leagueDetail.selectSeason")}
        showCurrent={true}
        size="medium"
        coverageType={activeTab === "standings" ? "standings" : "fixtures"}
      />
    </View>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "standings" && styles.activeTab]}
        onPress={() => handleTabChange("standings")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "standings" && styles.activeTabText,
          ]}
        >
          {t("leagueDetail.standings")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "matches" && styles.activeTab]}
        onPress={() => handleTabChange("matches")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "matches" && styles.activeTabText,
          ]}
        >
          {t("leagueDetail.matches")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRoundDropdown = () => {
    if (activeTab !== "matches") return null;

    return (
      <View style={styles.roundContainer}>
        <RoundDropdown
          rounds={rounds}
          selectedRound={selectedRound}
          currentRound={currentRound}
          onRoundChange={handleRoundChange}
          disabled={isLoadingRounds || isLoadingFixtures}
          placeholder={t("cupDetail.selectRound")}
          showCurrent={true}
          size="medium"
        />
      </View>
    );
  };

  const renderStandingsTable = () => (
    <View style={styles.contentContainer}>
      {isLoadingStandings ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {t("leagueDetail.loadingStandings")}
          </Text>
        </View>
      ) : standingsError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{standingsError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetchStandings}
          >
            <Text style={styles.retryButtonText}>
              {t("leagueDetail.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : standings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("leagueDetail.noStandingsForSeason")}
          </Text>
        </View>
      ) : (
        <StandingsTable standings={standings} onTeamPress={handleTeamPress} />
      )}
    </View>
  );

  const renderMatchesList = () => (
    <View style={styles.contentContainer}>
      {isLoadingRounds ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {t("leagueDetail.loadingRounds")}
          </Text>
        </View>
      ) : roundsError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{roundsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetchRounds}>
            <Text style={styles.retryButtonText}>
              {t("leagueDetail.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : rounds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("leagueDetail.noRoundsAvailable")}
          </Text>
        </View>
      ) : (
        <>
          {renderRoundDropdown()}
          {isLoadingFixtures ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>
                {t("leagueDetail.loadingMatches")}
              </Text>
            </View>
          ) : fixturesError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{fixturesError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={refetchFixtures}
              >
                <Text style={styles.retryButtonText}>
                  {t("leagueDetail.retry")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : fixtures.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t("leagueDetail.noMatchesAvailable")}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.matchesContainer}
              contentContainerStyle={styles.matchesContent}
            >
              {fixtures.map((fixture, index) => (
                <View
                  key={`${fixture.fixture.id}-${index}`}
                  style={[
                    styles.matchCardWrapper,
                    index < fixtures.length - 1 && styles.matchCardSpacing,
                  ]}
                >
                  <MatchCard
                    fixture={fixture}
                    onPress={() => handleMatchPress(fixture)}
                    size="medium"
                    showVenue={true}
                    showStatus={true}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );

  const renderTabContent = () => {
    return activeTab === "standings"
      ? renderStandingsTable()
      : renderMatchesList();
  };

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.leagueNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: leagueItem.league.name,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavoriteItem(leagueItem, "league")}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLeagueFavorite ? "heart" : "heart-outline"}
                size={24}
                color={
                  isLeagueFavorite ? theme.colors.error : theme.colors.text
                }
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSeasonDropdown()}
        {renderTabNavigation()}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    seasonContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    roundContainer: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    contentContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    loadingContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    errorText: {
      fontSize: theme.typography.body.fontSize,
      marginBottom: theme.spacing.md,
      textAlign: "center",
      color: theme.colors.error,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    retryButtonText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.onPrimary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
    },
    matchesContainer: {
      flex: 1,
    },
    matchesContent: {
      padding: theme.spacing.xs,
    },
    matchCardWrapper: {
      // Container for individual match cards
    },
    matchCardSpacing: {
      marginBottom: theme.spacing.sm,
    },
  });
