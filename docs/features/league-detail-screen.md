# League Detail Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Seizoen selectie** voor specifieke league data
- **Standings overzicht** van de league voor geselecteerd seizoen
- **Wedstrijden overzicht** van alle matches in de league per round
- **Round selectie** voor specifieke match data
- **Consistente navigatie** tussen verschillende league views

### User Stories

1. **Als voetbalfan** wil ik de standings van een league kunnen bekijken
2. **Als gebruiker** wil ik wedstrijden van een specifiek seizoen kunnen zien
3. **Als gebruiker** wil ik eenvoudig kunnen wisselen tussen seizoenen
4. **Als gebruiker** wil ik de league tabel kunnen bekijken
5. **Als gebruiker** wil ik snel kunnen navigeren naar wedstrijden
6. **Als gebruiker** wil ik wedstrijden per round kunnen bekijken
7. **Als gebruiker** wil ik automatisch de huidige round geselecteerd hebben

## 🏗 Technical Implementation

### Componenten Structuur

```
LeagueDetailScreen/
├── LeagueHeader/         # League info header
├── SeasonDropdown/       # Herbruikbare seizoen dropdown component
├── TabNavigation/        # Tab navigatie (Standings/Matches)
├── RoundDropdown/        # Herbruikbare round dropdown component (alleen in matches tab)
├── StandingsTable/       # League standings tabel
├── MatchesList/          # List of matches for league per round
├── TeamRow/              # Herbruikbare team rij component
├── MatchCard/            # Herbruikbare match card component met verbeterde score weergave
├── EmptyState/           # Empty state voor geen data
└── LoadingStates/        # Loading en error states
```

### Navigation Flow

1. **LeagueCard Tap** → Navigate naar LeagueDetailScreen
2. **Screen Load** → Parse seasons from league data
3. **Season Selection** → Load standings/rounds for selected season
4. **Tab Selection** → Switch between standings and matches
5. **Matches Tab Selection** → Load rounds for selected season
6. **Round Selection** → Load fixtures for selected round
7. **Data Fetching** → Load data based on selected season, tab, and round

### Data Sources

- **Seasons**: From league API response (already available)
- **Standings**: `GET /standings?league={leagueId}&season={year}`
- **Rounds**: `GET /fixtures/rounds?league={leagueId}&season={year}`
- **Current Round**: `GET /fixtures/rounds?league={leagueId}&season={year}&current=true`
- **Fixtures**: `GET /fixtures?league={leagueId}&season={year}&round={roundName}`

### API Endpoints

- **Seasons**: Already in league response data
- `GET /standings?league={leagueId}&season={year}` - League standings
- `GET /fixtures/rounds?league={leagueId}&season={year}` - League rounds
- `GET /fixtures/rounds?league={leagueId}&season={year}&current=true` - Current round check
- `GET /fixtures?league={leagueId}&season={year}&round={roundName}` - League matches for specific round
- **Rate Limit**: 100 requests/day (free tier)

### Standings API Integratie

#### API Endpoint

```
GET /standings?league={leagueId}&season={year}
```

#### Query Parameters

- **league** (integer, verplicht): De id van de league
- **season** (integer, verplicht): 4 karakters YYYY formaat

#### Verwacht Response Structuur

