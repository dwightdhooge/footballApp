# Reusable Components

## 🎯 Component Overview

### Gebruikersdoelen

- **Consistentie** in UI/UX door herbruikbare componenten
- **Efficiëntie** in development door component hergebruik
- **Maintainability** door gecentraliseerde component logica
- **Performance** door geoptimaliseerde rendering
- **Type Safety** door TypeScript interfaces
- **Cross-Platform** support voor mobile en web

## 🏗 Technical Implementation

### Platform-Specific Component Structure

```
src/platforms/
├── mobile/
│   └── components/
│       ├── common/           # Mobile-specific common components
│       │   ├── CachedImage.tsx
│       │   ├── CacheManagement.tsx
│       │   ├── DetailHeader.tsx
│       │   ├── FavoriteButton.tsx
│       │   ├── RoundDropdown.tsx
│       │   ├── SeasonDropdown.tsx
│       │   ├── StateComponents.tsx
│       │   └── SvgImage.tsx
│       ├── country/          # Country-related components
│       ├── cup/              # Cup-related components
│       ├── favorites/        # Favorites components
│       ├── homescreen/       # Homescreen components
│       ├── league/           # League components
│       ├── match/            # Match components
│       ├── player/           # Player components
│       ├── settings/         # Settings components
│       ├── team/             # Team components
│       └── utility/          # Utility components
└── web/
    └── components/
        ├── cards/            # Web-specific card components
        ├── CategoryTabs.tsx  # Web favorites tabs
        ├── SearchBar.tsx     # Web search component
        └── SearchResults.tsx # Web search results
```

### Componenten Structuur

```
components/
├── CountryCard/         # Herbruikbare land kaart
├── LeagueCard/          # Herbruikbare league kaart
├── FlagSvg/            # SVG flag rendering component
├── MatchCard/          # Herbruikbare wedstrijd kaart
├── TeamRow/            # Herbruikbare team rij voor standings
├── SeasonDropdown/     # Herbruikbare seizoen dropdown
└── RoundDropdown/      # Herbruikbare round dropdown
```

## 📱 Component Specifications

### TypeScript Interfaces

```typescript
// Base types
interface Country {
  name: string;
  code: string;
  flag: string;
}

interface League {
  id: number;
  name: string;
  logo: string;
  type: "League" | "Cup";
  country: string;
  flag: string;
  season: number;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Season {
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

interface Fixture {
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

interface Standing {
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
```

### CountryCard Component

#### Gebruik

```typescript
<CountryCard
  name="Belgium"
  code="BE"
  flag="https://media.api-sports.io/flags/be.svg"
  isFavorite={true}
  onPress={() => navigateToCountry()}
  onHeartPress={() => toggleFavorite()}
/>
```

#### Props Interface

```typescript
interface CountryCardProps {
  name: string; // API response field
  code: string; // API response field
  flag: string; // API response field (SVG URL)
  isFavorite: boolean; // App-specific field
  onPress: () => void;
  onHeartPress: () => void;
  size?: "small" | "medium" | "large"; // Optional size variant
  showHeart?: boolean; // Optional heart visibility
  disabled?: boolean; // Optional disabled state
}
```

#### Layout Specifications

- **Small**: 120px width, 32px flag, compact layout
- **Medium**: 140px width, 40px flag, standard layout
- **Large**: 160px width, 48px flag, detailed layout

#### Visual Design

- **Flag**: SVG vlag via FlagSvg component (top)
- **Country Name**: Bold, 14px (center)
- **Code**: Small, 12px, secondary color (bottom)
- **Heart Icon**: Top right corner (optional)
- **Border**: Subtle border, rounded corners
- **Shadow**: Light shadow voor depth

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Favorite**: Heart filled, accent color
- **Disabled**: Reduced opacity (0.5), no interactions
- **Loading**: Skeleton state (niet geïmplementeerd)

### LeagueCard Component

#### Gebruik

```typescript
<LeagueCard
  id={39}
  name="Premier League"
  logo="https://media.api-sports.io/football/leagues/2.png"
  type="League"
  onPress={() => navigateToLeague()}
/>
```

#### Props Interface

