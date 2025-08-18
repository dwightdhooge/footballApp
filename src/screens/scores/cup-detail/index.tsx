import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LeagueItem, Season, Fixture } from "../../../types/api";
import { ScoresStackParamList } from "../../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";

// Components
import CupHeader from "../../../components/CupHeader";
import CupInfo from "../../../components/CupInfo";
import SeasonDropdown from "../../../components/SeasonDropdown";
import RoundDropdown from "../../../components/RoundDropdown";
import MatchesList from "../../../components/MatchesList";

// Services
import { fetchRounds, getCurrentRound } from "../../../services/api/rounds";
import { fetchCupFixtures } from "../../../services/api/fixtures";

// Utils
import { canShowFixtures } from "../../../utils/helpers";

type CupDetailScreenNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "CupDetail"
>;

type CupDetailScreenRouteProp = RouteProp<ScoresStackParamList, "CupDetail">;

const CupDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<CupDetailScreenRouteProp>();
  const navigation = useNavigation<CupDetailScreenNavigationProp>();
  const { item: cup } = route.params;

  const styles = getStyles(theme);

  // State management
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [rounds, setRounds] = useState<string[]>([]);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  // Loading states
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);

  // Error states
  const [seasonsError, setSeasonsError] = useState<string | null>(null);
  const [roundsError, setRoundsError] = useState<string | null>(null);
  const [fixturesError, setFixturesError] = useState<string | null>(null);

  // Initialize with first available season
  useEffect(() => {
    if (cup.seasons && cup.seasons.length > 0) {
      const availableSeasons = cup.seasons.filter(canShowFixtures);
      if (availableSeasons.length > 0) {
        const currentSeason =
          availableSeasons.find((season) => season.current) ||
          availableSeasons.reduce((latest, season) =>
            season.year > latest.year ? season : latest
          );
        setSelectedSeason(currentSeason);
      }
    }
  }, [cup.seasons]);

  // Fetch rounds when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchRoundsForSeason(cup.league.id, selectedSeason.year);
    }
  }, [selectedSeason, cup.league.id]);

  // Fetch fixtures when round changes
  useEffect(() => {
    if (selectedSeason && selectedRound) {
      fetchFixturesForRound(cup.league.id, selectedSeason.year, selectedRound);
    }
  }, [selectedSeason, selectedRound, cup.league.id]);

  const fetchRoundsForSeason = useCallback(
    async (cupId: number, season: number) => {
      try {
        setIsLoadingRounds(true);
        setRoundsError(null);

        const roundsData = await fetchRounds(cupId, season);
        setRounds(roundsData);

        // Get current round if available
        const currentRoundData = await getCurrentRound(cupId, season);
        setCurrentRound(currentRoundData);

        // Set selected round to current round or most recent round
        if (currentRoundData) {
          setSelectedRound(currentRoundData);
        } else if (roundsData.length > 0) {
          const mostRecentRound = getMostRecentRound(roundsData);
          setSelectedRound(mostRecentRound);
        }
      } catch (error) {
        console.error("Rounds API error:", error);
        setRoundsError(
          error instanceof Error ? error.message : t("errors.unknownError")
        );
        setRounds([]);
      } finally {
        setIsLoadingRounds(false);
      }
    },
    []
  );

  // Helper function to get the most recent round based on cup progression
  const getMostRecentRound = (rounds: string[]): string => {
    const roundPriority = [
      "Final",
      t("cupDetail.roundNames.Semi-finals"),
      t("cupDetail.roundNames.Quarter-finals"),
      "Round of 16",
      "Round of 32",
      "Round of 64",
      t("cupDetail.roundNames.Qualifying Round"),
      t("cupDetail.roundNames.Preliminary Round"),
    ];

    // Find the round with the highest priority (lowest index = highest priority)
    for (const priorityRound of roundPriority) {
      if (rounds.includes(priorityRound)) {
        return priorityRound;
      }
    }

    // If no priority round found, return the first round
    return rounds[0];
  };

  const fetchFixturesForRound = useCallback(
    async (cupId: number, season: number, round: string) => {
      try {
        setIsLoadingFixtures(true);
        setFixturesError(null);

        const fixturesData = await fetchCupFixtures(cupId, season, round);
        setFixtures(fixturesData);
      } catch (error) {
        console.error("Fixtures API error:", error);
        setFixturesError(
          error instanceof Error ? error.message : t("errors.unknownError")
        );
        setFixtures([]);
      } finally {
        setIsLoadingFixtures(false);
      }
    },
    []
  );

  const handleSeasonChange = useCallback((season: Season) => {
    setSelectedSeason(season);
    setSelectedRound(null);
    setFixtures([]);
  }, []);

  const handleRoundChange = useCallback((round: string) => {
    setSelectedRound(round);
  }, []);

  const handleMatchPress = useCallback((fixture: Fixture) => {
    // Navigate to match detail (to be implemented)
    Alert.alert(
      t("leagueDetail.matchDetail"),
      "Match detail screen to be implemented"
    );
  }, []);

  const handleRetry = useCallback(() => {
    if (selectedSeason) {
      fetchRoundsForSeason(cup.league.id, selectedSeason.year);
    }
  }, [selectedSeason, cup.league.id, fetchRoundsForSeason]);

  // Filter seasons that have fixtures coverage
  const availableSeasons = cup.seasons?.filter(canShowFixtures) || [];

  return (
    <SafeAreaView style={styles.container}>
      <CupHeader title={cup.league.name} />
      <CupInfo cup={cup} />

      <View style={styles.content}>
        <View style={styles.dropdownsContainer}>
          <SeasonDropdown
            seasons={availableSeasons}
            selectedSeason={selectedSeason}
            onSeasonChange={handleSeasonChange}
            disabled={isLoadingSeasons}
            placeholder={t("leagueDetail.selectSeason")}
            showCurrent={true}
            size="medium"
            coverageType="fixtures"
            style={styles.seasonDropdown}
          />

          <RoundDropdown
            rounds={rounds}
            selectedRound={selectedRound}
            currentRound={currentRound}
            onRoundChange={handleRoundChange}
            disabled={isLoadingRounds || !selectedSeason}
            placeholder={t("cupDetail.selectRound")}
            showCurrent={true}
            size="medium"
            style={styles.roundDropdown}
          />
        </View>

        <View style={styles.matchesContainer}>
          <MatchesList
            fixtures={fixtures}
            isLoading={isLoadingFixtures}
            error={fixturesError}
            onMatchPress={handleMatchPress}
            onRetry={handleRetry}
          />
        </View>
      </View>
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
    dropdownsContainer: {
      borderBottomWidth: 1,
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    seasonDropdown: {
      marginBottom: theme.spacing.sm,
    },
    roundDropdown: {
      marginBottom: 0,
    },
    matchesContainer: {
      flex: 1,
    },
  });

export default CupDetailScreen;
