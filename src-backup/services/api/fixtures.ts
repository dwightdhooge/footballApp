import { API_CONFIG } from "./config";
import { FixturesApiResponse, Fixture } from "../../types/api";

export const fetchFixtures = async (
  leagueId: number,
  season: number,
  round?: string
): Promise<Fixture[]> => {
  try {
    let url = `${API_CONFIG.baseURL}/fixtures?league=${leagueId}&season=${season}`;

    if (round) {
      url += `&round=${encodeURIComponent(round)}`;
    }

    const response = await fetch(url, {
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: FixturesApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Validate and parse fixtures data
    return validateFixtures(data);
  } catch (error) {
    console.error("Fixtures API error:", error);
    throw error;
  }
};

export const fetchCupFixtures = async (
  cupId: number,
  season: number,
  round: string
): Promise<Fixture[]> => {
  return fetchFixtures(cupId, season, round);
};

const validateFixtures = (data: FixturesApiResponse): Fixture[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }

  const validFixtures = data.response.filter(
    (fixture) => fixture && fixture.fixture && fixture.teams
  );

  // Remove duplicates based on fixture ID
  const uniqueFixtures = validFixtures.filter((fixture, index, array) => {
    const firstIndex = array.findIndex(
      (f) => f.fixture.id === fixture.fixture.id
    );
    return firstIndex === index;
  });

  return uniqueFixtures;
};
