import { useState, useEffect, useCallback } from "react";
import { League, Country } from "@/core/types/api";
import { fetchLeaguesForCountry } from "@/services/api/leagues";
import { fetchCountryByCode } from "@/services/api/countries";

interface UseCountryDataReturn {
  // Data
  country: Country | null;
  leagues: League[];
  cups: League[];

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;

  // Error handling
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => Promise<void>;
}

export const useCountryData = (countryCode: string): UseCountryDataReturn => {
  const [country, setCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [cups, setCups] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch both country data and leagues in parallel
      const [countryData, leaguesData] = await Promise.all([
        fetchCountryByCode(countryCode),
        fetchLeaguesForCountry(countryCode),
      ]);

      if (!countryData) {
        throw new Error("Land niet gevonden");
      }

      setCountry(countryData);

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

  const clearError = useCallback(async () => {
    setError(null);
  }, []);

  // Load data when country code changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    country,
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
