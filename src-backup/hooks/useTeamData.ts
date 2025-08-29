import { useState, useEffect } from "react";
import { fetchTeamDetail } from "@/services/api";
import { TeamDetail } from "@/types/api";

export const useTeamData = (teamId: number) => {
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!teamId) return;

      try {
        setIsLoading(true);
        setError(null);
        const teamData = await fetchTeamDetail(teamId);
        setTeam(teamData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team data");
        console.error("Error loading team data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [teamId]);

  const refetch = async () => {
    if (!teamId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const teamData = await fetchTeamDetail(teamId);
      setTeam(teamData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team data");
      console.error("Error loading team data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    team,
    isLoading,
    error,
    refetch,
  };
};
