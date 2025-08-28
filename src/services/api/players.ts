import {
  PlayerProfile,
  PlayerTeam,
  PlayerProfileApiResponse,
  PlayerSearchApiResponse,
} from "@/types/api";
import { API_CONFIG } from "./config";

/**
 * Fetch player profile data
 */
export const fetchPlayerProfile = async (
  playerId: number
): Promise<PlayerProfile> => {
  const response = await fetch(
    `${API_CONFIG.baseURL}players/profiles?player=${playerId}`,
    {
      headers: API_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: PlayerProfileApiResponse = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(`API Error: ${data.errors.join(", ")}`);
  }

  if (!data.response || data.response.length === 0) {
    throw new Error("No player profile data found");
  }

  return data.response[0];
};

/**
 * Fetch player career/teams data
 */
export const fetchPlayerTeams = async (
  playerId: number
): Promise<PlayerTeam[]> => {
  const response = await fetch(
    `${API_CONFIG.baseURL}players/teams?player=${playerId}`,
    {
      headers: API_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(`API Error: ${data.errors.join(", ")}`);
  }

  return data.response || [];
};

/**
 * Search players by name
 */
export const searchPlayers = async (
  query: string
): Promise<PlayerProfile[]> => {
  const response = await fetch(
    `${API_CONFIG.baseURL}players/profiles?search=${encodeURIComponent(query)}`,
    {
      headers: API_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: PlayerSearchApiResponse = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(`API Error: ${data.errors.join(", ")}`);
  }

  return data.response || [];
};
