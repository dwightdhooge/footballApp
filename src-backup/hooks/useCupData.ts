import { useState, useEffect, useCallback } from "react";
import { Fixture, Season } from "@/types/api";
import { fetchRounds } from "@/services/api/rounds";
import { fetchCupFixtures } from "@/services/api/fixtures";
import { checkCurrentRound as getCurrentRound } from "@/services/api";
import {
  fetchWithDeduplication,
  generateCacheKey,
  getRoundCacheInfo,
} from "@/services/cache";
import { cacheStorage } from "@/services/cache";

interface UseCupDataReturn {
  // Season management
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season | null) => void;
  availableSeasons: Season[]; // 🎯 Gefilterde en omgekeerde seasons

  // Rounds
  rounds: string[];
  currentRound: string | null;
  selectedRound: string | null;
  setSelectedRound: (round: string | null) => void;

  // Fixtures
  fixtures: Fixture[];

  // Loading states
  isLoadingRounds: boolean;
  isLoadingFixtures: boolean;

  // Errors
  roundsError: string | null;
  fixturesError: string | null;

  // Actions
  refetchRounds: () => Promise<void>;
  refetchFixtures: () => Promise<void>;
}

export const useCupData = (
  cupId: number,
  seasons: Season[],
  initialSeason?: Season | null
): UseCupDataReturn => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [rounds, setRounds] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);

  const [roundsError, setRoundsError] = useState<string | null>(null);
  const [fixturesError, setFixturesError] = useState<string | null>(null);

  // Initialize season - only run once when component mounts
  useEffect(() => {
    console.log("useCupData: Initializing season", {
      seasonsLength: seasons?.length,
      selectedSeason: selectedSeason?.year,
      initialSeason: initialSeason?.year,
    });

    if (seasons && seasons.length > 0 && !selectedSeason) {
      // 🎯 Omdraaien van seasons volgorde: nieuwste wordt eerste
      const reversedSeasons = [...seasons].reverse();

      // Zoek current season in omgekeerde volgorde, fallback naar eerste (nieuwste)
      const initial =
        initialSeason ||
        reversedSeasons.find((s) => s.current) ||
        reversedSeasons[0];

      console.log("useCupData: Setting initial season to", initial?.year);
      setSelectedSeason(initial);
    }
  }, [seasons, initialSeason]); // Include seasons and initialSeason as dependencies

  const fetchRoundsForSeason = useCallback(async () => {
    if (!selectedSeason) return;

    const cacheKey = generateCacheKey.rounds(
      cupId.toString(),
      selectedSeason.year.toString()
    );

    // Check cache first
    const cachedRounds = cacheStorage.get<string[]>(cacheKey);
    if (cachedRounds) {
      setRounds(cachedRounds);
      setIsLoadingRounds(false);

      // Fetch current round separately (this doesn't block the dropdown)
      const current = await getCurrentRound(cupId, selectedSeason.year);
      setCurrentRound(current || null);

      // Only auto-select round if user hasn't manually selected one
      if (!selectedRound) {
        let roundToSelect: string | null = null;
        if (current && cachedRounds.includes(current)) {
          roundToSelect = current;
        } else if (cachedRounds.length > 0) {
          roundToSelect = cachedRounds[0];
        }
        setSelectedRound(roundToSelect);
      } else {
        // If user has selected a round, check if it's still valid for the new season
        if (!cachedRounds.includes(selectedRound)) {
          setSelectedRound(null);
        }
      }
      return;
    }

    try {
      setIsLoadingRounds(true);
      setRoundsError(null);

      const roundsData = await fetchWithDeduplication(cacheKey, () =>
        fetchRounds(cupId, selectedSeason.year)
      );

      // Store in cache
      cacheStorage.set(cacheKey, roundsData);
      setRounds(roundsData);

      // Enable the round dropdown as soon as rounds data is available
      setIsLoadingRounds(false);

      // Fetch current round separately (this doesn't block the dropdown)
      const current = await getCurrentRound(cupId, selectedSeason.year);
      setCurrentRound(current || null);

      // Only auto-select round if user hasn't manually selected one
      if (!selectedRound) {
        let roundToSelect: string | null = null;
        if (current && roundsData.includes(current)) {
          roundToSelect = current;
        } else if (roundsData.length > 0) {
          roundToSelect = roundsData[0];
        }
        setSelectedRound(roundToSelect);
      } else {
        // If user has selected a round, check if it's still valid for the new season
        if (!roundsData.includes(selectedRound)) {
          setSelectedRound(null);
        }
      }
    } catch (error) {
      setRoundsError(error instanceof Error ? error.message : "Unknown error");
      setRounds([]);
      setCurrentRound(null);
      setSelectedRound(null);
      setIsLoadingRounds(false);
    }
  }, [cupId, selectedSeason, selectedRound]);

  const fetchFixturesForRound = useCallback(async () => {
    if (!selectedSeason || !selectedRound) return;

    const baseCacheKey = `CUP_FIXTURES_${cupId}_${selectedSeason.year}_${selectedRound}`;

    // Check cache first
    const cachedFixtures = cacheStorage.get<Fixture[]>(baseCacheKey);
    if (cachedFixtures) {
      setFixtures(cachedFixtures);
      setIsLoadingFixtures(false);
      return;
    }

    try {
      setIsLoadingFixtures(true);
      setFixturesError(null);

      const data = await fetchWithDeduplication(baseCacheKey, () =>
        fetchCupFixtures(cupId, selectedSeason.year, selectedRound)
      );

      // Get smart cache info for this round
      const isCurrentRound = selectedRound === currentRound;
      const finalCacheInfo = getRoundCacheInfo(
        data,
        cupId.toString(),
        selectedSeason.year.toString(),
        selectedRound,
        isCurrentRound
      );

      // Store in cache with smart TTL
      cacheStorage.set(finalCacheInfo.key, data, finalCacheInfo.ttl);

      setFixtures(data);
    } catch (error) {
      setFixturesError(
        error instanceof Error ? error.message : "Unknown error"
      );
      setFixtures([]);
    } finally {
      setIsLoadingFixtures(false);
    }
  }, [cupId, selectedSeason, selectedRound, currentRound]);

  // Fetch rounds when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchRoundsForSeason();
    }
  }, [selectedSeason, fetchRoundsForSeason]);

  // Fetch fixtures when round changes
  useEffect(() => {
    if (selectedSeason && selectedRound) {
      fetchFixturesForRound();
    }
  }, [selectedSeason, selectedRound, fetchFixturesForRound]);

  // Debug: Monitor season changes
  useEffect(() => {
    console.log("useCupData: selectedSeason changed to", selectedSeason?.year);
  }, [selectedSeason]);

  // Debug: Monitor round changes
  useEffect(() => {
    console.log("useCupData: selectedRound changed to", selectedRound);
  }, [selectedRound]);

  const refetchRounds = useCallback(async () => {
    await fetchRoundsForSeason();
  }, [fetchRoundsForSeason]);

  const refetchFixtures = useCallback(async () => {
    await fetchFixturesForRound();
  }, [fetchFixturesForRound]);

  return {
    // Season
    selectedSeason,
    setSelectedSeason,
    availableSeasons: seasons ? [...seasons].reverse() : [], // 🎯 Nu beschikbaar voor de screen

    // Rounds
    rounds,
    currentRound,
    selectedRound,
    setSelectedRound,

    // Fixtures
    fixtures,

    // Loading
    isLoadingRounds,
    isLoadingFixtures,

    // Errors
    roundsError,
    fixturesError,

    // Actions
    refetchRounds,
    refetchFixtures,
  };
};
