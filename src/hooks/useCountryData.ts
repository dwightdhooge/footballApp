import { useState, useEffect, useCallback } from "react";
import { LeagueItem } from "@/types/api";
import { fetchLeaguesForCountry } from "@/services/api/leagues";

interface UseCountryDataReturn {
  // Data
  leagues: LeagueItem[];
  cups: LeagueItem[];

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;

  // Error handling
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useCountryData = (countryCode: string): UseCountryDataReturn => {
  const [leagues, setLeagues] = useState<LeagueItem[]>([]);
  const [cups, setCups] = useState<LeagueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const leaguesData = await fetchLeaguesForCountry(countryCode);

      // Separate leagues and cups
      const leaguesList = leaguesData.filter(
        (item) => item.league.type === "League"
      );
      const cupsList = leaguesData.filter((item) => item.league.type === "Cup");

      setLeagues(leaguesList);
      setCups(cupsList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Onbekende fout opgetreden";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [countryCode]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load data when country code changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    leagues,
    cups,
    isLoading,
    isRefreshing,
    error,
    loadData,
    refresh,
    clearError,
  };
};
