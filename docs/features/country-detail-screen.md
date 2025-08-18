# Country Detail Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Overzicht** van alle competities en cups per land
- **Snelle navigatie** naar specifieke leagues/cups
- **Visuele organisatie** van voetbalcompetities per type
- **Consistente ervaring** met homescreen componenten

### User Stories

1. **Als voetbalfan** wil ik alle competities van een land kunnen bekijken
2. **Als gebruiker** wil ik onderscheid kunnen maken tussen leagues en cups
3. **Als gebruiker** wil ik snel naar een specifieke competitie kunnen navigeren
4. **Als gebruiker** wil ik een overzichtelijk beeld van de voetbalstructuur van een land

## 🏗 Technical Implementation

### Componenten Structuur

```
CountryDetailScreen/
├── SafeAreaView/         # Safe area wrapper
├── CountryHeader/        # Back button header
├── CountryInfo/          # Land info sectie (logo, naam, vlag)
├── LeaguesSection/       # Leagues swimlane (hergebruikt voor cups)
├── LeagueCard/           # Herbruikbare league kaart
├── RefreshControl/       # Pull-to-refresh functionaliteit
└── LoadingStates/        # Loading en error states
```

### Navigation Flow

1. **CountryCard Tap** → Navigate naar CountryDetailScreen
2. **Screen Load** → Fetch leagues data voor land
3. **Data Processing** → Separate leagues en cups
4. **UI Render** → Display swimlanes

### API Endpoints

- `GET /leagues?code={countryCode}` - Alle leagues/cups voor land
- **Rate Limit**: 100 requests/day (free tier)

### API Response Structure

```javascript
// Expected API response format
{
  "get": "leagues",
  "parameters": {
    "code": "GB-ENG"
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
        "type": "League",
        "logo": "https://media.api-sports.io/football/leagues/2.png"
      },
      "country": {
        "name": "England",
        "code": "GB-ENG",
        "flag": "https://media.api-sports.io/flags/gb-eng.svg"
      },
      "seasons": [
        {
          "year": 2024,
          "start": "2024-08-14",
          "end": "2025-05-17",
          "current": true,
          "coverage": {
            "fixtures": {
              "events": true,
              "lineups": true,
              "statistics_fixtures": false,
              "statistics_players": false
            },
            "standings": true,
            "players": true,
            "top_scorers": true,
            "top_assists": true,
            "top_cards": true,
            "injuries": true,
            "predictions": true,
            "odds": false
          }
        }
      ]
    }
  ]
}
```

### Data Processing

```javascript
// Separate leagues and cups
const processLeaguesData = (apiResponse) => {
  const leagues = [];
  const cups = [];

  apiResponse.response.forEach((item) => {
    if (item.league.type === "League") {
      leagues.push(item);
    } else if (item.league.type === "Cup") {
      cups.push(item);
    }
  });

  return { leagues, cups };
};
```

### State Management

