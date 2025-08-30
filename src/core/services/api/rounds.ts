import { API_CONFIG } from "./config";

export interface RoundsApiResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
    current?: boolean;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: string[];
}

export const fetchRounds = async (
  leagueId: number,
  season: number
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${leagueId}&season=${season}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: RoundsApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Validate and parse rounds data
    return validateRounds(data);
  } catch (error) {
    console.error("Rounds API error:", error);
    throw error;
  }
};

export const checkCurrentRound = async (
  leagueId: number,
  season: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${leagueId}&season=${season}&current=true`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      return null; // No current round
    }

    const data: RoundsApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      return null;
    }

    // Return current round if available
    if (data.response && data.response.length > 0) {
      return data.response[0];
    }

    return null;
  } catch (error) {
    console.error("Current round check error:", error);
    return null;
  }
};

export const getCurrentRound = async (
  leagueId: number,
  season: number
): Promise<string | null> => {
  return checkCurrentRound(leagueId, season);
};

const validateRounds = (data: RoundsApiResponse): string[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }

  const validRounds = data.response.filter(
    (round) => round && typeof round === "string"
  );

  // Remove duplicates
  const uniqueRounds = validRounds.filter((round, index, array) => {
    return array.indexOf(round) === index;
  });

  return uniqueRounds;
};