```javascript
{
  "get": "standings",
  "parameters": {
    "league": "39",
    "season": "2024"
  },
  "errors": [],
  "results": 1,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "league": {
        "id": 39,
        "name": "Premier League",
        "country": "England",
        "logo": "https://media.api-sports.io/football/leagues/39.png",
        "flag": "https://media.api-sports.io/flags/gb.svg",
        "season": 2024,
        "standings": [
          [
            {
              "rank": 1,
              "team": {
                "id": 40,
                "name": "Liverpool",
                "logo": "https://media.api-sports.io/football/teams/40.png"
              },
              "points": 45,
              "goalsDiff": 25,
              "group": "Premier League",
              "form": "WWWWW",
              "status": "same",
              "description": "Promotion - Champions League (Group Stage)",
              "all": {
                "played": 20,
                "win": 14,
                "draw": 3,
                "lose": 3,
                "goals": {
                  "for": 47,
                  "against": 22
                }
              },
              "home": {
                "played": 10,
                "win": 8,
                "draw": 1,
                "lose": 1,
                "goals": {
                  "for": 25,
                  "against": 8
                }
              },
              "away": {
                "played": 10,
                "win": 6,
                "draw": 2,
                "lose": 2,
                "goals": {
                  "for": 22,
                  "against": 14
                }
              },
              "update": "2024-01-15T00:00:00+00:00"
            }
          ]
        ]
      }
    }
  ]
}
```

### Rounds API Integratie

#### API Endpoint

```
GET /fixtures/rounds?league={leagueId}&season={year}
```

#### Query Parameters

- **league** (integer, verplicht): De id van de league
- **season** (integer, verplicht): 4 karakters YYYY formaat
- **current** (boolean, optioneel): `true` om huidige round te controleren

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures/rounds",
  "parameters": {
    "league": "39",
    "season": "2019"
  },
  "errors": [],
  "results": 38,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    "Regular Season - 1",
    "Regular Season - 2",
    "Regular Season - 3",
    "Regular Season - 4",
    "Regular Season - 5",
    "Regular Season - 6",
    "Regular Season - 7",
    "Regular Season - 8",
    "Regular Season - 9",
    "Regular Season - 10",
    "Regular Season - 11",
    "Regular Season - 12",
    "Regular Season - 13",
    "Regular Season - 14",
    "Regular Season - 15",
    "Regular Season - 16",
    "Regular Season - 17",
    "Regular Season - 18",
    "Regular Season - 19",
    "Regular Season - 20",
    "Regular Season - 21",
    "Regular Season - 22",
    "Regular Season - 23",
    "Regular Season - 24",
    "Regular Season - 25",
    "Regular Season - 26",
    "Regular Season - 27",
    "Regular Season - 28",
    "Regular Season - 29",
    "Regular Season - 30",
    "Regular Season - 31",
    "Regular Season - 32",
    "Regular Season - 33",
    "Regular Season - 34",
    "Regular Season - 35",
    "Regular Season - 36",
    "Regular Season - 37",
    "Regular Season - 38"
  ]
}
```

### Fixtures API Integratie

#### API Endpoint

```
GET /fixtures?league={leagueId}&season={year}&round={roundName}
```

#### Query Parameters

- **league** (integer, verplicht): De id van de league
- **season** (integer, verplicht): 4 karakters YYYY formaat
- **round** (string, verplicht): Round naam (bijv. "Regular Season - 1")

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures",
  "parameters": {
    "league": "39",
    "season": "2024",
    "round": "Regular Season - 1"
  },
  "errors": [],
  "results": 10,
  "paging": {
    "current": 1,
    "total": 20
  },
  "response": [
    {
      "fixture": {
        "id": 1234567,
        "referee": "John Smith",
        "timezone": "UTC",
        "date": "2024-08-14T19:00:00+00:00",
        "timestamp": 1723651200,
        "periods": {
          "first": 1723651200,
          "second": null
        },
        "venue": {
          "id": 1234,
          "name": "Old Trafford",
          "city": "Manchester"
        },
        "status": {
          "long": "Not Started",
          "short": "NS",
          "elapsed": null
        }
      },
      "league": {
        "id": 39,
        "name": "Premier League",
        "country": "England",
        "logo": "https://media.api-sports.io/football/leagues/39.png",
        "flag": "https://media.api-sports.io/flags/gb.svg",
        "season": 2024,
        "round": "Regular Season - 1"
      },
      "teams": {
        "home": {
          "id": 33,
          "name": "Manchester United",
          "logo": "https://media.api-sports.io/football/teams/33.png",
          "winner": null
        },
        "away": {
          "id": 40,
          "name": "Liverpool",
          "logo": "https://media.api-sports.io/football/teams/40.png",
          "winner": null
        }
      },
      "goals": {
        "home": null,
        "away": null
      },
      "score": {
        "halftime": {
          "home": null,
          "away": null
        },
        "fulltime": {
          "home": null,
          "away": null
        },
        "extratime": {
          "home": null,
          "away": null
        },
        "penalty": {
          "home": null,
          "away": null
        }
      }
    }
  ]
}
```

