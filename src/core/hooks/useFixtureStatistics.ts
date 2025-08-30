import { useState, useEffect } from "react";
import {
  fetchFixtureStatistics,
  processStatistics,
  findTeamStatistics,
} from "@/services/api/statistics";
import { ProcessedStats, TeamStatistics, Fixture } from "@/core/types/api";

interface UseFixtureStatisticsReturn {
  stats: ProcessedStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFixtureStatistics = (
  fixture: Fixture | null
): UseFixtureStatisticsReturn => {
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!fixture) {
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFixtureStatistics(
        fixture.fixture.id.toString()
      );

      if (response.errors.length > 0) {
        throw new Error(response.errors.join(", "));
      }

      // Handle empty response (no statistics available yet)
      if (response.response.length === 0) {
        setStats(null);
        return;
      }

      if (response.response.length < 2) {
        throw new Error("Insufficient statistics data");
      }

      // Find home and away team statistics
      const homeTeamId = fixture.teams.home.id;
      const awayTeamId = fixture.teams.away.id;

      const homeTeamStats = findTeamStatistics(response.response, homeTeamId);
      const awayTeamStats = findTeamStatistics(response.response, awayTeamId);

      if (!homeTeamStats || !awayTeamStats) {
        throw new Error("Could not find statistics for both teams");
      }

      const processedStats = processStatistics(homeTeamStats, awayTeamStats);
      setStats(processedStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch statistics";
      setError(errorMessage);
      console.error("Error fetching fixture statistics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fixture]);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
