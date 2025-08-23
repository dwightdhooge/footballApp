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
  winner?: boolean;
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
  league?: {
    id: number;
    name: string;
    type: "League" | "Cup";
    logo: string;
    country: string;
    flag: string;
    season: number;
    round?: string;
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

// New types for Fixture Statistics
export interface Statistic {
  type: string;
  value: number | string | null;
}

export interface TeamStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Statistic[];
}

export interface FixtureStatisticsApiResponse {
  get: string;
  parameters: {
    team?: string;
    fixture: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: TeamStatistics[];
}

// Processed stats for display
export interface ProcessedStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  shotsOffTarget: { home: number; away: number };
  blockedShots: { home: number; away: number };
  shotsInsideBox: { home: number; away: number };
  shotsOutsideBox: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  goalkeeperSaves: { home: number; away: number };
  totalPasses: { home: number; away: number };
  accuratePasses: { home: number; away: number };
  passAccuracy: { home: number; away: number };
}

export interface ApiError {
  type: "RATE_LIMIT" | "AUTH_ERROR" | "SERVER_ERROR" | "NETWORK_ERROR";
  message: string;
  status?: number;
}

// New types for Match Detail Screen
export interface Event {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  } | null;
  assist: {
    id: number;
    name: string;
  } | null;
  type: "Goal" | "Card" | "subst" | string;
  detail: string;
  comments: string | null;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface Coach {
  id: number;
  name: string;
  photo: string;
}

export interface TeamColors {
  player: {
    primary: string;
    number: string;
    border: string;
  };
  goalkeeper: {
    primary: string;
    number: string;
    border: string;
  };
}

export interface Lineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: TeamColors;
  };
  formation: string;
  startXI: Array<{
    player: Player;
  }>;
  substitutes: Array<{
    player: Player;
  }>;
  coach: Coach;
}

export interface EventsApiResponse {
  get: string;
  parameters: {
    fixture: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Event[];
}

export interface LineupsApiResponse {
  get: string;
  parameters: {
    fixture: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Lineup[];
}

export interface PlayerStatus {
  yellowCards: number;
  redCards: number;
  goals: number;
  isPenaltyGoal: boolean;
  showOverlapping: boolean;
  showMultiple: boolean;
}

// New types for Player Detail Screen
export interface PlayerProfile {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    number: number;
    position: string;
    photo: string;
  };
}

export interface PlayerProfileApiResponse {
  get: string;
  parameters: {
    player: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerProfile[];
}

export interface PlayerTeam {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  seasons: number[];
}

export interface PlayerTeamsApiResponse {
  get: string;
  parameters: {
    player: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerTeam[];
}

// New types for Team Detail Screen
export interface TeamDetail {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

export interface TeamDetailApiResponse {
  get: string;
  parameters: {
    id: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: TeamDetail[];
}
