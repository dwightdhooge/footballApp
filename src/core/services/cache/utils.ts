import { Fixture } from "@/core/types/api";
import { CACHE_TTL } from "@/core/utils/constants/cache";

// Fixture status constants for intelligent caching
export const FIXTURE_STATUSES = {
  // LIVE/IN-PLAY - Frequent updates needed
  LIVE: ["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"],

  // SCHEDULED - Medium updates needed
  SCHEDULED: ["TBD", "NS"],

  // FINISHED - Stable data, long cache
  FINISHED: ["FT", "AET", "PEN"],

  // CANCELLED/ABANDONED - Check for updates
  CANCELLED: ["PST", "CANC", "ABD", "AWD", "WO"],
} as const;

// Generate smart cache keys for different data types
export const generateCacheKey = {
  // For standings - season-based caching
  standings: (leagueId: string, season: string) => {
    return `STANDINGS_${leagueId}_${season}`;
  },

  // For rounds - season-based caching
  rounds: (leagueId: string, season: string) => {
    return `ROUNDS_${leagueId}_${season}`;
  },

  // For team info - stable data
  team: (teamId: string) => {
    return `TEAM_${teamId}`;
  },

  // For player info - stable data
  player: (playerId: string) => {
    return `PLAYER_${playerId}`;
  },

  // For league info - stable data
  league: (leagueId: string) => {
    return `LEAGUE_${leagueId}`;
  },

  // For country info - very stable
  country: (countryId: string) => {
    return `COUNTRY_${countryId}`;
  },
};

// Generate smart cache key and TTL for a round based on fixture statuses and current round status
export const getRoundCacheInfo = (
  fixtures: Fixture[],
  leagueId: string,
  season: string,
  round: string,
  isCurrentRound: boolean = false
): { key: string; ttl: number } => {
  const cacheKey = `ROUND_${leagueId}_${season}_${round}`;

  if (fixtures.length === 0) {
    // Even without fixtures, current round gets priority
    if (isCurrentRound) {
      return { key: cacheKey, ttl: CACHE_TTL.currentRound }; // 2 minutes for current round
    }
    return { key: cacheKey, ttl: CACHE_TTL.default }; // 1 hour default
  }

  // Find the most urgent fixture status in this round
  const hasLiveFixtures = fixtures.some((f) =>
    FIXTURE_STATUSES.LIVE.includes(f.fixture.status.short as any)
  );

  const hasTodayScheduled = fixtures.some(
    (f) =>
      FIXTURE_STATUSES.SCHEDULED.includes(f.fixture.status.short as any) &&
      new Date(f.fixture.date).toDateString() === new Date().toDateString()
  );

  const hasFinishedFixtures = fixtures.some((f) =>
    FIXTURE_STATUSES.FINISHED.includes(f.fixture.status.short as any)
  );

  // Determine TTL based on context
  if (isCurrentRound) {
    // Current round gets priority - always use current round TTL unless it has live matches
    if (hasLiveFixtures) {
      return { key: cacheKey, ttl: CACHE_TTL.liveFixtures }; // 15 seconds for live matches
    }
    // Current round without live matches gets current round TTL (2 minutes)
    return { key: cacheKey, ttl: CACHE_TTL.currentRound }; // 2 minutes for current round
  }

  // Apply the most urgent TTL to the entire round
  if (hasLiveFixtures) {
    return { key: cacheKey, ttl: CACHE_TTL.liveFixtures }; // 15 seconds
  }

  if (hasTodayScheduled) {
    return { key: cacheKey, ttl: CACHE_TTL.todayScheduled }; // 5 minutes
  }

  if (hasFinishedFixtures) {
    return { key: cacheKey, ttl: CACHE_TTL.finishedFixtures }; // 30 days
  }

  // Default for future rounds
  return { key: cacheKey, ttl: CACHE_TTL.futureFixtures }; // 2 hours
};

// Check if a round needs immediate refresh (e.g., has live matches)
export const shouldRefreshRoundImmediately = (fixtures: Fixture[]): boolean => {
  return fixtures.some((f) =>
    FIXTURE_STATUSES.LIVE.includes(f.fixture.status.short as any)
  );
};
