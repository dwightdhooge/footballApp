import { API_CONFIG } from "./config";
import { LineupsApiResponse, Lineup } from "../../types/api";

export const fetchLineups = async (fixtureId: number): Promise<Lineup[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/lineups?fixture=${fixtureId}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LineupsApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Validate and parse lineups data
    const validatedLineups = validateLineups(data);
    return validatedLineups;
  } catch (error) {
    console.error("Lineups API error:", error);
    throw error;
  }
};

// Validation functions
const validateLineups = (data: LineupsApiResponse): Lineup[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (lineup) => lineup && lineup.team && lineup.startXI
  );
};
