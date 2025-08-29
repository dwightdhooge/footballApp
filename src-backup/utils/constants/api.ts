// API-related constants
export const API_ENDPOINTS = {
  // Base URLs
  baseURL: "https://v3.football.api-sports.io",

  // Endpoint paths
  countries: "/countries",
  leagues: "/leagues",
  teams: "/teams",
  players: "/players",
  fixtures: "/fixtures",
  standings: "/standings",
  lineups: "/lineups",
  events: "/fixtures/events",
  statistics: "/fixtures/statistics",
  rounds: "/fixtures/rounds",
} as const;

export const API_TIMEOUTS = {
  // Request timeouts
  default: 10000, // 10 seconds
  long: 30000, // 30 seconds
  short: 5000, // 5 seconds
} as const;

export const API_HEADERS = {
  // Common headers
  contentType: "application/json",
  accept: "application/json",
} as const;
