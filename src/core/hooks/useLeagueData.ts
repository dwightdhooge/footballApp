import { useState, useEffect, useCallback } from "react";
import { Standing, Fixture, Season } from "@/core/types/api";
import {
  fetchStandings,
  fetchFixtures,
  fetchRounds,
  checkCurrentRound,
} from "@/services/api";
import {
  fetchWithDeduplication,
  generateCacheKey,
  getRoundCacheInfo,
} from "@/services/cache";
import { cacheStorage } from "@/services/cache";

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

  // Initialize with first available season (ONLY ONCE)
  useEffect(() => {
    if (availableSeasons.length > 0 && !selectedSeason) {
      // 🎯 Omdraaien van seasons volgorde: nieuwste wordt eerste
      const reversedSeasons = [...seasons].reverse();

      const currentSeason =
        initialSeason ||
        reversedSeasons.find((season) => season.current) ||
        reversedSeasons[0];
      setSelectedSeason(currentSeason);
    }
  }, [seasons, initialSeason]);

  const fetchStandingsData = useCallback(async () => {
    if (!selectedSeason) return;

    try {
      setIsLoadingStandings(true);
      setStandingsError(null);

      // Generate smart cache key for standings
      const cacheKey = generateCacheKey.standings(
        leagueId.toString(),
        selectedSeason.year.toString()
      );

      // Check cache first
      const cachedStandings = cacheStorage.get<Standing[]>(cacheKey);
      if (cachedStandings) {
        console.log(`[Standings] Cache HIT for season: ${selectedSeason.year}`);
        setStandings(cachedStandings);
        setIsLoadingStandings(false);
        return;
      }

      console.log(
        `[Standings] Cache MISS for season: ${selectedSeason.year}, fetching from API...`
      );

      // Use request deduplication to prevent multiple simultaneous requests
      const standingsData = await fetchWithDeduplication(cacheKey, () =>
        fetchStandings(leagueId, selectedSeason.year)
      );

      // Store in cache
      cacheStorage.set(cacheKey, standingsData);
      console.log(`[Standings] Stored in cache with key: ${cacheKey}`);

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

      // Generate smart cache key for rounds
      const cacheKey = generateCacheKey.rounds(
        leagueId.toString(),
        selectedSeason.year.toString()
      );

      // Check cache first
      const cachedRounds = cacheStorage.get<string[]>(cacheKey);
      if (cachedRounds) {
        console.log(`[Rounds] Cache HIT for season: ${selectedSeason.year}`);
        setRounds(cachedRounds);

        // Check for current round in cache
        const cachedCurrentRound = cacheStorage.get<string>(
          `CURRENT_ROUND_${leagueId}_${selectedSeason.year}`
        );
        if (cachedCurrentRound) {
          setCurrentRound(cachedCurrentRound);
        } else if (cachedRounds.length > 0) {
          setCurrentRound(cachedRounds[0]);
        }

        setIsLoadingRounds(false);
        return;
      }

      console.log(
        `[Rounds] Cache MISS for season: ${selectedSeason.year}, fetching from API...`
      );

      // Use request deduplication to prevent multiple simultaneous requests
      const roundsData = await fetchWithDeduplication(cacheKey, () =>
        fetchRounds(leagueId, selectedSeason.year)
      );
      setRounds(roundsData);

      // Check for current round
      const currentRoundData = await fetchWithDeduplication(
        `CURRENT_ROUND_${leagueId}_${selectedSeason.year}`,
        () => checkCurrentRound(leagueId, selectedSeason.year)
      );
      if (currentRoundData) {
        setCurrentRound(currentRoundData);
        // Cache the current round
        cacheStorage.set(
          `CURRENT_ROUND_${leagueId}_${selectedSeason.year}`,
          currentRoundData
        );
      } else if (roundsData.length > 0) {
        setCurrentRound(roundsData[0]);
      }

      // Store rounds in cache
      cacheStorage.set(cacheKey, roundsData);
      console.log(`[Rounds] Stored in cache with key: ${cacheKey}`);
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

        // Generate smart cache key and TTL based on round and fixture statuses
        const { key: baseCacheKey, ttl } = getRoundCacheInfo(
          [], // Empty array initially, we'll update after fetching
          leagueId.toString(),
          selectedSeason.year.toString(),
          selectedRound,
          selectedRound === currentRound
        );

        // Check cache first
        const cachedFixtures = cacheStorage.get<Fixture[]>(baseCacheKey);
        if (cachedFixtures) {
          console.log(`[Fixtures] Cache HIT for round: ${selectedRound}`);
          setFixtures(cachedFixtures);
          setIsLoadingFixtures(false);
          return;
        }

        console.log(
          `[Fixtures] Cache MISS for round: ${selectedRound}, fetching from API...`
        );

        // Use request deduplication to prevent multiple simultaneous requests
        const fixturesData = await fetchWithDeduplication(baseCacheKey, () =>
          fetchFixtures(leagueId, selectedSeason.year, selectedRound)
        );

        // Now get the final cache info with actual fixture data
        const finalCacheInfo = getRoundCacheInfo(
          fixturesData,
          leagueId.toString(),
          selectedSeason.year.toString(),
          selectedRound,
          selectedRound === currentRound
        );

        // Store in cache with smart round-based key and custom TTL
        cacheStorage.set(finalCacheInfo.key, fixturesData, finalCacheInfo.ttl);
        console.log(
          `[Fixtures] Stored in cache with key: ${finalCacheInfo.key} (TTL: ${finalCacheInfo.ttl}ms)`
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
    [leagueId, selectedSeason, currentRound]
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
      console.log("useEffect fetchStandingsData", selectedSeason);
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
