import { useState, useEffect, useCallback } from "react";
import { Standing, Fixture, Season } from "../types/api";
import {
  fetchStandings,
  fetchFixtures,
  fetchRounds,
  checkCurrentRound,
} from "../services/api";

interface UseLeagueDataReturn {
  // Data
  standings: Standing[];
  fixtures: Fixture[];
  rounds: string[];
  currentRound: string | null;

  // Season management
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season | null) => void;
  availableSeasons: Season[]; // 🎯 Gefilterde en omgekeerde seasons

  // Loading states
  isLoadingStandings: boolean;
  isLoadingFixtures: boolean;
  isLoadingRounds: boolean;

  // Error handling
  standingsError: string | null;
  fixturesError: string | null;
  roundsError: string | null;

  // Actions
  refetchStandings: () => Promise<void>;
  refetchFixtures: () => Promise<void>;
  refetchRounds: () => Promise<void>;

  // Computed values
  canShowStandings: boolean;
  canShowFixtures: boolean;
}

/**
 * Custom hook for fetching league-related data (standings, fixtures, rounds)
 * with integrated season management
 */
export const useLeagueData = (
  leagueId: number,
  seasons: Season[],
  initialSeason?: Season | null,
  selectedRound?: string | null
): UseLeagueDataReturn => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  const [isLoadingStandings, setIsLoadingStandings] = useState(false);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);

  const [standingsError, setStandingsError] = useState<string | null>(null);
  const [fixturesError, setFixturesError] = useState<string | null>(null);
  const [roundsError, setRoundsError] = useState<string | null>(null);

  // 🎯 Gefilterde en omgekeerde seasons voor de dropdown
  const availableSeasons = seasons ? [...seasons].reverse() : [];

  // Initialize with first available season
  useEffect(() => {
    if (availableSeasons.length > 0) {
      // 🎯 Omdraaien van seasons volgorde: nieuwste wordt eerste
      const reversedSeasons = [...seasons].reverse();

      const currentSeason =
        initialSeason ||
        reversedSeasons.find((season) => season.current) ||
        reversedSeasons[0];
      setSelectedSeason(currentSeason);
    }
  }, [seasons, initialSeason, availableSeasons]);

  const fetchStandingsData = useCallback(async () => {
    if (!selectedSeason) return;

    try {
      setIsLoadingStandings(true);
      setStandingsError(null);

      const standingsData = await fetchStandings(leagueId, selectedSeason.year);
      setStandings(standingsData);
    } catch (error) {
      console.error("Error fetching standings:", error);
      setStandingsError(
        error instanceof Error ? error.message : "Unknown error"
      );
      setStandings([]);
    } finally {
      setIsLoadingStandings(false);
    }
  }, [leagueId, selectedSeason]);

  const fetchRoundsData = useCallback(async () => {
    if (!selectedSeason) return;

    try {
      setIsLoadingRounds(true);
      setRoundsError(null);

      const roundsData = await fetchRounds(leagueId, selectedSeason.year);
      setRounds(roundsData);

      // Check for current round
      const currentRoundData = await checkCurrentRound(
        leagueId,
        selectedSeason.year
      );
      if (currentRoundData) {
        setCurrentRound(currentRoundData);
      } else if (roundsData.length > 0) {
        setCurrentRound(roundsData[0]);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      setRoundsError(error instanceof Error ? error.message : "Unknown error");
      setRounds([]);
    } finally {
      setIsLoadingRounds(false);
    }
  }, [leagueId, selectedSeason]);

  const fetchFixturesData = useCallback(
    async (selectedRound?: string) => {
      if (!selectedSeason || !selectedRound) return;

      try {
        setIsLoadingFixtures(true);
        setFixturesError(null);

        const fixturesData = await fetchFixtures(
          leagueId,
          selectedSeason.year,
          selectedRound
        );
        setFixtures(fixturesData);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        setFixturesError(
          error instanceof Error ? error.message : "Unknown error"
        );
        setFixtures([]);
      } finally {
        setIsLoadingFixtures(false);
      }
    },
    [leagueId, selectedSeason]
  );

  const refetchStandings = useCallback(async () => {
    await fetchStandingsData();
  }, [fetchStandingsData]);

  const refetchFixtures = useCallback(async () => {
    await fetchFixturesData();
  }, [fetchFixturesData]);

  const refetchRounds = useCallback(async () => {
    await fetchRoundsData();
  }, [fetchRoundsData]);

  // Fetch standings when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchStandingsData();
    }
  }, [fetchStandingsData]);

  // Fetch rounds when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchRoundsData();
    }
  }, [fetchRoundsData]);

  // Fetch fixtures when round changes
  useEffect(() => {
    if (selectedRound && selectedSeason) {
      fetchFixturesData(selectedRound);
    }
  }, [selectedRound, selectedSeason, fetchFixturesData]);

  // Computed values
  const canShowStandings = selectedSeason?.coverage?.standings === true;
  const canShowFixtures = selectedSeason?.coverage?.fixtures?.events === true;

  return {
    // Data
    standings,
    fixtures,
    rounds,
    currentRound,

    // Season management
    selectedSeason,
    setSelectedSeason,
    availableSeasons, // 🎯 Nu beschikbaar voor de screen

    // Loading states
    isLoadingStandings,
    isLoadingFixtures,
    isLoadingRounds,

    // Error handling
    standingsError,
    fixturesError,
    roundsError,

    // Actions
    refetchStandings,
    refetchFixtures,
    refetchRounds,

    // Computed values
    canShowStandings,
    canShowFixtures,
  };
};