```typescript
interface LeagueCardProps {
  id: number; // League ID
  name: string; // League name
  logo: string; // League logo URL
  type: "League" | "Cup"; // League type
  onPress: () => void; // Navigate to league detail
  size?: "small" | "medium" | "large"; // Optional size variant
  disabled?: boolean; // Optional disabled state
}
```

#### Layout Specifications

- **Small**: 80px width, 24px logo, compact layout
- **Medium**: 100px width, 24px logo, standard layout
- **Large**: 120px width, 32px logo, detailed layout

#### Visual Design

- **Logo**: League logo via Image component (top)
- **League Name**: Bold, 14px (center)
- **Type Badge**: Small badge showing "League" or "Cup" (bottom)
- **Border**: Subtle border, rounded corners
- **Shadow**: Light shadow voor depth

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Disabled**: Reduced opacity (0.5), no interactions
- **Loading**: Skeleton state (niet geïmplementeerd)

### MatchCard Component

#### Gebruik

```typescript
<MatchCard
  fixture={fixture}
  onPress={() => navigateToMatch(fixture)}
  size="medium"
  showVenue={true}
  showStatus={true}
/>
```

#### Props Interface

```typescript
interface MatchCardProps {
  fixture: Fixture; // Fixture data object
  onPress: () => void; // Navigate to match detail
  size?: "small" | "medium" | "large"; // Optional size variant
  showVenue?: boolean; // Optional venue display
  showStatus?: boolean; // Optional status display
  disabled?: boolean; // Optional disabled state
}
```

#### Layout Specifications

- **Small**: Compact layout, alleen teams en score, 8px padding, 12px font
- **Medium**: Standaard layout met status en tijd, 12px padding, 14px font
- **Large**: Uitgebreide layout met venue en details, 16px padding, 16px font

#### Visual Design

- **Teams**: Home en away team met logos en namen
- **Score**: Duidelijke score weergave (hoofdscore + penalties indien beschikbaar)
- **Status**: Match status met kleur coding
- **Time**: Match datum en tijd in Nederlandse format
- **Venue**: Stadion naam en stad (alleen in medium en large sizes)
- **Border**: Subtle border, rounded corners
- **Shadow**: Light shadow voor depth
- **Header**: Status badge, datum/tijd, elapsed time voor live wedstrijden

#### Score Display Logic

```typescript
interface DisplayScore {
  mainScore: {
    home: number | null;
    away: number | null;
  };
  hasPenalties: boolean;
  penaltyScore: {
    home: number | null;
    away: number | null;
  } | null;
}

const getDisplayScore = (fixture: Fixture): DisplayScore => {
  const { score, goals } = fixture;

  // Main score comes from goals object (always correct)
  const mainScore = {
    home: goals.home,
    away: goals.away,
  };

  // Check if penalties are available for additional display
  const hasPenalties =
    score.penalty?.home !== null && score.penalty?.away !== null;

  return {
    mainScore,
    hasPenalties,
    penaltyScore: hasPenalties
      ? {
          home: score.penalty.home,
          away: score.penalty.away,
        }
      : null,
  };
};
```

#### Status Color Mapping

```typescript
type StatusType =
  | "TBD"
  | "NS"
  | "1H"
  | "HT"
  | "2H"
  | "ET"
  | "P"
  | "FT"
  | "AET"
  | "PEN"
  | "LIVE";

const getStatusColor = (status: StatusType): string => {
  const statusMap: Record<StatusType, string> = {
    TBD: "#666",
    NS: "#666",
    "1H": "#4CAF50",
    HT: "#FF9800",
    "2H": "#4CAF50",
    ET: "#9C27B0",
    P: "#9C27B0",
    FT: "#2196F3",
    AET: "#9C27B0",
    PEN: "#9C27B0",
    LIVE: "#4CAF50",
  };
  return statusMap[status] || "#666";
};
```

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Live**: Special highlighting voor live wedstrijden met elapsed time
- **Finished**: Muted styling voor afgelopen wedstrijden
- **Disabled**: Reduced opacity (0.5), no interactions
- **Loading**: Skeleton state (niet geïmplementeerd)

