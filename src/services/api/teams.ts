import { API_CONFIG } from "./config";
import { TeamDetail, TeamDetailApiResponse } from "@/types/api";

// New interface for team search results
export interface TeamSearchResult {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    national: boolean;
    logo: string;
  };
}

export interface TeamSearchApiResponse {
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
  response: TeamSearchResult[];
}

export const searchTeams = async (
  searchTerm: string
): Promise<TeamSearchResult[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/teams?search=${encodeURIComponent(searchTerm)}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeamSearchApiResponse = await response.json();

    if (!data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response;
  } catch (error) {
    console.error("Error searching teams:", error);
    return [];
  }
};

export const fetchTeamDetail = async (teamId: number): Promise<TeamDetail> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/teams?id=${teamId}`, {
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeamDetailApiResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`API errors: ${data.errors.join(", ")}`);
    }

    if (data.results === 0) {
      throw new Error("Team not found");
    }

    return data.response[0];
  } catch (error) {
    console.error("Error fetching team detail:", error);
    throw error;
  }
};
