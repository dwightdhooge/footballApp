import { API_CONFIG } from "./config";
import { StandingsApiResponse, Standing } from "../../types/api";

export const fetchStandings = async (
  leagueId: number,
  season: number
): Promise<Standing[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/standings?league=${leagueId}&season=${season}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: StandingsApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Validate and parse standings data
    return validateStandings(data);
  } catch (error) {
    console.error("Standings API error:", error);
    throw error;
  }
};

const validateStandings = (data: StandingsApiResponse): Standing[] => {
  if (
    !data.response ||
    !Array.isArray(data.response) ||
    data.response.length === 0
  ) {
    return [];
  }

  const leagueData = data.response[0];
  if (
    !leagueData?.league?.standings ||
    !Array.isArray(leagueData.league.standings)
  ) {
    return [];
  }

  // Flatten standings array (API returns array of arrays)
  const flattenedStandings = leagueData.league.standings
    .flat()
    .filter((standing: Standing) => standing && standing.team);

  // Remove duplicates based on team ID and rank
  const uniqueStandings = flattenedStandings.filter(
    (standing, index, array) => {
      const firstIndex = array.findIndex(
        (s) => s.team.id === standing.team.id && s.rank === standing.rank
      );
      return firstIndex === index;
    }
  );

  return uniqueStandings;
};