### TeamRow Component

#### Gebruik

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
/>
```

#### Props Interface

```typescript
interface TeamRowProps {
  rank: number; // Position in table
  team: Team; // Team object
  points: number; // Total points
  goalsDiff: number; // Goal difference
  form: string; // Recent form (e.g., "WWWWW")
  status: string; // Status (e.g., "same", "up", "down")
  description: string; // Promotion/relegation description
  played: number; // Matches played
  won: number; // Matches won
  drawn: number; // Matches drawn
  lost: number; // Matches lost
  goalsFor: number; // Goals scored
  goalsAgainst: number; // Goals conceded
  onPress: () => void; // Navigate to team
  showForm?: boolean; // Optional form display
  showStatus?: boolean; // Optional status display
  size?: "compact" | "standard" | "detailed"; // Optional size variant
}
```

#### Layout Specifications

- **Compact**: Alleen rank, team, points en goalsDiff, 8px padding, 12px font
- **Standard**: Alle basis statistieken, 10px padding, 14px font
- **Detailed**: Volledige statistieken met form en status, 12px padding, 16px font

#### Visual Design

- **Rank**: Bold number met position indicator
- **Team**: Logo en naam
- **Statistics**: Played, won, drawn, lost, goals
- **Points**: Bold total points
- **Form**: Recent form met kleur coding
- **Status**: Position change indicator
- **Description**: Promotion/relegation info
- **Border**: Subtle row border
- **Background**: Alternating row colors

#### Form Display Logic

```typescript
interface FormResult {
  result: "W" | "D" | "L";
  color: string;
}

const getFormDisplay = (form: string): FormResult[] => {
  if (!form) return [];

  return form
    .slice(-5)
    .split("")
    .map((result) => ({
      result: result as "W" | "D" | "L",
      color:
        result === "W" ? "#4CAF50" : result === "D" ? "#FF9800" : "#F44336",
    }));
};
```

#### Status Display Logic

```typescript
interface StatusDisplay {
  type: "champions-league" | "europa-league" | "relegation" | "normal";
  color: string;
}

const getStatusDisplay = (
  status: string,
  description: string
): StatusDisplay => {
  if (description?.includes("Champions League")) {
    return { type: "champions-league", color: "#2196F3" };
  }
  if (description?.includes("Europa League")) {
    return { type: "europa-league", color: "#9C27B0" };
  }
  if (description?.includes("Relegation")) {
    return { type: "relegation", color: "#F44336" };
  }
  return { type: "normal", color: "#666" };
};
```

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Promotion**: Special highlighting voor promotie (niet geïmplementeerd)
- **Relegation**: Special highlighting voor degradatie (niet geïmplementeerd)
- **Champions League**: Special highlighting voor CL (niet geïmplementeerd)
- **Disabled**: Reduced opacity, no interactions (niet geïmplementeerd)
- **Loading**: Skeleton state (niet geïmplementeerd)

### FlagSvg Component

#### Gebruik

```typescript
<FlagSvg
  url="https://media.api-sports.io/flags/be.svg"
  size={24}
  onError={(error) => handleFlagError(error)}
  style={customStyles}
/>
```

#### Props Interface

```typescript
interface FlagSvgProps {
  url: string; // SVG URL from API
  size: number; // Width/height in pixels
  onError?: (error: Error) => void; // Error callback
  style?: StyleProp<ViewStyle>; // Additional styling
}
```

#### Implementation

```typescript
import { SvgUri } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

const FlagSvg: React.FC<FlagSvgProps> = ({
  url,
  size = 24,
  onError,
  style,
}) => {
  const handleError = (error: Error) => {
    console.warn("Flag loading error:", error);
    onError?.(error);
  };

  return (
    <SvgUri
      width={size}
      height={size}
      uri={url}
      onError={handleError}
      style={[styles.flag, style]}
    />
  );
};
```

#### Error Handling

- **Network Error**: Fallback naar placeholder (🏳️ emoji)
- **Invalid URL**: Default country icon (🏳️ emoji)
- **Loading State**: Skeleton placeholder (niet geïmplementeerd)
- **Caching**: React Native SVG caching
- **Error State**: Component toont fallback na eerste error

### SeasonDropdown Component

#### Gebruik

```typescript
<SeasonDropdown
  seasons={seasons}
  selectedSeason={selectedSeason}
  onSeasonChange={(season) => setSelectedSeason(season)}
  disabled={isLoading}
  placeholder="Selecteer seizoen"
  coverageType="standings" // "standings" voor leagues, "fixtures" voor cups
