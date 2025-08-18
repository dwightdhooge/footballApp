import { useState, useEffect, useCallback } from "react";
import { Fixture, Season } from "@/types/api";
import { fetchRounds } from "@/services/api/rounds";
import { fetchCupFixtures } from "@/services/api/fixtures";
import { checkCurrentRound as getCurrentRound } from "@/services/api";

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

  // 🎯 Alle seasons beschikbaar maken, SeasonDropdown filtert op basis van coverageType
  const availableSeasons = seasons ? [...seasons].reverse() : [];

  // Initialize season
  useEffect(() => {
    if (availableSeasons.length > 0) {
      // 🎯 Omdraaien van seasons volgorde: nieuwste wordt eerste
      const reversedSeasons = [...seasons].reverse();

      // Zoek current season in omgekeerde volgorde, fallback naar eerste (nieuwste)
      const initial =
        initialSeason ||
        reversedSeasons.find((s) => s.current) ||
        reversedSeasons[0];
      setSelectedSeason(initial);
    }
  }, [seasons, initialSeason, availableSeasons]);

  const fetchRoundsForSeason = useCallback(async () => {
    if (!selectedSeason) return;
    try {
      setIsLoadingRounds(true);
      setRoundsError(null);

      const roundsData = await fetchRounds(cupId, selectedSeason.year);
      setRounds(roundsData);

      const current = await getCurrentRound(cupId, selectedSeason.year);
      setCurrentRound(current || null);

      // Select round: prefer current round, fallback to first round from API order
      let roundToSelect: string | null = null;
      if (current && roundsData.includes(current)) {
        roundToSelect = current;
      } else if (roundsData.length > 0) {
        roundToSelect = roundsData[0];
      }
      setSelectedRound(roundToSelect);
    } catch (error) {
      setRoundsError(error instanceof Error ? error.message : "Unknown error");
      setRounds([]);
      setCurrentRound(null);
      setSelectedRound(null);
    } finally {
      setIsLoadingRounds(false);
    }
  }, [cupId, selectedSeason]);

  const fetchFixturesForRound = useCallback(async () => {
    if (!selectedSeason || !selectedRound) return;
    try {
      setIsLoadingFixtures(true);
      setFixturesError(null);

      const data = await fetchCupFixtures(
        cupId,
        selectedSeason.year,
        selectedRound
      );
      setFixtures(data);
    } catch (error) {
      setFixturesError(
        error instanceof Error ? error.message : "Unknown error"
      );
      setFixtures([]);
    } finally {
      setIsLoadingFixtures(false);
    }
  }, [cupId, selectedSeason, selectedRound]);

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
    availableSeasons, // 🎯 Nu beschikbaar voor de screen

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
