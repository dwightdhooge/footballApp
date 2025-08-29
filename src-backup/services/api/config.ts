export interface ApiConfig {
  baseURL: string;
  headers: {
    "x-apisports-key": string;
  };
}

export const API_CONFIG: ApiConfig = {
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-apisports-key": "be585eb3815e94b55b2fdfc52b3e925c",
  },
}; 