```javascript
// Country Detail Context
{
  country: Country,
  leagues: League[],
  cups: League[],
  isLoading: boolean,
  error: string | null,
  fetchLeagues: (countryCode: string) => Promise<void>,
  clearData: () => void
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege leagues/cups**: Empty state voor beide swimlanes
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Invalid league data**: Data validation en filtering
- **Mixed league types**: Correcte categorisering
- **Missing logos**: Fallback naar placeholder

### Performance Optimizations

- **Lazy Loading**: Alleen zichtbare leagues laden
- **Image Caching**: League logos cachen
- **Data Caching**: Leagues data cachen per land
- **Virtual Scrolling**: Voor grote lijsten leagues

### Error Handling

- **API Errors**: Basis error handling met console logging
- **Network Timeout**: HTTP status error handling
- **Invalid Data**: API response validation
- **Rate Limit**: HTTP status code handling
- **Data Processing Errors**: Try-catch blocks voor runtime errors
- **User Feedback**: Alert dialogs voor belangrijke errors
- **Refresh Retry**: Pull-to-refresh voor retry functionaliteit

## 📱 UI/UX Specifications

### SafeAreaView Component

```javascript
{
  style: object,       // Safe area styling
  children: ReactNode  // Screen content
}
```

### RefreshControl Component

```javascript
{
  refreshing: boolean,     // Refresh state
  onRefresh: () => void,   // Refresh callback
  colors: string[],        // Android refresh colors
  tintColor: string        // iOS refresh color
}
```

### CountryHeader Component

```javascript
{
  onBack: () => void   // Navigation back
}
```

### CountryInfo Component

```javascript
{
  name: string,        // Country name
  code: string,        // Country code
  flag: string,        // Country flag URL
}
```

### LeagueCard Component

```javascript
{
  id: number,          // League ID
  name: string,        // League name
  logo: string,        // League logo URL
  type: string,        // "League" or "Cup"
  onPress: () => void  // Navigate to league detail
}
```

### LeaguesSection (Swimlane)

- **Title**: "Leagues" of "Cups" (dynamisch)
- **Layout**: Horizontal scrollable swimlane
- **Max Visible**: 5 items, rest via scroll
- **Empty State**: "Geen {title.toLowerCase()} gevonden"
- **Loading State**: Skeleton cards (3 items)
- **Reusable**: Wordt gebruikt voor zowel leagues als cups

### Screen Layout

```
┌─────────────────────────┐
│ SafeAreaView            │
├─────────────────────────┤
│ Country Header          │
│ ← Terug                 │
├─────────────────────────┤
│ Country Info            │
│ [Flag] Country Name     │
├─────────────────────────┤
│ Leagues Section         │
│ [League1] [League2] ... │
├─────────────────────────┤
│ Cups Section            │
│ [Cup1] [Cup2] ...      │
└─────────────────────────┘
```

### Visual Design

- **Country Header**: Flag, name, back button
- **League Cards**: Logo, name, consistent met CountryCard style
- **Swimlanes**: Horizontal scroll, 120px height
- **Spacing**: 12px tussen items, 16px padding
- **Background**: Subtle background colors voor sections

### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Loading**: Skeleton state met 3 skeleton cards
- **Error**: Error state met Alert dialog en pull-to-refresh
- **Empty**: Empty state met dynamische titel
- **Refreshing**: Pull-to-refresh indicator

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Gebruiker kan navigeren naar Country Detail Screen
- [ ] Leagues en cups worden correct geladen voor land
- [ ] Leagues en cups worden gescheiden in verschillende swimlanes
- [ ] Gebruiker kan op league/cup cards klikken
- [ ] Country header toont correcte land informatie
- [ ] Back navigation werkt correct
- [ ] Data wordt gecached voor performance

### Non-Functional Requirements

- [ ] Screen load time < 2 seconden
- [ ] API response time < 3 seconden
- [ ] Offline functionaliteit voor cached data
- [ ] Error states voor alle edge cases
- [ ] Loading states voor alle async operaties
- [ ] Smooth animations voor transitions

### UI Requirements

- [ ] Responsive design voor verschillende screen sizes
- [ ] Consistent styling met app theme
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Smooth horizontal scrolling
- [ ] Proper empty states en loading states

### Data Requirements

- [ ] Correcte API response parsing
- [ ] Proper league/cup categorisering
- [ ] Data validation voor corrupte responses
- [ ] Caching strategie voor leagues data
- [ ] Error handling voor API failures

## 🔧 Usage Examples

### Navigation to Country Detail

```typescript
// From CountryCard
onPress={() => navigation.navigate('CountryDetail', {
  item: selectedCountry
})}
```

### LeagueCard Usage

```typescript
// In Leagues Section
<LeagueCard
  id={league.league.id}
  name={league.league.name}
  logo={league.league.logo}
  type={league.league.type}
  onPress={() => navigateToLeague(league)}
  size="small"
/>

// In Cups Section
<LeagueCard
  id={cup.league.id}
  name={cup.league.name}
  logo={cup.league.logo}
  type={cup.league.type}
  onPress={() => navigateToCup(cup)}
  size="small"
/>
```

### Data Fetching

```typescript
// API response interface
interface LeaguesApiResponse {
  get: string;
  parameters: {
    code: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: LeagueItem[];
}

// Fetch leagues for country
const fetchLeaguesForCountry = async (
  countryCode: string
): Promise<LeagueItem[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/leagues?code=${encodeURIComponent(countryCode)}`,
      { headers: API_CONFIG.headers }
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

// Process leagues data
interface ProcessedLeaguesData {
  leagues: LeagueItem[];
  cups: LeagueItem[];
}

const processLeaguesData = (
  apiResponse: LeagueItem[]
): ProcessedLeaguesData => {
  const leagues: LeagueItem[] = [];
  const cups: LeagueItem[] = [];

  apiResponse.forEach((item) => {
    if (item.league.type === "League") {
      leagues.push(item);
    } else if (item.league.type === "Cup") {
      cups.push(item);
    }
  });

  return { leagues, cups };
};
```