/>
```

#### Props Interface

```typescript
interface SeasonDropdownProps {
  seasons: Season[]; // Array van beschikbare seizoenen
  selectedSeason: Season | null; // Huidig geselecteerd seizoen
  onSeasonChange: (season: Season) => void; // Callback bij seizoen wijziging
  disabled?: boolean; // Optional disabled state
  placeholder?: string; // Optional placeholder text
  size?: "small" | "medium" | "large"; // Optional size variant
  showCurrent?: boolean; // Optional current season indicator
  coverageType?: "standings" | "fixtures"; // Coverage type voor filtering
  style?: StyleProp<ViewStyle>; // Optional custom styling
}
```

#### Layout Specifications

- **Small**: Compact dropdown, 32px height, 12px font
- **Medium**: Standaard dropdown, 40px height, 14px font
- **Large**: Grote dropdown, 48px height, 16px font

#### Visual Design

- **Container**: Rounded border, subtle background
- **Selected Value**: Bold text met seizoen jaar
- **Dropdown Icon**: Chevron down/up based on state
- **Current Indicator**: Special highlighting voor huidig seizoen
- **Disabled State**: Reduced opacity, no interactions
- **Loading State**: Skeleton placeholder

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Disabled**: Reduced opacity (0.5), no interactions
- **Loading**: Skeleton state (niet geïmplementeerd)
- **Current Season**: Special highlighting
- **Dropdown Open**: Chevron up, expanded state

#### Coverage Filtering Logic

```typescript
// Filter seasons based on coverage type
const getFilteredSeasons = (
  seasons: Season[],
  coverageType?: "standings" | "fixtures"
): Season[] => {
  if (!coverageType) return seasons;

  return seasons.filter((season) => {
    if (coverageType === "standings") {
      return season.coverage?.standings === true;
    }
    if (coverageType === "fixtures") {
      return season.coverage?.fixtures?.events === true;
    }
    return true;
  });
};

// Check if season has required coverage
const hasRequiredCoverage = (
  season: Season,
  coverageType?: "standings" | "fixtures"
): boolean => {
  if (!coverageType) return true;

  if (coverageType === "standings") {
    return season.coverage?.standings === true;
  }
  if (coverageType === "fixtures") {
    return season.coverage?.fixtures?.events === true;
  }
  return true;
};
```

### RoundDropdown Component

#### Gebruik

```typescript
<RoundDropdown
  rounds={rounds}
  selectedRound={selectedRound}
  currentRound={currentRound}
  onRoundChange={(round) => setSelectedRound(round)}
  disabled={isLoading}
  placeholder="Selecteer round"
