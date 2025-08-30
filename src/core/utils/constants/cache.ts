// Cache TTL constants - only what's actually used
export const CACHE_TTL = {
  // Fixture-specific TTLs
  liveFixtures: 15 * 1000, // 15 seconds
  todayScheduled: 5 * 60 * 1000, // 5 minutes
  futureFixtures: 2 * 60 * 60 * 1000, // 2 hours
  finishedFixtures: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Round-specific TTLs
  currentRound: 2 * 60 * 1000, // 2 minutes for current round

  // Media cache TTLs
  imageCache: 24 * 60 * 60 * 1000, // 24 hours for images
  svgCache: 24 * 60 * 60 * 1000, // 24 hours for SVGs

  // System TTLs
  cleanupInterval: 5 * 60 * 1000, // 5 minutes for cache cleanup

  // Default fallback
  default: 60 * 60 * 1000, // 1 hour
} as const;
