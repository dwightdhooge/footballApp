import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {
  SeasonDropdown,
  StandingsTable,
  MatchCard,
  RoundDropdown,
} from "../../../components";
import {
  fetchStandings,
  fetchFixtures,
  fetchRounds,
  checkCurrentRound,
} from "../../../services/api";
import { LeagueItem, Season, Standing, Fixture } from "../../../types/api";

interface RouteParams {
  item: LeagueItem;
}

const LeagueDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as RouteParams;

  const styles = getStyles(theme);

  // State management
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [activeTab, setActiveTab] = useState<"standings" | "matches">(
    "standings"
  );
  const [standings, setStandings] = useState<Standing[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoadingStandings, setIsLoadingStandings] = useState(false);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [standingsError, setStandingsError] = useState<string | null>(null);
  const [roundsError, setRoundsError] = useState<string | null>(null);
  const [fixturesError, setFixturesError] = useState<string | null>(null);

  // Initialize with first available season
  useEffect(() => {
    if (item.seasons && item.seasons.length > 0) {
      const currentSeason =
        item.seasons.find((season) => season.current) || item.seasons[0];
      setSelectedSeason(currentSeason);
    }
  }, [item.seasons]);

  // Fetch data when season changes
  useEffect(() => {
    if (selectedSeason) {
      if (activeTab === "standings") {
        fetchStandingsData();
      } else {
        fetchRoundsData();
      }
    }
  }, [selectedSeason, activeTab]);

  // Fetch fixtures when round changes
  useEffect(() => {
    if (activeTab === "matches" && selectedSeason && selectedRound) {
      fetchFixturesData();
    }
  }, [selectedRound, activeTab]);

  const fetchStandingsData = async () => {
    if (!selectedSeason) return;

    try {
      setIsLoadingStandings(true);
      setStandingsError(null);

      const standingsData = await fetchStandings(
        item.league.id,
        selectedSeason.year
      );
      setStandings(standingsData);
    } catch (error) {
      console.error("Error fetching standings:", error);
      setStandingsError(
        error instanceof Error ? error.message : t("errors.unknownError")
      );
      setStandings([]);
    } finally {
      setIsLoadingStandings(false);
    }
  };

  const fetchRoundsData = async () => {
    if (!selectedSeason) return;

    try {
      setIsLoadingRounds(true);
      setRoundsError(null);

      const roundsData = await fetchRounds(item.league.id, selectedSeason.year);
      setRounds(roundsData);

      // Check for current round
      const currentRoundData = await checkCurrentRound(
        item.league.id,
        selectedSeason.year
      );
      if (currentRoundData) {
        setCurrentRound(currentRoundData);
        setSelectedRound(currentRoundData);
      } else if (roundsData.length > 0) {
        setSelectedRound(roundsData[0]);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      setRoundsError(
        error instanceof Error ? error.message : t("errors.unknownError")
      );
      setRounds([]);
    } finally {
      setIsLoadingRounds(false);
    }
  };

  const fetchFixturesData = async () => {
    if (!selectedSeason || !selectedRound) return;

    try {
      setIsLoadingFixtures(true);
      setFixturesError(null);

      const fixturesData = await fetchFixtures(
        item.league.id,
        selectedSeason.year,
        selectedRound
      );
      setFixtures(fixturesData);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setFixturesError(
        error instanceof Error ? error.message : t("errors.unknownError")
      );
      setFixtures([]);
    } finally {
      setIsLoadingFixtures(false);
    }
  };

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
    setSelectedRound(null);
    setCurrentRound(null);
    setFixtures([]);
  };

  const handleTabChange = (tab: "standings" | "matches") => {
    setActiveTab(tab);
    if (tab === "matches" && selectedSeason) {
      fetchRoundsData();
    }
  };

  const handleRoundChange = (round: string) => {
    setSelectedRound(round);
  };

  const handleTeamPress = (team: any) => {
    // Navigate to team detail (to be implemented)
    Alert.alert(t("leagueDetail.teamDetail"), `Navigate to ${team.name}`);
  };

  const handleMatchPress = (fixture: Fixture) => {
    // Navigate to match detail (to be implemented)
    Alert.alert(
      t("leagueDetail.matchDetail"),
      `Navigate to match ${fixture.fixture.id}`
    );
  };

  const canShowStandings = (season: Season): boolean => {
    return season.coverage?.standings === true;
  };

  const canShowFixtures = (season: Season): boolean => {
    return season.coverage?.fixtures?.events === true;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{t("common.back")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLeagueInfo = () => (
    <View style={styles.leagueInfoContainer}>
      <Image source={{ uri: item.league.logo }} style={styles.leagueLogo} />
      <View style={styles.leagueText}>
        <Text style={styles.leagueName}>{item.league.name}</Text>
        <Text style={styles.countryName}>{item.country.name}</Text>
      </View>
    </View>
  );

  const renderSeasonDropdown = () => (
    <View style={styles.seasonContainer}>
      <SeasonDropdown
        seasons={item.seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
        disabled={isLoadingStandings || isLoadingFixtures || isLoadingRounds}
        placeholder={t("leagueDetail.selectSeason")}
        showCurrent={true}
        size="medium"
        coverageType="standings"
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
            onPress={fetchStandingsData}
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRoundsData}
          >
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
                onPress={fetchFixturesData}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderLeagueInfo()}
        {renderSeasonDropdown()}
        {renderTabNavigation()}
        {activeTab === "standings"
          ? renderStandingsTable()
          : renderMatchesList()}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backButtonText: {
      color: theme.colors.primary,
      ...theme.typography.body,
    },
    leagueInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    leagueLogo: {
      width: 48,
      height: 48,
      marginRight: theme.spacing.sm,
    },
    leagueText: {
      flex: 1,
    },
    leagueName: {
      marginBottom: theme.spacing.xs,
      color: theme.colors.text,
      ...theme.typography.h3,
    },
    countryName: {
      opacity: 0.7,
      color: theme.colors.textSecondary,
      ...theme.typography.caption,
    },
    seasonContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    roundContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      color: theme.colors.textSecondary,
      ...theme.typography.caption,
    },
    activeTabText: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.textSecondary,
      ...theme.typography.body,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    errorText: {
      textAlign: "center",
      marginBottom: theme.spacing.md,
      color: theme.colors.error,
      ...theme.typography.body,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    retryButtonText: {
      color: "white",
      ...theme.typography.caption,
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
      ...theme.typography.body,
    },
    matchesContainer: {
      flex: 1,
    },
    matchesContent: {
      padding: theme.spacing.md,
    },
    matchCardWrapper: {
      // Container for individual match cards
    },
    matchCardSpacing: {
      marginBottom: theme.spacing.sm,
    },
  });

export default LeagueDetailScreen;
