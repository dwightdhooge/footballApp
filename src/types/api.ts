export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface CountriesApiResponse {
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
  response: Country[];
}

export interface League {
  id: number;
  name: string;
  type: "League" | "Cup";
  logo: string;
}

export interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: {
    fixtures: {
      events: boolean;
      lineups: boolean;
      statistics_fixtures: boolean;
      statistics_players: boolean;
    };
    standings: boolean;
    players: boolean;
    top_scorers: boolean;
    top_assists: boolean;
    top_cards: boolean;
    injuries: boolean;
    predictions: boolean;
    odds: boolean;
  };
}

export interface LeagueItem {
  league: League;
  country: Country;
  seasons: Season[];
}

export interface LeaguesApiResponse {
  get: string;
  parameters: {
    country: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: LeagueItem[];
}

// New types for League Detail Screen
export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

export interface StandingsApiResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: {
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      standings: Standing[][];
    };
  }[];
}

export interface FixturesApiResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
    round?: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Fixture[];
}

export interface ApiError {
  type: "RATE_LIMIT" | "AUTH_ERROR" | "SERVER_ERROR" | "NETWORK_ERROR";
  message: string;
  status?: number;
}
