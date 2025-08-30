import { API_CONFIG } from "./config";
import {
  FixtureStatisticsApiResponse,
  ProcessedStats,
  TeamStatistics,
  Statistic,
} from "@/core/types/api";

export const fetchFixtureStatistics = async (
  fixtureId: string
): Promise<FixtureStatisticsApiResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}fixtures/statistics?fixture=${fixtureId}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FixtureStatisticsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fixture statistics:", error);
    throw error;
  }
};

export const processStatistics = (
  homeTeamStats: TeamStatistics,
  awayTeamStats: TeamStatistics
): ProcessedStats => {
  const getStatValue = (stats: Statistic[], statType: string): number => {
    const stat = stats.find((s) => s.type === statType);
    if (!stat || stat.value === null) return 0;

    // Handle percentage values (e.g., "32%")
    if (typeof stat.value === "string" && stat.value.includes("%")) {
      return parseInt(stat.value.replace("%", ""), 10);
    }

    return typeof stat.value === "number" ? stat.value : 0;
  };

  return {
    possession: {
      home: getStatValue(homeTeamStats.statistics, "Ball Possession"),
      away: getStatValue(awayTeamStats.statistics, "Ball Possession"),
    },
    shots: {
      home: getStatValue(homeTeamStats.statistics, "Total Shots"),
      away: getStatValue(awayTeamStats.statistics, "Total Shots"),
    },
    shotsOnTarget: {
      home: getStatValue(homeTeamStats.statistics, "Shots on Goal"),
      away: getStatValue(awayTeamStats.statistics, "Shots on Goal"),
    },
    shotsOffTarget: {
      home: getStatValue(homeTeamStats.statistics, "Shots off Goal"),
      away: getStatValue(awayTeamStats.statistics, "Shots off Goal"),
    },
    blockedShots: {
      home: getStatValue(homeTeamStats.statistics, "Blocked Shots"),
      away: getStatValue(awayTeamStats.statistics, "Blocked Shots"),
    },
    shotsInsideBox: {
      home: getStatValue(homeTeamStats.statistics, "Shots insidebox"),
      away: getStatValue(awayTeamStats.statistics, "Shots insidebox"),
    },
    shotsOutsideBox: {
      home: getStatValue(homeTeamStats.statistics, "Shots outsidebox"),
      away: getStatValue(awayTeamStats.statistics, "Shots outsidebox"),
    },
    corners: {
      home: getStatValue(homeTeamStats.statistics, "Corner Kicks"),
      away: getStatValue(awayTeamStats.statistics, "Corner Kicks"),
    },
    fouls: {
      home: getStatValue(homeTeamStats.statistics, "Fouls"),
      away: getStatValue(awayTeamStats.statistics, "Fouls"),
    },
    offsides: {
      home: getStatValue(homeTeamStats.statistics, "Offsides"),
      away: getStatValue(awayTeamStats.statistics, "Offsides"),
    },
    yellowCards: {
      home: getStatValue(homeTeamStats.statistics, "Yellow Cards"),
      away: getStatValue(awayTeamStats.statistics, "Yellow Cards"),
    },
    redCards: {
      home: getStatValue(homeTeamStats.statistics, "Red Cards"),
      away: getStatValue(awayTeamStats.statistics, "Red Cards"),
    },
    goalkeeperSaves: {
      home: getStatValue(homeTeamStats.statistics, "Goalkeeper Saves"),
      away: getStatValue(awayTeamStats.statistics, "Goalkeeper Saves"),
    },
    totalPasses: {
      home: getStatValue(homeTeamStats.statistics, "Total passes"),
      away: getStatValue(awayTeamStats.statistics, "Total passes"),
    },
    accuratePasses: {
      home: getStatValue(homeTeamStats.statistics, "Passes accurate"),
      away: getStatValue(awayTeamStats.statistics, "Passes accurate"),
    },
    passAccuracy: {
      home: getStatValue(homeTeamStats.statistics, "Passes %"),
      away: getStatValue(awayTeamStats.statistics, "Passes %"),
    },
  };
};

// Helper function to find team statistics by team ID
export const findTeamStatistics = (
  statistics: TeamStatistics[],
  teamId: number
): TeamStatistics | undefined => {
  return statistics.find((stat) => stat.team.id === teamId);
};
