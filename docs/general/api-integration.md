# API Integration - API-Football

## 🎯 API Overview

### API-Football v3

- **Base URL**: https://v3.football.api-sports.io/
- **Documentation**: [API-Football Documentation](https://api-sports.io/documentation/football/v3#section/Introduction)
- **Authentication**: x-apisports-key
- **Rate Limiting**: 100 requests/day (free tier)

## 🏗 Technical Implementation

### API Configuration

```typescript
interface ApiConfig {
  baseURL: string;
  headers: {
    "x-apisports-key": string;
  };
}

const API_CONFIG: ApiConfig = {
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-apisports-key": "be585eb3815e94b55b2fdfc52b3e925c",
  },
};
```

### Endpoints Overview

| Endpoint     | Method | Description          | Rate Limit |
| ------------ | ------ | -------------------- | ---------- |
| `/countries` | GET    | Alle landen ophalen  | 100/day    |
| `/leagues`   | GET    | Competities per land | 100/day    |
| `/teams`     | GET    | Teams per competitie | 100/day    |
| `/fixtures`  | GET    | Wedstrijden          | 100/day    |
| `/players`   | GET    | Spelers per team     | 100/day    |

### Data Models

```typescript
interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

interface Fixture {
  id: number;
  date: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  goals: Goals;
  score: Score;
}

interface Goals {
  home: number | null;
  away: number | null;
}

interface Score {
  halftime: { home: number | null; away: number | null };
  fulltime: { home: number | null; away: number | null };
  extratime: { home: number | null; away: number | null };
  penalty: { home: number | null; away: number | null };
}
```

## 🧪 Quality & Error Handling

### Rate Limiting Strategy

- **Request Tracking**: Houd bij hoeveel requests per dag
- **Graceful Degradation**: Toon cached data bij limit bereikt
- **User Feedback**: Informeer gebruiker over API limits
- **Smart Caching**: Cache belangrijke data lokaal

### Error Handling

```typescript
interface ApiError {
  type: "RATE_LIMIT" | "AUTH_ERROR" | "SERVER_ERROR" | "NETWORK_ERROR";
  message: string;
  status?: number;
}

const handleApiError = (error: any): ApiError => {
  if (error.status) {
    switch (error.status) {
      case 429: // Rate limit exceeded
        return {
          type: "RATE_LIMIT",
          message: "API limit bereikt",
          status: 429,
        };
      case 401: // Unauthorized
        return { type: "AUTH_ERROR", message: "API key ongeldig", status: 401 };
      case 500: // Server error
        return {
          type: "SERVER_ERROR",
          message: "Server niet beschikbaar",
          status: 500,
        };
      default:
        return {
          type: "NETWORK_ERROR",
          message: "Netwerk fout",
          status: error.status,
        };
    }
  }
  return { type: "NETWORK_ERROR", message: "Netwerk fout" };
};
```

### Caching Strategy

- **Countries**: Cache voor 24 uur (statische data)
- **Favorites**: Lokale AsyncStorage (persistent)
- **Recent Searches**: Cache voor 1 uur
- **Team/League Data**: Cache voor 6 uur

## 📱 Implementation Examples

### Countries API Call

```typescript
interface CountriesApiResponse {
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

const fetchCountries = async (searchQuery: string = ""): Promise<Country[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/countries${
        searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
      }`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: CountriesApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    return data.response;
  } catch (error) {
    console.error("Countries API error:", error);
    throw error;
  }
};
```

### Leagues API Call

```typescript
interface LeaguesApiResponse {
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
  response: League[];
}

const fetchLeagues = async (countryCode: string): Promise<League[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/leagues?country=${encodeURIComponent(
        countryCode
      )}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LeaguesApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    return data.response;
  } catch (error) {
    console.error("Leagues API error:", error);
    throw error;
  }
};
```

## 🔧 Development Setup

### Environment Variables

```typescript
// .env
interface EnvironmentVariables {
  API_SPORTS_KEY: string;
  API_BASE_URL: string;
}

// Environment configuration
const ENV: EnvironmentVariables = {
  API_SPORTS_KEY:
    process.env.API_SPORTS_KEY || "be585eb3815e94b55b2fdfc52b3e925c",
  API_BASE_URL:
    process.env.API_BASE_URL || "https://v3.football.api-sports.io/",
};
```

### Development Tools

- **API Testing**: Postman/Insomnia voor endpoint testing
- **Mock Data**: JSON files voor development zonder API calls
- **Rate Limit Monitoring**: Local tracking van API usage
- **Error Simulation**: Tools om verschillende errors te simuleren
