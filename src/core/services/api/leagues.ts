import { API_CONFIG } from "./config";
import { LeaguesApiResponse, League } from "@/core/types/api";

// New interface for league search results
export interface LeagueSearchApiResponse {
  get: string;
  parameters: {
    search?: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: League[];
}

export const searchLeagues = async (searchTerm: string): Promise<League[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/leagues?search=${encodeURIComponent(searchTerm)}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LeagueSearchApiResponse = await response.json();

    if (!data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response;
  } catch (error) {
    console.error("Error searching leagues:", error);
    return [];
  }
};

export const fetchLeaguesForCountry = async (
  countryCode: string
): Promise<League[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/leagues?code=${encodeURIComponent(countryCode)}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LeaguesApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    return data.response;
  } catch (error) {
    console.error("Leagues API error:", error);
    throw error;
  }
};

export const processLeaguesData = (
  apiResponse: League[]
): {
  leagues: League[];
  cups: League[];
} => {
  const leagues: League[] = [];
  const cups: League[] = [];

  apiResponse.forEach((item) => {
    if (item.league.type === "League") {
      leagues.push(item);
    } else if (item.league.type === "Cup") {
      cups.push(item);
    }
  });

  return { leagues, cups };
};
