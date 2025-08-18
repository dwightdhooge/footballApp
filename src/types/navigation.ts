import { Country, LeagueItem, Fixture } from "./api";

export interface NavigationParams {
  item: Country | LeagueItem | Fixture;
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
};

export type SettingsTabFlow = {
  Settings: undefined;
};

export type RootTabParamList = {
  Scores: undefined;
  Settings: undefined;
};

export type ScoresStackParamList = {
  Homescreen: undefined;
  CountryDetail: { item: Country };
  LeagueDetail: { item: LeagueItem };
  CupDetail: { item: LeagueItem };
  MatchDetail: { item: Fixture };
};

export type SettingsStackParamList = {
  Settings: undefined;
};
