import React, { useState, useEffect, useLayoutEffect } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import { useLeagueData } from "@/core/hooks/useLeagueData";

import { CachedImage } from "@/components/common/CachedImage";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { SeasonDropdown } from "@/components/common/SeasonDropdown";
import { RoundDropdown } from "@/components/common/RoundDropdown";
import { StandingsTable } from "@/components/league/StandingsTable";
import { LeagueItem, Fixture } from "@/core/types/api";
import { MatchCard } from "@/components/match/MatchCard";

interface RouteParams {
  item: LeagueItem;
}

export const LeagueDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { item } = route.params as RouteParams;

  const styles = getStyles(theme);

  // Set up header with league info and favorite button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <CachedImage
            url={item.league.logo}
            size={24}
            fallbackText={t("leagueDetail.league")}
            borderRadius={4}
            resizeMode="contain"
            ttl={30 * 24 * 60 * 60 * 1000} // 30 days for league logos
            style={styles.headerLeagueLogo}
          />
          <View style={styles.headerTextContainer}>
            <Text
              style={[styles.headerLeagueName, { color: theme.colors.text }]}
            >
              {item.league.name}
            </Text>
            <Text
              style={[
                styles.headerCountryName,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.country.name}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <FavoriteButton
          item={item}
          type="leagues"
          style={styles.headerButton}
        />
      ),
    });
  }, [
    navigation,
    item,
    styles.headerButton,
    styles.headerTitle,
    styles.headerLeagueLogo,
    styles.headerTextContainer,
    styles.headerLeagueName,
    styles.headerCountryName,
    theme.colors.text,
    theme.colors.textSecondary,
    t,
  ]);

  // Local state for UI
  const [activeTab, setActiveTab] = useState<"standings" | "matches">(
    "standings"
  );
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  // 🎯 Eén hook voor alle data logica!
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
  } = useLeagueData(item.league.id, item.seasons, undefined, selectedRound);

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
    navigation.navigate("TeamDetail", {
      item: team,
    });
  };

  const handleMatchPress = (fixture: Fixture) => {
    navigation.navigate("MatchDetail", {
      item: fixture,
      leagueId: item.league.id,
      season: selectedSeason?.year,
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

  return (
    <SafeAreaView style={styles.container}>
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
};

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
    headerTitle: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerLeagueLogo: {
      marginRight: theme.spacing.sm,
    },
    headerTextContainer: {
      flexDirection: "column",
    },
    headerLeagueName: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      lineHeight: theme.typography.h3.fontSize,
    },
    headerCountryName: {
      fontSize: theme.typography.small.fontSize,
      lineHeight: theme.typography.small.fontSize,
    },
    headerButton: {
      marginRight: theme.spacing.md,
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
    heartButton: {
      padding: theme.spacing.sm,
    },
  });