/>
```

#### Props Interface

```typescript
interface RoundDropdownProps {
  rounds: string[]; // Array van beschikbare rounds
  selectedRound: string | null; // Huidig geselecteerde round
  currentRound: string | null; // Huidige round indien beschikbaar
  onRoundChange: (round: string) => void; // Callback bij round wijziging
  disabled?: boolean; // Optional disabled state
  placeholder?: string; // Optional placeholder text
  size?: "small" | "medium" | "large"; // Optional size variant
  showCurrent?: boolean; // Optional current round indicator
  style?: StyleProp<ViewStyle>; // Optional custom styling
}
```

#### Layout Specifications

- **Small**: Compact dropdown, 32px height, 12px font
- **Medium**: Standaard dropdown, 40px height, 14px font
- **Large**: Grote dropdown, 48px height, 16px font

#### Visual Design

- **Container**: Rounded border, subtle background
- **Selected Value**: Bold text met round naam
- **Dropdown Icon**: Chevron down/up based on state
- **Current Indicator**: Special highlighting voor huidige round
- **Disabled State**: Reduced opacity, no interactions
- **Loading State**: Skeleton placeholder

#### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Disabled**: Reduced opacity (0.5), no interactions
- **Loading**: Skeleton state (niet geïmplementeerd)
- **Current Round**: Special highlighting
- **Dropdown Open**: Chevron up, expanded state

#### Round Display Logic

```typescript
const getRoundDisplay = (roundName: string): string => {
  const roundMap: Record<string, string> = {
    Final: "Finale",
    "Semi-finals": "Halve Finale",
    "Quarter-finals": "Kwart Finale",
    "Round of 16": "1/8 Finale",
    "Round of 32": "1/16 Finale",
    "Round of 64": "1/32 Finale",
    "Qualifying Round": "Kwalificatie",
    "Preliminary Round": "Voorronde",
  };

  return roundMap[roundName] || roundName;
};
```

## 🧪 Quality Considerations

### Edge Cases

- **Missing Flag URL**: Fallback naar placeholder (🏳️ emoji)
- **Invalid SVG**: Error handling en fallback ✅
- **Network Issues**: Offline mode voor vlaggen (niet geïmplementeerd)
- **Memory Issues**: Efficient SVG rendering ✅
- **Performance**: Lazy loading van SVG's (niet geïmplementeerd)
- **Missing League Logo**: Fallback naar placeholder (console warning)
- **Invalid League Data**: Data validation (basis implementatie)
- **Missing Team Logo**: Fallback naar placeholder voor team logos (niet geïmplementeerd)
- **Invalid Match Data**: Data validation voor fixtures (basis implementatie)
- **Missing Score Data**: Graceful handling van ontbrekende scores ✅
- **Invalid Status**: Fallback voor onbekende match statussen ✅
- **Empty Form Data**: Fallback voor ontbrekende form data ✅
- **Invalid Team Data**: Data validation voor team informatie (basis implementatie)
- **Type Safety**: TypeScript strict mode compliance ✅
- **Null Safety**: Proper null checking voor optional properties ✅

### Performance Optimizations

- **SVG Caching**: React Native SVG caching ✅
- **Lazy Loading**: SVG's alleen laden wanneer zichtbaar (niet geïmplementeerd)
- **Memory Management**: Efficient rendering ✅
- **Image Optimization**: SVG's zijn van nature geoptimaliseerd ✅
- **League Logo Caching**: Image caching voor league logos (basis implementatie)
- **Team Logo Caching**: Image caching voor team logos (basis implementatie)
- **Match Card Virtualization**: Virtual scrolling voor grote match lijsten (niet geïmplementeerd)
- **Standings Table Optimization**: Efficient rendering van grote tabellen ✅
- **Score Calculation Caching**: Cache berekende scores (niet geïmplementeerd)
- **Status Color Caching**: Cache status kleur mappings ✅
- **Type Checking**: Compile-time type checking voor betere performance ✅

### Error Handling

- **SVG Loading Errors**: Fallback naar placeholder (🏳️ emoji) ✅
- **Network Errors**: Graceful degradation ✅
- **Invalid Data**: Data validation en filtering (basis implementatie)
- **Memory Issues**: Cleanup van oude SVG's (niet geïmplementeerd)
- **League Logo Errors**: Fallback naar placeholder (console warning) ✅
- **Team Logo Errors**: Fallback naar placeholder voor team logos (niet geïmplementeerd)
- **Match Data Errors**: Graceful degradation voor corrupte match data ✅
- **Score Calculation Errors**: Fallback naar basis score weergave ✅
- **Status Mapping Errors**: Fallback naar standaard status ✅
- **Form Data Errors**: Graceful handling van ontbrekende form data ✅
- **Type Errors**: TypeScript compile-time error detection ✅
- **Runtime Errors**: Try-catch blocks voor runtime errors (basis implementatie)

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] CountryCard kan gebruikt worden in alle contexts
- [ ] LeagueCard kan gebruikt worden in alle contexts
- [ ] FlagSvg rendert SVG vlaggen correct
- [ ] Heart icon toont correcte favoriet status
- [ ] MatchCard kan gebruikt worden in alle match contexts
- [ ] TeamRow kan gebruikt worden in alle standings contexts
- [ ] Score weergave werkt correct voor alle score types
- [ ] Status weergave werkt correct voor alle match statussen
- [ ] Form weergave werkt correct voor alle form data
- [ ] Componenten zijn herbruikbaar en consistent
- [ ] Error handling werkt voor alle edge cases
- [ ] Performance is geoptimaliseerd
- [ ] TypeScript strict mode compliance
- [ ] Alle componenten hebben proper TypeScript interfaces
- [ ] Cross-platform compatibility (mobile + web)

### Non-Functional Requirements

- [ ] Component rendering time < 100ms
- [ ] SVG loading time < 500ms
- [ ] Memory efficient voor grote lijsten
- [ ] Consistent styling across app
- [ ] Accessibility support
- [ ] TypeScript compile time < 5 seconds
- [ ] No TypeScript errors in strict mode
- [ ] Platform-specific optimizations

### UI Requirements

- [ ] Responsive design voor verschillende screen sizes
- [ ] Consistent styling met app theme
- [ ] Smooth animations voor interactions
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Proper spacing en typography
- [ ] Type-safe props validation
- [ ] Platform-specific UI patterns

## 🔧 Usage Examples

### In Search Results

```typescript
<CountryCard
  name={country.name}
  code={country.code}
  flag={country.flag}
  isFavorite={isFavorite(country.code)}
  onPress={() => navigateToCountry(country)}
  onHeartPress={() => toggleFavorite(country)}
  size="medium"