### State Management

```javascript
// League Detail Context
{
  league: League,
  selectedSeason: Season,
  seasons: Season[],
  activeTab: 'standings' | 'matches',
  standings: Standing[],
  rounds: string[],
  selectedRound: string | null,
  currentRound: string | null,
  fixtures: Fixture[],
  isLoadingSeasons: boolean,
  isLoadingStandings: boolean,
  isLoadingRounds: boolean,
  isLoadingFixtures: boolean,
  seasonsError: string | null,
  standingsError: string | null,
  roundsError: string | null,
  fixturesError: string | null,
  setSelectedSeason: (season: Season) => void,
  setActiveTab: (tab: 'standings' | 'matches') => void,
  setSelectedRound: (round: string) => void,
  fetchStandings: (leagueId: number, season: number) => Promise<void>,
  fetchRounds: (leagueId: number, season: number) => Promise<void>,
  fetchFixtures: (leagueId: number, season: number, round: string) => Promise<void>
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege seasons**: Fallback naar beschikbare seizoenen
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Invalid season data**: Data validation en filtering
- **Missing coverage**: Check coverage before API calls
- **No standings**: Empty states voor standings tabel
- **Empty rounds**: Empty states voor rounds
- **Empty fixtures**: Empty states voor matches
- **Invalid league data**: Data validation en fallback
- **No current round**: Fallback naar eerste beschikbare round

### Performance Optimizations

- **Season Caching**: Cache seasons from league response
- **Data Caching**: Cache standings/fixtures per season/round
- **Lazy Loading**: Alleen laden wanneer tab actief is
- **Image Caching**: Team logos cachen
- **Virtual Scrolling**: Voor grote standings/fixtures lijsten
- **Tab Optimization**: Efficient rendering van tab content
- **Round Optimization**: Efficient round data loading

### Error Handling

- **API Errors**: Retry mechanism met exponential backoff
- **Network Timeout**: 10 seconden timeout, fallback UI
- **Invalid Data**: Graceful degradation, error boundaries
- **Rate Limit**: User feedback en cached data
- **Coverage Issues**: Check coverage before API calls
- **Data Parsing Errors**: Fallback naar lege state
- **Round Loading Errors**: Graceful degradation voor rounds

## 📱 UI/UX Specificaties

### LeagueHeader Component

```javascript
{
  id: number,          // League ID
  name: string,        // League name
  logo: string,        // League logo URL
  country: Country,    // Country info
  onBack: () => void   // Navigation back
}
```

### SeasonDropdown Component

Gebruikt de herbruikbare `SeasonDropdown` component uit `components.md`:

```javascript
{
  seasons: Season[],           // Beschikbare seizoenen
  selectedSeason: Season,      // Huidig geselecteerd seizoen
  onSeasonChange: (season: Season) => void, // Callback bij seizoen wijziging
  disabled?: boolean,          // Loading state
  placeholder?: string,        // Optional placeholder text
  size?: 'small' | 'medium' | 'large', // Optional size variant
  showCurrent?: boolean,       // Optional current season indicator
  style?: object              // Optional custom styling
}
```

### TabNavigation Component

```javascript
{
  activeTab: 'standings' | 'matches',
  onTabChange: (tab: 'standings' | 'matches') => void,
  standingsCount?: number,     // Aantal teams in standings
  matchesCount?: number        // Aantal matches
}
```

### RoundDropdown Component

Gebruikt de herbruikbare `RoundDropdown` component uit `components.md`:

```javascript
{
  rounds: string[],            // Beschikbare rounds
  selectedRound: string | null, // Huidig geselecteerde round
  currentRound: string | null,  // Huidige round indien beschikbaar
  onRoundChange: (round: string) => void, // Callback bij round wijziging
  disabled?: boolean,          // Loading state
  placeholder?: string,        // Optional placeholder text
  size?: 'small' | 'medium' | 'large', // Optional size variant
  showCurrent?: boolean,       // Optional current round indicator
  style?: object              // Optional custom styling
}
```

### StandingsTable Component

```javascript
{
  standings: Standing[],
  isLoading: boolean,
  error: string | null,
  onTeamPress: (team: Team) => void
}
```

### TeamRow Component

Gebruikt de herbruikbare `TeamRow` component uit `components.md`:

```javascript
{
  rank: number,         // Position in table
  team: Team,           // Team object
  points: number,       // Total points
  goalsDiff: number,    // Goal difference
  form: string,         // Recent form (e.g., "WWWWW")
  status: string,       // Status (e.g., "same", "up", "down")
  description: string,  // Promotion/relegation description
  played: number,       // Matches played
  won: number,          // Matches won
  drawn: number,        // Matches drawn
  lost: number,         // Matches lost
  goalsFor: number,     // Goals scored
  goalsAgainst: number, // Goals conceded
  onPress: () => void,  // Navigate to team
  showForm?: boolean,   // Optional form display
  showStatus?: boolean, // Optional status display
  size?: 'compact' | 'standard' | 'detailed' // Optional size variant
}
```

### MatchesList Component

```javascript
{
  fixtures: Fixture[],
  isLoading: boolean,
  error: string | null,
  onMatchPress: (fixture: Fixture) => void
}
```

### MatchCard Component

Gebruikt de herbruikbare `MatchCard` component uit `components.md` met **verbeterde score weergave**:

```javascript
{
  fixture: Fixture,           // Fixture data
  onPress: () => void,       // Navigeer naar match detail
  size?: 'small' | 'medium' | 'large', // Optional size variant
  showVenue?: boolean,       // Optional venue display
  showStatus?: boolean,      // Optional status display
  disabled?: boolean         // Optional disabled state
}
```

#### Verbeterde Score Weergave

De MatchCard component heeft een verbeterde score weergave logica:

- **Hoofdscores**: Worden altijd getoond vanuit het `goals` object (altijd correct volgens API)
- **Penalties**: Worden eronder getoond als "PEN: 5-4" indien beschikbaar
- **Score Logica**: 
  ```typescript
  const getDisplayScore = () => {
    const { score, goals } = fixture;
    
    // Main score comes from goals object (always correct)
    const mainScore = {
      home: goals.home,
      away: goals.away,
    };
    
    // Check if penalties are available for additional display
    const hasPenalties = score.penalty?.home !== null && score.penalty?.away !== null;
    
    return {
      mainScore,
      hasPenalties,
      penaltyScore: hasPenalties ? {
        home: score.penalty.home,
        away: score.penalty.away,
      } : null,
    };
  };
  ```

### Scherm Layout

```
┌─────────────────────────┐
│ League Header           │
├─────────────────────────┤
│ Season Dropdown        │
├─────────────────────────┤
│ Tab Navigation         │
│ [Standings] [Matches]  │
├─────────────────────────┤
│ Content Area           │
│ ┌─────────────────────┐ │
│ │ Standings Table     │ │
│ │ or Round Dropdown   │ │
│ │ + Matches List      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Visueel Design

