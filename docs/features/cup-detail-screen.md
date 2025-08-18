# Cup Detail Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Seizoen selectie** voor specifieke cup data
- **Round selectie** voor verschillende fases van de cup
- **Wedstrijden overzicht** van alle matches in de geselecteerde round
- **Consistente navigatie** tussen verschillende cup views

### User Stories

1. **Als voetbalfan** wil ik de wedstrijden van een cup kunnen bekijken
2. **Als gebruiker** wil ik wedstrijden van een specifiek seizoen kunnen zien
3. **Als gebruiker** wil ik eenvoudig kunnen wisselen tussen seizoenen
4. **Als gebruiker** wil ik verschillende rounds van de cup kunnen bekijken
5. **Als gebruiker** wil ik snel kunnen navigeren tussen rounds

## 🏗 Technical Implementation

### Componenten Structuur

```
CupDetailScreen/
├── SafeAreaView/        # Safe area wrapper
├── CupHeader/           # Back button header
├── CupInfo/             # Cup info sectie (logo, naam, land)
├── SeasonDropdown/      # Herbruikbare seizoen dropdown component
├── RoundDropdown/       # Herbruikbare round dropdown component
├── MatchesList/         # List of matches for selected round
├── MatchCard/           # Individual match card component
├── EmptyState/          # Empty state for no matches
└── LoadingStates/       # Loading en error states
```

### Navigation Flow

1. **CupCard Tap** → Navigate naar CupDetailScreen
2. **Screen Load** → Parse seasons from cup data
3. **Season Selection** → Load rounds for selected season
4. **Round Selection** → Load matches for selected round
5. **Data Fetching** → Load fixtures based on season and round

### Data Sources

- **Seasons**: From cup API response (already available)
- **Rounds**: `GET /fixtures/rounds?league={cupId}&season={year}`
- **Fixtures**: `GET /fixtures?league={cupId}&season={year}&round={roundName}`

### API Endpoints

- **Seasons**: Already in cup response data
- `GET /fixtures/rounds?league={cupId}&season={year}` - Rounds
- `GET /fixtures?league={cupId}&season={year}&round={roundName}` - Matches
- **Rate Limit**: 100 requests/day (free tier)

### Rounds API Integratie

#### API Endpoint

```
GET /fixtures/rounds?league={cupId}&season={year}&current={boolean}
```

#### Query Parameters

