import { useState, useEffect, useCallback } from "react";
import { Player, PlayerTeam } from "@/core/types/api";
import { fetchPlayerProfile, fetchPlayerTeams } from "@/services/api/players";

interface UsePlayerDataReturn {
  // Data
  playerProfile: Player | null;
  careerData: PlayerTeam[];

  // Loading states
  isLoadingProfile: boolean;
  isLoadingCareer: boolean;

  // Error handling
  profileError: string | null;
  careerError: string | null;

  // Actions
  refetchProfile: () => Promise<void>;
  refetchCareer: () => Promise<void>;
  clearProfileError: () => void;
  clearCareerError: () => Promise<void>;
}

export const usePlayerData = (
  playerId: number,
  initialProfile?: Player | null
): UsePlayerDataReturn => {
  const [playerProfile, setPlayerProfile] = useState<Player | null>(
    initialProfile || null
  );
  const [careerData, setCareerData] = useState<PlayerTeam[]>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState(!initialProfile);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [careerError, setCareerError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setProfileError(null);

      const profile = await fetchPlayerProfile(playerId);
      console.log("profile", profile);
      setPlayerProfile(profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load player profile";
      setProfileError(errorMessage);
      console.error("Player profile fetch error:", err);

      // Keep initial profile as fallback if available
      if (initialProfile) {
        setPlayerProfile(initialProfile);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [playerId, initialProfile]);

  const fetchCareer = useCallback(async () => {
    if (careerData.length > 0) return; // Already loaded

    try {
      setIsLoadingCareer(true);
      setCareerError(null);

      const teams = await fetchPlayerTeams(playerId);
      setCareerData(teams);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load career data";
      setCareerError(errorMessage);
      console.error("Career data fetch error:", err);
    } finally {
      setIsLoadingCareer(false);
    }
  }, [playerId, careerData.length]);

  const refetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const refetchCareer = useCallback(async () => {
    setCareerData([]); // Clear existing data to force reload
    await fetchCareer();
  }, [fetchCareer]);

  const clearProfileError = useCallback(() => {
    setProfileError(null);
  }, []);

  const clearCareerError = useCallback(async () => {
    setCareerError(null);
  }, []);

  // Load profile when player ID changes
  useEffect(() => {
    if (playerId) {
      fetchProfile();
    }
  }, [playerId, fetchProfile]);

  return {
    // Data
    playerProfile,
    careerData,

    // Loading states
    isLoadingProfile,
    isLoadingCareer,

    // Error handling
    profileError,
    careerError,

    // Actions
    refetchProfile,
    refetchCareer,
    clearProfileError,
    clearCareerError,
  };
};
