import { Country, LeagueItem, Fixture, PlayerProfile, Team } from "./api";

export interface NavigationParams {
  item: Country | LeagueItem | Fixture | PlayerProfile | Team;
}

export interface NavigationState {
  index: number;
  routes: Array<{
    name: string;
    params?: NavigationParams;
  }>;
}

export type ScoresTabFlow = {
  Homescreen: undefined;
  CountryDetail: { item: Country };
  LeagueDetail: { item: LeagueItem };
  CupDetail: { item: LeagueItem };
  MatchDetail: { item: Fixture };
  PlayerDetail: { item: PlayerProfile };
  TeamDetail: { item: Team };
};

export type FavoritesTabFlow = {
  FavoritesHome: undefined;
  // Reuse existing detail screens for navigation
  CountryDetail: { item: Country };
  LeagueDetail: { item: LeagueItem };
  CupDetail: { item: LeagueItem };
  MatchDetail: { item: Fixture };
  PlayerDetail: { item: PlayerProfile };
  TeamDetail: { item: Team };
};

export type SettingsTabFlow = {
  Settings: undefined;
};

export type DebugTabFlow = {
  Debug: undefined;
};

export type RootTabParamList = {
  Scores: undefined;
  Favorites: undefined; // New tab
  Settings: undefined;
  Debug?: undefined; // Optional debug tab
};

export type ScoresStackParamList = {
  Homescreen: undefined;
  SearchScreen: undefined;
  CountryDetail: { item: Country };
  LeagueDetail: { item: LeagueItem };
  CupDetail: { item: LeagueItem };
  MatchDetail: { item: Fixture };
  PlayerDetail: { item: PlayerProfile };
  TeamDetail: { item: Team };
};

export type FavoritesStackParamList = {
  FavoritesHome: undefined;
  // Reuse existing detail screens for navigation
  CountryDetail: { item: Country };
  LeagueDetail: { item: LeagueItem };
  CupDetail: { item: LeagueItem };
  MatchDetail: { item: Fixture };
  PlayerDetail: { item: PlayerProfile };
  TeamDetail: { item: Team };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type DebugStackParamList = {
  Debug: undefined;
};