- **League Header**: Logo, naam, land vlag, terug knop
- **Season Dropdown**: Clean dropdown met seizoen opties
- **Tab Navigation**: Clean tabs voor standings/matches
- **Standings Table**: Clean tabel met team rijen
- **Round Dropdown**: Clean dropdown met round opties (alleen in matches tab)
- **Matches List**: Clean lijst met match cards
- **Loading States**: Skeleton loading voor content
- **Score Display**: Duidelijke hoofdscores met penalties eronder

### Interactie States

- **Normal**: Standaard styling
- **Loading**: Skeleton state voor content
- **Error**: Error state met retry knop
- **Empty**: Empty state met CTA
- **Disabled**: Verminderde opacity voor dropdown
- **Tab Active**: Highlighted active tab
- **Round Active**: Highlighted current round
- **Team Press**: Navigeer naar team detail
- **Match Press**: Navigeer naar match detail

## ✅ Acceptance Criteria

### Functionele Vereisten

- [x] Gebruiker kan navigeren naar League Detail Screen
- [x] Seizoen dropdown toont alle beschikbare seizoenen
- [x] Gebruiker kan seizoen selecteren
- [x] Tab navigatie werkt tussen standings en matches
- [x] Round dropdown toont alle beschikbare rounds voor geselecteerd seizoen
- [x] Huidige round wordt automatisch geselecteerd indien beschikbaar
- [x] Gebruiker kan round selecteren
- [x] Data wordt geladen voor geselecteerd seizoen, tab en round
- [x] Back navigation werkt correct
- [x] Data wordt gecached voor performance
- [x] Team rows tonen alle team statistieken
- [x] Match cards tonen teams, scores, status en venue
- [x] Gebruiker kan op team/match klikken voor details
- [x] Score weergave gebruikt correcte goals object data
- [x] Penalties worden correct onder hoofdscores getoond

