import { API_CONFIG } from "./config";
import { TeamDetail, TeamDetailApiResponse } from "@/types/api";

export const fetchTeamDetail = async (teamId: number): Promise<TeamDetail> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/teams?id=${teamId}`,
      {
        headers: API_CONFIG.headers,
      }
    );

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