- **league** (integer, verplicht): De id van de cup
- **season** (integer, verplicht): 4 karakters YYYY formaat
- **current** (boolean, optioneel): true om huidige round info te krijgen

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures/rounds",
  "parameters": {
    "league": "45",
    "season": "2024"
  },
  "errors": [],
  "results": 8,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    "Final",
    "Semi-finals",
    "Quarter-finals",
    "Round of 16",
    "Round of 32",
    "Round of 64",
    "Qualifying Round",
    "Preliminary Round"
  ]
}
```

### Fixtures API Integratie

#### API Endpoint

```
GET /fixtures?league={cupId}&season={year}&round={roundName}
```

#### Query Parameters

- **league** (integer, verplicht): De id van de cup
- **season** (integer, verplicht): 4 karakters YYYY formaat
- **round** (string, verplicht): Round naam (bijv., "Final", "Semi-finals")

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures",
  "parameters": {
    "league": "45",
    "season": "2024",
    "round": "Final"
  },
  "errors": [],
  "results": 1,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "fixture": {
        "id": 1234567,
        "referee": "John Smith",
        "timezone": "UTC",
        "date": "2024-05-15T20:00:00+00:00",
        "timestamp": 1715803200,
        "periods": {
          "first": 1715803200,
          "second": null
        },
        "venue": {
          "id": 1234,
          "name": "Wembley Stadium",
          "city": "London"
        },
        "status": {
          "long": "Not Started",
          "short": "NS",
          "elapsed": null
        }
      },
      "league": {
        "id": 45,
        "name": "FA Cup",
        "country": "England",
        "logo": "https://media.api-sports.io/football/leagues/45.png",
        "flag": "https://media.api-sports.io/flags/gb.svg",
        "season": 2024,
        "round": "Final"
      },
      "teams": {
        "home": {
          "id": 40,
          "name": "Liverpool",
          "logo": "https://media.api-sports.io/football/teams/40.png",
          "winner": null
        },
        "away": {
          "id": 50,
          "name": "Manchester City",
          "logo": "https://media.api-sports.io/football/teams/50.png",
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

### Season Data Structuur

```javascript
// From cup API response
{
  "year": 2024,
  "start": "2024-08-01",
  "end": "2025-05-31",
  "current": true,
  "coverage": {
    "fixtures": {
      "events": true,
      "lineups": true,
      "statistics_fixtures": false,
      "statistics_players": false
    },
    "standings": false,
    "players": true,
    "top_scorers": true,
    "top_assists": true,
    "top_cards": true,
    "injuries": true,
    "predictions": true,
    "odds": false
  }
}
```

### State Management

```javascript
// Cup Detail Context
{
  cup: Cup,
  selectedSeason: Season,
  seasons: Season[],
  rounds: string[],
  selectedRound: string | null,
  currentRound: string | null,
  fixtures: Fixture[],
  isLoadingSeasons: boolean,
  isLoadingRounds: boolean,
  isLoadingFixtures: boolean,
  seasonsError: string | null,
  roundsError: string | null,
  fixturesError: string | null,
  setSelectedSeason: (season: Season) => void,
  setSelectedRound: (round: string) => void,
  fetchRounds: (cupId: number, season: number) => Promise<void>,
  fetchFixtures: (cupId: number, season: number, round: string) => Promise<void>
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege seasons**: Fallback naar beschikbare seizoenen
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Invalid season data**: Data validation en filtering
- **Missing coverage**: Check coverage before API calls
- **No rounds**: Empty states voor rounds dropdown
- **Empty fixtures**: Empty states voor matches
- **Invalid cup data**: Data validation en fallback

### Performance Optimizations

- **Season Caching**: Cache seasons from cup response
- **Data Caching**: Cache rounds/fixtures per season
- **Lazy Loading**: Alleen laden wanneer round geselecteerd is
- **Image Caching**: Team logos cachen
- **Virtual Scrolling**: Voor grote match lijsten
- **Round Optimization**: Efficient rendering van round dropdown

### Error Handling

- **API Errors**: Retry mechanism met exponential backoff
- **Network Timeout**: 10 seconden timeout, fallback UI
- **Invalid Data**: Graceful degradation, error boundaries
- **Rate Limit**: User feedback en cached data
- **Coverage Issues**: Check coverage before API calls
- **Data Parsing Errors**: Fallback naar lege state

## 📱 UI/UX Specificaties

### SafeAreaView Component

```javascript
{
  style: object,       // Safe area styling
  children: ReactNode  // Screen content
}
```

### CupHeader Component

```javascript
{
  onBack: () => void   // Navigation back
}
```

### CupInfo Component

```javascript
{
  id: number,          // Cup ID
  name: string,        // Cup name
  logo: string,        // Cup logo URL
  country: Country,    // Country info
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

### RoundDropdown Component

Gebruikt de herbruikbare `RoundDropdown` component uit `components.md`:

```javascript
{
  rounds: string[],           // Beschikbare rounds
  selectedRound: string,      // Huidig geselecteerde round
  currentRound: string | null, // Huidige round indien beschikbaar
  onRoundChange: (round: string) => void, // Callback bij round wijziging
  disabled?: boolean,         // Loading state
  placeholder?: string,       // Optional placeholder text
  size?: 'small' | 'medium' | 'large', // Optional size variant
  showCurrent?: boolean,      // Optional current round indicator
  style?: object             // Optional custom styling
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

Gebruikt de herbruikbare `MatchCard` component uit `components.md`:

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

### Scherm Layout

```
┌─────────────────────────┐
│ SafeAreaView            │
├─────────────────────────┤
│ Cup Header             │
│ ← Terug                 │
├─────────────────────────┤
│ Cup Info               │
│ [Logo] Cup Name        │
│        Country Name    │
├─────────────────────────┤
│ Season Dropdown        │
├─────────────────────────┤
│ Round Dropdown         │
│ [Final ▼]              │
├─────────────────────────┤
│ Matches List           │
│ ┌─────────────────────┐ │
│ │ Team A vs Team B    │ │
│ │ 2 - 1 | Full Time   │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Team C vs Team D    │ │
│ │ 0 - 0 | Not Started │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Visueel Design

- **Cup Header**: Logo, naam, land vlag, terug knop
- **Season Dropdown**: Clean dropdown met seizoen opties
- **Round Dropdown**: Clean dropdown met round opties
- **Matches List**: Clean lijst met match cards
- **Loading States**: Skeleton loading voor content

### Interactie States

- **Normal**: Standaard styling
- **Loading**: Skeleton state voor content
- **Error**: Error state met retry knop
- **Empty**: Empty state met CTA
- **Disabled**: Verminderde opacity voor dropdowns
- **Match Press**: Navigeer naar match detail

## ✅ Acceptance Criteria

### Functionele Vereisten

- [ ] Gebruiker kan navigeren naar Cup Detail Screen
- [ ] Seizoen dropdown toont alle beschikbare seizoenen
- [ ] Gebruiker kan seizoen selecteren
- [ ] Round dropdown wordt opgevuld na seizoen selectie
- [ ] Gebruiker kan round selecteren
- [ ] Data wordt geladen voor geselecteerde seizoen en round
- [ ] Back navigation werkt correct
- [ ] Data wordt gecached voor performance
- [ ] Match cards tonen teams, scores, status en venue
- [ ] Gebruiker kan op match klikken voor details

### Niet-Functionele Vereisten

- [ ] Scherm laad tijd < 2 seconden
- [ ] Season change tijd < 1 seconde
- [ ] Round change tijd < 1 seconde
- [ ] Offline functionaliteit voor cached data
- [ ] Error states voor alle edge cases
- [ ] Loading states voor alle async operaties
- [ ] Match list rendering tijd < 100ms

### UI Vereisten

- [ ] Responsive design voor verschillende scherm groottes
- [ ] Consistente styling met app theme
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Soepele dropdown transitions
- [ ] Proper empty states en loading states
- [ ] Scrollbare match lijst voor grote lijsten

### Data Vereisten

- [ ] Correcte season data parsing
- [ ] Proper coverage checking
- [ ] Data validatie voor corrupte responses
- [ ] Caching strategie voor rounds/fixtures
- [ ] Error handling voor API failures
- [ ] Correcte fixtures data parsing

## 🔧 Gebruik Voorbeelden

### Navigatie naar Cup Detail

```typescript
// Van CupCard
onPress={() => navigation.navigate('CupDetail', {
  item: selectedCup
})}
```

### Season Dropdown Gebruik

```typescript
<SeasonDropdown
  seasons={cup.seasons}
  selectedSeason={selectedSeason}
  onSeasonChange={(season) => {
    setSelectedSeason(season);
    fetchRoundsForSeason(cup.id, season.year);
  }}
  disabled={isLoadingSeasons}
  placeholder="Selecteer seizoen"
  showCurrent={true}
  size="medium"
  coverageType="fixtures" // Cups hebben fixtures coverage
/>
```

### Round Dropdown Gebruik

```typescript
<RoundDropdown
  rounds={rounds}
  selectedRound={selectedRound}
  currentRound={currentRound}
  onRoundChange={(round) => {
    setSelectedRound(round);
    fetchFixtures(cup.id, selectedSeason.year, round);
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
    round: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Fixture[];
}

// Haal rounds op voor cup en season
const fetchRounds = async (cupId: number, season: number): Promise<void> => {
  try {
    setLoadingRounds(true);
    setRoundsError(null);

    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${cupId}&season=${season}`,
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

    // Krijg huidige round indien beschikbaar
    const currentRound = await getCurrentRound(cupId, season);
    setCurrentRound(currentRound);

    // Stel geselecteerde round in op huidige round of eerste round
    if (currentRound) {
      setSelectedRound(currentRound);
      // Haal fixtures op voor huidige round
      await fetchFixtures(cupId, season, currentRound);
    } else if (validatedRounds.length > 0) {
      setSelectedRound(validatedRounds[0]);
      // Haal fixtures op voor eerste round
      await fetchFixtures(cupId, season, validatedRounds[0]);
    }
  } catch (error) {
    console.error("Rounds API error:", error);
    setRoundsError(error instanceof Error ? error.message : "Unknown error");
    setRounds([]);
  } finally {
    setLoadingRounds(false);
  }
};

// Haal fixtures op voor cup, season en round
const fetchFixtures = async (
  cupId: number,
  season: number,
  round: string
): Promise<void> => {
  try {
    setLoadingFixtures(true);
    setFixturesError(null);

    const response = await fetch(
      `${
        API_CONFIG.baseURL
      }/fixtures?league=${cupId}&season=${season}&round=${encodeURIComponent(
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
const validateRounds = (data: RoundsApiResponse): string[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter((round) => typeof round === "string");
};

const validateFixtures = (data: FixturesApiResponse): Fixture[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (fixture) => fixture && fixture.fixture && fixture.teams
  );
};

// Get current round
const getCurrentRound = async (
  cupId: number,
  season: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/rounds?league=${cupId}&season=${season}&current=true`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      return null;
    }

    const data: RoundsApiResponse = await response.json();
    return data.response?.[0] || null;
  } catch (error) {
    console.error("Current round API error:", error);
    return null;
  }
};
```

### Coverage Controle

```typescript
// Controleer of fixtures beschikbaar zijn voor season
const canShowFixtures = (season: Season): boolean => {
  return season.coverage?.fixtures?.events === true;
};
```
