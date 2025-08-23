import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {
  useRoute,
  useNavigation,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { ScoresStackParamList } from "@/types/navigation";
import { useLeagueData } from "@/hooks";
import {
  SeasonDropdown,
  RoundDropdown,
  StandingsTable,
  MatchCard,
  FlagSvg,
} from "@/components";
import CachedImage from "@/components/common/CachedImage";
import { LeagueItem, Fixture } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/context/FavoritesContext";

type LeagueDetailRouteProp = RouteProp<ScoresStackParamList, "LeagueDetail">;
type LeagueDetailNavigationProp = NavigationProp<
  ScoresStackParamList,
  "LeagueDetail"
>;

interface RouteParams {
  item: LeagueItem;
}

const LeagueDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { item } = route.params as RouteParams;

  const styles = getStyles(theme);

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
    availableSeasons, // 🎯 Nu uit de hook
    isLoadingStandings,
    isLoadingFixtures,
    isLoadingRounds,
    standingsError,
    fixturesError,
    roundsError,
    refetchStandings,
    refetchFixtures,
    refetchRounds,
    canShowStandings,
    canShowFixtures,
  } = useLeagueData(item.league.id, item.seasons, undefined, selectedRound);

  // Favorites functionality
  const {
    isItemFavorite,
    addFavoriteItem,
    removeFavoriteItem,
  } = useFavorites();

  const handleToggleFavorite = async () => {
    try {
      if (isItemFavorite(item, "competition")) {
        await removeFavoriteItem(
          `competition_${item.league.id}`,
          "competition"
        );
      } else {
        await addFavoriteItem(item, "competition");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Set selected round when current round changes
  useEffect(() => {
    if (currentRound && !selectedRound) {
      setSelectedRound(currentRound);
    }
  }, [currentRound, selectedRound]);

  // Load fixtures when round changes
  useEffect(() => {
    if (selectedRound && activeTab === "matches") {
      // Trigger fixtures fetch through the hook
      // The hook will handle this automatically
    }
  }, [selectedRound, activeTab]);

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
    // Navigate to team detail (to be implemented)
    Alert.alert(t("leagueDetail.teamDetail"), `Navigate to ${team.name}`);
  };

  const handleMatchPress = (fixture: Fixture) => {
    navigation.navigate("MatchDetail", {
      item: fixture,
      leagueId: item.league.id,
      season: selectedSeason?.year,
    });
  };

  const renderLeagueInfo = () => (
    <View
      style={[
        styles.leagueInfoContainer,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <CachedImage
        url={item.league.logo}
        size={48}
        fallbackText={t("leagueDetail.league")}
        borderRadius={8}
        resizeMode="contain"
        ttl={30 * 24 * 60 * 60 * 1000} // 30 days for league logos
        style={styles.leagueLogo}
      />
      <View style={styles.leagueText}>
        <Text style={[styles.leagueName, { color: theme.colors.text }]}>
          {item.league.name}
        </Text>
        <Text
          style={[styles.countryName, { color: theme.colors.textSecondary }]}
        >
          {item.country.name}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={handleToggleFavorite}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isItemFavorite(item, "competition") ? "heart" : "heart-outline"}
          size={24}
          color={
            isItemFavorite(item, "competition")
              ? theme.colors.error
              : theme.colors.textSecondary
          }
        />
      </TouchableOpacity>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
    leagueInfoContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
    },
    leagueLogo: {
      marginRight: 16,
    },
    leagueText: {
      flex: 1,
    },
    leagueName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
    },
    countryName: {
      fontSize: 16,
    },
    seasonContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    roundContainer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
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
      color: theme.colors.onPrimary,
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
    heartButton: {
      padding: 8,
    },
  });

export default LeagueDetailScreen;
