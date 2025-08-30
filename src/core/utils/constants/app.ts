// App-wide constants and limits
export const APP_LIMITS = {
  // Search and pagination
  maxSearchResults: 50,
  maxFavoritesPerType: 100,

  // Cache sizes
  maxCacheSize: 1000,
  maxImageFileSize: 5 * 1024 * 1024, // 5MB

  // UI limits
  maxRecentSearches: 10,
  maxSuggestedCountries: 7,
} as const;

export const APP_DEFAULTS = {
  // Default values
  defaultLanguage: "nl-BE",
  defaultTheme: "auto",

  // Timeouts
  searchDebounceMs: 300,
  apiTimeoutMs: 10000,
} as const;