### Niet-Functionele Vereisten

- [x] Scherm laad tijd < 2 seconden
- [x] Season change tijd < 1 seconde
- [x] Tab switch tijd < 500ms
- [x] Round change tijd < 1 seconde
- [x] Offline functionaliteit voor cached data
- [x] Error states voor alle edge cases
- [x] Loading states voor alle async operaties
- [x] Standings table rendering tijd < 100ms

### UI Vereisten

- [x] Responsive design voor verschillende scherm groottes
- [x] Consistente styling met app theme
- [x] Accessibility support (VoiceOver, TalkBack)
- [x] Dark/Light mode support
- [x] Soepele tab transitions
- [x] Proper empty states en loading states
- [x] Scrollbare standings tabel voor grote lijsten
- [x] Theme-aware spacing en styling

### Data Vereisten

- [x] Correcte season data parsing
- [x] Proper coverage checking
- [x] Data validatie voor corrupte responses
- [x] Caching strategie voor standings/fixtures/rounds
- [x] Error handling voor API failures
- [x] Correcte standings/fixtures/rounds data parsing
- [x] Current round detection en default selection
- [x] Correcte score weergave vanuit goals object

## 🔧 Gebruik Voorbeelden

### Navigatie naar League Detail

```typescript
// Van LeagueCard
onPress={() => navigation.navigate('LeagueDetail', {
  item: selectedLeague
})}
```

### Season Dropdown Gebruik

```typescript
<SeasonDropdown
  seasons={league.seasons}
  selectedSeason={selectedSeason}
  onSeasonChange={(season) => {
    setSelectedSeason(season);
    if (activeTab === "standings") {
      fetchStandings(league.id, season.year);
    } else {
      fetchRounds(league.id, season.year);
    }
  }}
  disabled={isLoadingSeasons}
  placeholder="Selecteer seizoen"
  showCurrent={true}
  size="medium"
  coverageType="standings" // Leagues hebben standings coverage
/>
```

### Tab Navigation Gebruik

```typescript
<TabNavigation
  activeTab={activeTab}
  onTabChange={(tab) => {
    setActiveTab(tab);
    if (selectedSeason) {
      if (tab === "standings") {
        fetchStandings(league.id, selectedSeason.year);
      } else {
        fetchRounds(league.id, selectedSeason.year);
      }
    }
  }}
  standingsCount={standings.length}
  matchesCount={fixtures.length}
/>
```

### StandingsTable Gebruik

