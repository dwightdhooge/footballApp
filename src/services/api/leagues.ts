import { API_CONFIG } from "./config";
import { LeaguesApiResponse, LeagueItem, ApiError } from "../../types/api";

export const fetchLeaguesForCountry = async (
  countryCode: string
): Promise<LeagueItem[]> => {
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
  apiResponse: LeagueItem[]
): {
  leagues: LeagueItem[];
  cups: LeagueItem[];
} => {
  const leagues: LeagueItem[] = [];
  const cups: LeagueItem[] = [];

  apiResponse.forEach((item) => {
    if (item.league.type === "League") {
      leagues.push(item);
    } else if (item.league.type === "Cup") {
      cups.push(item);
    }
  });

  return { leagues, cups };
};