/>
```

### In Favorites Section

```typescript
<CountryCard
  name={favorite.name}
  code={favorite.code}
  flag={favorite.flag}
  isFavorite={true}
  onPress={() => navigateToCountry(favorite)}
  onHeartPress={() => removeFavorite(favorite)}
  size="small"
  showHeart={true}
/>
```

### In Suggested Section

```typescript
<CountryCard
  name={suggested.name}
  code={suggested.code}
  flag={suggested.flag}
  isFavorite={isFavorite(suggested.code)}
  onPress={() => navigateToCountry(suggested)}
  onHeartPress={() => toggleFavorite(suggested)}
  size="small"
/>
```

### In Leagues Section

```typescript
<LeagueCard
  id={league.league.id}
  name={league.league.name}
  logo={league.league.logo}
  type={league.league.type}
  onPress={() => navigateToLeague(league)}
  size="small"
/>
```

### In Cups Section

```typescript
<LeagueCard
  id={cup.league.id}
  name={cup.league.name}
  logo={cup.league.logo}
  type={cup.league.type}
  onPress={() => navigateToCup(cup)}
  size="small"
/>
```

### In Matches List

```typescript
<MatchCard
  fixture={fixture}
  onPress={() => navigateToMatch(fixture)}
  size="medium"
  showVenue={true}
  showStatus={true}
/>
```

### In Standings Table

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

### In Compact Standings

```typescript
<TeamRow
  rank={standing.rank}
  team={standing.team}
  points={standing.points}
  goalsDiff={standing.goalsDiff}
  onPress={() => navigateToTeam(standing.team)}
  size="compact"
/>
```

### In Live Matches

```typescript
<MatchCard
  fixture={liveFixture}
  onPress={() => navigateToMatch(liveFixture)}
  size="large"
  showVenue={false}
  showStatus={true}
/>
```

### In Finished Matches

```typescript
<MatchCard
  fixture={finishedFixture}
  onPress={() => navigateToMatch(finishedFixture)}
  size="medium"
  showVenue={true}
  showStatus={false}
/>
```

### In League Detail Screen

```typescript
<SeasonDropdown
  seasons={league.seasons}
  selectedSeason={selectedSeason}
  onSeasonChange={(season) => {
    setSelectedSeason(season);
    fetchStandings(league.id, season.year);
  }}
  disabled={isLoadingSeasons}
  placeholder="Selecteer seizoen"
  showCurrent={true}
  coverageType="standings" // Leagues hebben standings coverage
/>
```

### In Cup Detail Screen

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
  coverageType="fixtures" // Cups hebben fixtures coverage
/>
```