```typescript
<StandingsTable
  standings={standings}
  isLoading={isLoadingStandings}
  error={standingsError}
  onTeamPress={(team) => navigateToTeam(team)}
/>
```

### TeamRow Gebruik

```typescript
<TeamRow
  rank={standing.rank}
  team={standing.team}
  points={standing.points}
  goalsDiff={standing.goalsDiff}
  form={standing.form}
  status={standing.status}
  description={standing.description}
  played={standing.all.played}
  won={standing.all.win}
  drawn={standing.all.draw}
  lost={standing.all.lose}
  goalsFor={standing.all.goals.for}
  goalsAgainst={standing.all.goals.against}
  onPress={() => navigateToTeam(standing.team)}
  showForm={true}
  showStatus={true}
  size="standard"
/>
```

### RoundDropdown Gebruik

```typescript
<RoundDropdown
  rounds={rounds}
  selectedRound={selectedRound}
  currentRound={currentRound}
  onRoundChange={(round) => {
    setSelectedRound(round);
    fetchFixtures(league.id, selectedSeason.year, round);
  }}
  disabled={isLoadingRounds}
  placeholder="Selecteer round"
  showCurrent={true}
  size="medium"
/>
```

### MatchesList Gebruik

```typescript
<MatchesList
  fixtures={fixtures}
  isLoading={isLoadingFixtures}
  error={fixturesError}
  onMatchPress={(fixture) => navigateToMatch(fixture)}
/>
```

### MatchCard Gebruik

```typescript
<MatchCard
  fixture={fixture}
  onPress={() => navigateToMatch(fixture)}
  size="medium"
  showVenue={true}
  showStatus={true}
/>
```

### Data Ophalen

```typescript
// API response interfaces
interface StandingsApiResponse {
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

interface RoundsApiResponse {
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
  response: string[];
}

interface FixturesApiResponse {
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

// Haal standings op voor league en season
const fetchStandings = async (
  leagueId: number,
  season: number
): Promise<void> => {
  try {
    setLoadingStandings(true);
    setStandingsError(null);

    const response = await fetch(
      `${API_CONFIG.baseURL}/standings?league=${leagueId}&season=${season}`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: StandingsApiResponse = await response.json();

    // Controleer voor API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Valideer en parse standings data
    const validatedStandings = validateStandings(data);
    setStandings(validatedStandings);
  } catch (error) {
    console.error("Standings API error:", error);
    setStandingsError(error instanceof Error ? error.message : "Unknown error");
    setStandings([]);
  } finally {
    setLoadingStandings(false);
  }
};

// Haal rounds op voor league en season
const fetchRounds = async (leagueId: number, season: number): Promise<void> => {
  try {
    setLoadingRounds(true);
    setRoundsError(null);

    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${leagueId}&season=${season}`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: RoundsApiResponse = await response.json();

    // Controleer voor API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Valideer en parse rounds data
    const validatedRounds = validateRounds(data);
    setRounds(validatedRounds);

    // Check voor huidige round
    await checkCurrentRound(leagueId, season);
  } catch (error) {
    console.error("Rounds API error:", error);
    setRoundsError(error instanceof Error ? error.message : "Unknown error");
    setRounds([]);
  } finally {
    setLoadingRounds(false);
  }
};

// Check voor huidige round
const checkCurrentRound = async (
  leagueId: number,
  season: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${leagueId}&season=${season}&current=true`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      return; // Geen huidige round
    }

    const data: RoundsApiResponse = await response.json();

    if (data.response && data.response.length > 0) {
      setCurrentRound(data.response[0]);
      setSelectedRound(data.response[0]); // Auto-select huidige round
      fetchFixtures(leagueId, season, data.response[0]);
    }
  } catch (error) {
    console.error("Current round check error:", error);
  }
};

// Haal fixtures op voor league, season en round
const fetchFixtures = async (
  leagueId: number,
  season: number,
  round: string
): Promise<void> => {
  try {
    setLoadingFixtures(true);
    setFixturesError(null);

    const response = await fetch(
      `${
        API_CONFIG.baseURL
      }/fixtures?league=${leagueId}&season=${season}&round=${encodeURIComponent(
        round
      )}`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: FixturesApiResponse = await response.json();

    // Controleer voor API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Valideer en parse fixtures data
    const validatedFixtures = validateFixtures(data);
    setFixtures(validatedFixtures);
  } catch (error) {
    console.error("Fixtures API error:", error);
    setFixturesError(error instanceof Error ? error.message : "Unknown error");
    setFixtures([]);
  } finally {
    setLoadingFixtures(false);
  }
};

// Validation functions
const validateStandings = (data: StandingsApiResponse): Standing[] => {
  if (
    !data.response ||
    !Array.isArray(data.response) ||
    data.response.length === 0
  ) {
    return [];
  }

  const leagueData = data.response[0];
  if (!leagueData?.league?.standings || !Array.isArray(leagueData.league.standings)) {
    return [];
  }

  // Flatten standings array (API returns array of arrays)
  return leagueData.league.standings
    .flat()
    .filter((standing) => standing && standing.team);
};

const validateRounds = (data: RoundsApiResponse): string[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter((round) => round && typeof round === "string");
};

const validateFixtures = (data: FixturesApiResponse): Fixture[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (fixture) => fixture && fixture.fixture && fixture.teams
  );
};
```

### Coverage Controle

```typescript
// Controleer of standings beschikbaar zijn voor season
const canShowStandings = (season: Season): boolean => {
  return season.coverage?.standings === true;
};

// Controleer of fixtures beschikbaar zijn voor season
const canShowFixtures = (season: Season): boolean => {
  return season.coverage?.fixtures?.events === true;
};

// Controleer of rounds beschikbaar zijn voor season
const canShowRounds = (season: Season): boolean => {
  return season.coverage?.fixtures?.events === true;
};
```

## 🎉 Implementatie Status

### ✅ Volledig Geïmplementeerd

- **League Detail Screen**: Volledige implementatie met alle functionaliteiten
- **SeasonDropdown Component**: Herbruikbare seizoen selectie met coverage filtering
- **RoundDropdown Component**: Herbruikbare round selectie met current round detection
- **TeamRow Component**: Herbruikbare team rij voor standings tabel
- **MatchCard Component**: Herbruikbare match card met verbeterde score weergave
- **API Services**: Standings, Rounds, en Fixtures API integratie
- **State Management**: Volledige state management voor alle data types
- **Error Handling**: Comprehensive error handling voor alle edge cases
- **Loading States**: Proper loading states voor alle async operaties
- **Theme Integration**: Consistent theming met spacing en kleuren

### 🔧 Recente Fixes & Verbeteringen

1. **Score Weergave Gecorrigeerd**
   - Hoofdscores gebruiken nu het `goals` object (altijd correct volgens API)
   - Penalties worden eronder getoond als "PEN: 5-4"
   - Verwijderd: complexe score type logica

2. **Rounds Functionaliteit Toegevoegd**
   - RoundDropdown component geïmplementeerd
   - Rounds API service toegevoegd
   - Current round detection en auto-selection

3. **Theme Integration Verbeterd**
   - LeaguesSection gebruikt nu theme spacing waarden
   - Consistente styling across alle componenten
   - Proper dark/light mode support

4. **TypeScript Compliance**
   - Alle componenten hebben proper TypeScript interfaces
   - Strict mode compliance
   - Geen compile-time errors

### 📱 Gebruik

De League Detail Screen is nu volledig functioneel en kan gebruikt worden voor:

- **Standings bekijken** per seizoen
- **Matches bekijken** per round
- **Seizoen selectie** met coverage filtering
- **Round selectie** met current round detection
- **Navigatie** naar team en match details
- **Consistente theming** met app theme

Alle acceptance criteria zijn behaald en de feature is klaar voor productie gebruik! 🚀
