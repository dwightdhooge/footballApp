# Match Detail Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Volledige match informatie** bekijken met scores, status en details
- **Chronologische events** volgen van de wedstrijd
- **Team lineups** bekijken met formaties en spelers
- **Consistente navigatie** tussen verschillende match views

### User Stories

1. **Als voetbalfan** wil ik alle details van een wedstrijd kunnen bekijken
2. **Als gebruiker** wil ik de chronologie van events kunnen volgen
3. **Als gebruiker** wil ik team formaties en spelers kunnen bekijken
4. **Als gebruiker** wil ik snel kunnen wisselen tussen verschillende match views
5. **Als gebruiker** wil ik gedetailleerde match statistieken kunnen zien

## 🏗 Technical Implementation

### Componenten Structuur

```
MatchDetailScreen/
├── SafeAreaView/        # Safe area wrapper
├── MatchHeader/         # Back button header met match titel
├── TabNavigation/       # Tab navigatie (Info, Events, Lineups)
├── TabContent/          # Tab content container
│   ├── InfoTab/         # Match informatie tab
│   ├── EventsTab/       # Events timeline tab
│   └── LineupsTab/      # Team lineups tab
├── MatchInfo/           # Match basis informatie component
├── EventsList/          # Events timeline lijst
├── EventItem/           # Individueel event item
├── LineupsGrid/         # Team lineups grid layout
├── TeamLineup/          # Team lineup sectie
├── PlayerRow/           # Speler rij component
├── PlayerStatus/        # Speler status indicator (cards, goals)
├── GoalIcon/            # Herbruikbare goal icon met penalty support
├── EmptyState/          # Empty state voor geen data
└── LoadingStates/       # Loading en error states
```

### Navigation Flow

1. **MatchCard Tap** → Navigate naar MatchDetailScreen
2. **Screen Load** → Load match info, events, en lineups data
3. **Tab Selection** → Switch tussen Info, Events, en Lineups tabs
4. **Data Fetching** → Load data voor geselecteerde tab
5. **Content Display** → Render tab-specifieke content

### Data Sources

- **Match Info**: From fixture data (already available)
- **Events**: `GET /fixtures/events?fixture={fixtureId}`
- **Lineups**: `GET /fixtures/lineups?fixture={fixtureId}`

### API Endpoints

- **Events**: `GET /fixtures/events?fixture={fixtureId}` - Match events
- **Lineups**: `GET /fixtures/lineups?fixture={fixtureId}` - Team lineups
- **Rate Limit**: 100 requests/day (free tier)

### Events API Integratie

#### API Endpoint

```
GET /fixtures/events?fixture={fixtureId}
```

#### Query Parameters

- **fixture** (integer, verplicht): De id van de wedstrijd

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures/events",
  "parameters": {
    "fixture": "215662"
  },
  "errors": [],
  "results": 18,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "time": {
        "elapsed": 25,
        "extra": null
      },
      "team": {
        "id": 463,
        "name": "Aldosivi",
        "logo": "https://media.api-sports.io/football/teams/463.png"
      },
      "player": {
        "id": 6126,
        "name": "F. Andrada"
      },
      "assist": {
        "id": null,
        "name": null
      },
      "type": "Goal",
      "detail": "Normal Goal",
      "comments": null
    },
    {
      "time": {
        "elapsed": 33,
        "extra": null
      },
      "team": {
        "id": 442,
        "name": "Defensa Y Justicia",
        "logo": "https://media.api-sports.io/football/teams/442.png"
      },
      "player": {
        "id": 5936,
        "name": "Julio González"
      },
      "assist": {
        "id": null,
        "name": null
      },
      "type": "Card",
      "detail": "Yellow Card",
      "comments": null
    }
  ]
}
```

### Lineups API Integratie

#### API Endpoint

```
GET /fixtures/lineups?fixture={fixtureId}
```

#### Query Parameters

- **fixture** (integer, verplicht): De id van de wedstrijd

#### Verwacht Response Structuur

```javascript
{
  "get": "fixtures/lineups",
  "parameters": {
    "fixture": "592872"
  },
  "errors": [],
  "results": 2,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "team": {
        "id": 50,
        "name": "Manchester City",
        "logo": "https://media.api-sports.io/football/teams/50.png",
        "colors": {
          "player": {
            "primary": "5badff",
            "number": "ffffff",
            "border": "99ff99"
          },
          "goalkeeper": {
            "primary": "99ff99",
            "number": "000000",
            "border": "99ff99"
          }
        }
      },
      "formation": "4-3-3",
      "startXI": [
        {
          "player": {
            "id": 617,
            "name": "Ederson",
            "number": 31,
            "pos": "G",
            "grid": "1:1"
          }
        }
      ],
      "substitutes": [
        {
          "player": {
            "id": 50828,
            "name": "Zack Steffen",
            "number": 13,
            "pos": "G",
            "grid": null
          }
        }
      ],
      "coach": {
        "id": 4,
        "name": "Guardiola",
        "photo": "https://media.api-sports.io/football/coachs/4.png"
      }
    }
  ]
}
```

### State Management

```javascript
// Match Detail Context
{
  fixture: Fixture,
  activeTab: 'info' | 'events' | 'lineups',
  events: Event[],
  lineups: Lineup[],
  isLoadingEvents: boolean,
  isLoadingLineups: boolean,
  eventsError: string | null,
  lineupsError: string | null,
  setActiveTab: (tab: 'info' | 'events' | 'lineups') => void,
  fetchEvents: (fixtureId: number) => Promise<void>,
  fetchLineups: (fixtureId: number) => Promise<void>
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege events**: Empty state voor events tab
- **Lege lineups**: Empty state voor lineups tab
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Invalid event data**: Data validation en filtering
- **Missing player data**: Graceful handling van ontbrekende speler info
- **Invalid lineup data**: Data validation en fallback
- **Missing team colors**: Fallback naar default kleuren
- **Large event lists**: Performance optimalisatie voor lange lijsten

### Performance Optimizations

- **Lazy Loading**: Alleen laden wanneer tab actief is
- **Data Caching**: Cache events en lineups data
- **Image Caching**: Team en speler logos cachen
- **Virtual Scrolling**: Voor grote event lijsten
- **Tab Optimization**: Efficient rendering van tab content
- **Event Grouping**: Group events by type voor betere performance

### Error Handling

- **API Errors**: Retry mechanism met exponential backoff
- **Network Timeout**: 10 seconden timeout, fallback UI
- **Invalid Data**: Graceful degradation, error boundaries
- **Rate Limit**: User feedback en cached data
- **Data Parsing Errors**: Fallback naar lege state
- **Missing Data**: Graceful handling van ontbrekende velden

## 📱 UI/UX Specificaties

### MatchHeader Component

```javascript
{
  fixture: Fixture,      // Fixture data
  onBack: () => void     // Navigation back
}
```

### TabNavigation Component

```javascript
{
  activeTab: 'info' | 'events' | 'lineups',
  onTabChange: (tab: 'info' | 'events' | 'lineups') => void,
  eventsCount?: number,   // Aantal events
  lineupsCount?: number   // Aantal teams met lineups
}
```

### MatchInfo Component (Info Tab)

```javascript
{
  fixture: Fixture,      // Fixture data
  showHalfTimeScore?: boolean, // Toon half time score indien beschikbaar
  showGoals?: boolean,   // Toon doelpunten
  showDetails?: boolean  // Toon datum, venue, referee
}
```

### EventsList Component (Events Tab)

```javascript
{
  events: Event[],
  isLoading: boolean,
  error: string | null,
  onEventPress?: (event: Event) => void
}
```

### EventItem Component

```javascript
{
  event: Event,           // Event data
  onPress?: () => void,   // Optional event press
  size?: 'small' | 'medium' | 'large' // Optional size variant
}
```

### LineupsGrid Component (Lineups Tab)

```javascript
{
  lineups: Lineup[],
  isLoading: boolean,
  error: string | null,
  onPlayerPress?: (player: Player) => void
}
```

### TeamLineup Component

```javascript
{
  lineup: Lineup,         // Team lineup data
  onPlayerPress?: (player: Player) => void,
  showFormation?: boolean, // Toon formatie
  showCoach?: boolean     // Toon coach informatie
}
```

### PlayerRow Component

```javascript
{
  player: Player,         // Player data
  position: string,       // Player position
  isStarting: boolean,    // Starting XI of substitute
  onPress?: () => void,   // Navigate to player
  showPosition?: boolean, // Toon positie indicator
  showNumber?: boolean,   // Toon shirt nummer
  playerStatus?: PlayerStatus // Player status (cards, goals)
}
```

### PlayerStatus Component

```javascript
{
  yellowCards: number,    // Aantal gele kaarten
  redCards: number,       // Aantal rode kaarten
  goals: number,          // Aantal doelpunten
  isPenaltyGoal: boolean, // Is het een penalty doelpunt
  showOverlapping?: boolean, // Toon overlappende kaarten
  showMultiple?: boolean  // Toon meerdere indicators naast elkaar
}
```

### GoalIcon Component

```typescript
interface GoalIconProps {
  isPenalty: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
}

const GoalIcon: React.FC<GoalIconProps> = ({
  isPenalty,
  size = 'medium',
  style
}) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const penaltySize = size === 'small' ? 8 : size === 'large' ? 12 : 10;

  if (isPenalty) {
    return (
      <View style={[styles.goalIconContainer, style]}>
        <Text style={[styles.ballIcon, { fontSize: iconSize }]}>⚽</Text>
        <Text style={[styles.penaltyIndicator, { fontSize: penaltySize }]}>P</Text>
      </View>
    );
  }
  return <Text style={[styles.ballIcon, { fontSize: iconSize }, style]}>⚽</Text>;
};

// Usage in events
<GoalIcon isPenalty={isPenaltyGoal(event.detail)} size="medium" />

// Usage in lineups
<GoalIcon isPenalty={playerStatus.isPenaltyGoal} size="small" />

// Multiple indicators example - Player scored and received a card
<View style={styles.playerStatusContainer}>
  {playerStatus.goals > 0 && (
    <GoalIcon isPenalty={playerStatus.isPenaltyGoal} size="small" />
  )}
  {playerStatus.yellowCards > 0 && (
    <Text style={styles.yellowCard}>🟨</Text>
  )}
  {playerStatus.redCards > 0 && (
    <Text style={styles.redCard}>🟥</Text>
  )}
</View>

// Styling for GoalIcon component
const styles = StyleSheet.create({
  goalIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballIcon: {
    fontSize: 20,
    lineHeight: 20,
  },
  penaltyIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for penalty indicator
    backgroundColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingVertical: 1,
    minWidth: 12,
    textAlign: 'center',
  },
  playerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yellowCard: {
    fontSize: 16,
  },
  redCard: {
    fontSize: 16,
  },
});

### Scherm Layout

```

┌─────────────────────────┐
│ SafeAreaView │
├─────────────────────────┤
│ Match Header │
│ ← Terug | Match Title │
├─────────────────────────┤
│ Tab Navigation │
│ [Info] [Events] [Lineups] │
├─────────────────────────┤
│ Tab Content │
│ ┌─────────────────────┐ │
│ │ Info Tab │ │
│ │ Score, Status, Time │ │
│ │ Goals, Date, Venue │ │
│ │ Referee │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Events Tab │ │
│ │ Event Timeline │ │
│ │ Goals, Cards, Subs │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Lineups Tab │ │
│ │ Team A | Team B │ │
│ │ Formation | Players │ │
│ │ Coach | Substitutes │ │
│ └─────────────────────┘ │
└─────────────────────────┘

````

### Visueel Design

- **Match Header**: Match titel, teams, terug knop
- **Tab Navigation**: Clean tabs met event counts
- **Info Tab**: Match score, status, goals, details
- **Events Tab**: Chronologische timeline met event types
- **Lineups Tab**: Side-by-side team lineups met formaties
- **Player Status Indicators**:
  - 🟨 Gele kaart indicator
  - 🟥 Rode kaart indicator
  - ⚽ Doelpunt indicator (met 'P' voor penalties)
  - Overlappende kaarten voor 2e gele = rode kaart
  - **Multiple Indicators**: Goals en kaarten kunnen naast elkaar getoond worden
- **Loading States**: Skeleton loading voor content
- **Empty States**: Proper empty states voor alle tabs

### Interactie States

- **Normal**: Default styling
- **Loading**: Skeleton state voor content
- **Error**: Error state met retry knop
- **Empty**: Empty state met CTA
- **Tab Active**: Highlighted active tab
- **Event Press**: Optional event interaction
- **Player Press**: Navigate naar player detail

## ✅ Acceptance Criteria

### Functionele Vereisten

- [ ] Gebruiker kan navigeren naar Match Detail Screen
- [ ] Drie tabs werken correct (Info, Events, Lineups)
- [ ] Info tab toont match informatie, scores, status, details
- [ ] Events tab toont chronologische event timeline
- [ ] Lineups tab toont team formaties en spelers
- [ ] Tab switching werkt soepel
- [ ] Back navigation werkt correct
- [ ] Data wordt gecached voor performance
- [ ] Events worden chronologisch gesorteerd
- [ ] Lineups tonen starting XI en substitutes
- [ ] Coach informatie wordt getoond
- [ ] Speler status indicators tonen kaarten en doelpunten
- [ ] Penalty doelpunten tonen 'P' indicator op bal icoon
- [ ] Overlappende kaarten tonen 2e gele = rode kaart logica
- [ ] Multiple indicators tonen goals en kaarten naast elkaar

### Niet-Functionele Vereisten

- [ ] Scherm laad tijd < 2 seconden
- [ ] Tab switch tijd < 500ms
- [ ] Events loading tijd < 1 seconde
- [ ] Lineups loading tijd < 1 seconde
- [ ] Offline functionaliteit voor cached data
- [ ] Error states voor alle edge cases
- [ ] Loading states voor alle async operaties
- [ ] Performance voor grote event lijsten

### UI Vereisten

- [ ] Responsive design voor verschillende scherm groottes
- [ ] Consistente styling met app theme
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Soepele tab transitions
- [ ] Proper empty states en loading states
- [ ] Scrollbare content voor lange lijsten
- [ ] Intuitive event timeline layout
- [ ] Clear team lineup visualisatie
- [ ] Clear player status indicators (cards, goals)
- [ ] Intuitive penalty goal display
- [ ] Clear overlapping card logic display
- [ ] Clear multiple indicator display (goals + cards)

### Data Vereisten

- [ ] Correcte events data parsing
- [ ] Proper lineups data parsing
- [ ] Data validatie voor corrupte responses
- [ ] Caching strategie voor events/lineups
- [ ] Error handling voor API failures
- [ ] Chronologische event sorting
- [ ] Team lineup data validation
- [ ] Player data validation
- [ ] Player status calculation from events
- [ ] Penalty goal detection logic
- [ ] Card counting and conversion logic
- [ ] Multiple indicator logic (goals + cards combination)

## 🔧 Gebruik Voorbeelden

### Navigatie naar Match Detail

```typescript
// Van MatchCard
onPress={() => navigation.navigate('MatchDetail', {
  fixture: selectedFixture
})}
````

### Tab Navigation Gebruik

```typescript
<TabNavigation
  activeTab={activeTab}
  onTabChange={(tab) => {
    setActiveTab(tab);
    if (tab === "events" && events.length === 0) {
      fetchEvents(fixture.id);
    }
    if (tab === "lineups" && lineups.length === 0) {
      fetchLineups(fixture.id);
    }
  }}
  eventsCount={events.length}
  lineupsCount={lineups.length}
/>
```

### MatchInfo Gebruik

```typescript
<MatchInfo
  fixture={fixture}
  showHalfTimeScore={true}
  showGoals={true}
  showDetails={true}
/>
```

### EventsList Gebruik

```typescript
<EventsList
  events={events}
  isLoading={isLoadingEvents}
  error={eventsError}
  onEventPress={(event) => handleEventPress(event)}
/>
```

### EventItem Gebruik

```typescript
<EventItem
  event={event}
  onPress={() => handleEventPress(event)}
  size="medium"
/>
```

### LineupsGrid Gebruik

```typescript
<LineupsGrid
  lineups={lineups}
  isLoading={isLoadingLineups}
  error={lineupsError}
  onPlayerPress={(player) => navigateToPlayer(player)}
/>
```

### TeamLineup Gebruik

```typescript
<TeamLineup
  lineup={lineup}
  onPlayerPress={(player) => navigateToPlayer(player)}
  showFormation={true}
  showCoach={true}
/>
```

### PlayerRow Gebruik

```typescript
<PlayerRow
  player={player}
  position={player.pos}
  isStarting={true}
  onPress={() => navigateToPlayer(player)}
  showPosition={true}
  showNumber={true}
  playerStatus={calculatePlayerStatus(player.id, events)}
/>
```

### PlayerStatus Gebruik

```typescript
<PlayerStatus
  yellowCards={playerStatus.yellowCards}
  redCards={playerStatus.redCards}
  goals={playerStatus.goals}
  isPenaltyGoal={playerStatus.isPenaltyGoal}
  showOverlapping={playerStatus.showOverlapping}
  showMultiple={playerStatus.showMultiple}
/>
```

### Data Ophalen

```typescript
// API response interfaces
interface EventsApiResponse {
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

interface LineupsApiResponse {
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

// Haal events op voor fixture
const fetchEvents = async (fixtureId: number): Promise<void> => {
  try {
    setLoadingEvents(true);
    setEventsError(null);

    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/events?fixture=${fixtureId}`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: EventsApiResponse = await response.json();

    // Controleer voor API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Valideer en parse events data
    const validatedEvents = validateEvents(data);

    // Sorteer events chronologisch
    const sortedEvents = sortEventsChronologically(validatedEvents);

    setEvents(sortedEvents);
  } catch (error) {
    console.error("Events API error:", error);
    setEventsError(error instanceof Error ? error.message : "Unknown error");
    setEvents([]);
  } finally {
    setLoadingEvents(false);
  }
};

// Haal lineups op voor fixture
const fetchLineups = async (fixtureId: number): Promise<void> => {
  try {
    setLoadingLineups(true);
    setLineupsError(null);

    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/lineups?fixture=${fixtureId}`,
      { headers: API_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LineupsApiResponse = await response.json();

    // Controleer voor API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Valideer en parse lineups data
    const validatedLineups = validateLineups(data);
    setLineups(validatedLineups);
  } catch (error) {
    console.error("Lineups API error:", error);
    setLineupsError(error instanceof Error ? error.message : "Unknown error");
    setLineups([]);
  } finally {
    setLoadingLineups(false);
  }
};

// Validation functions
const validateEvents = (data: EventsApiResponse): Event[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (event) => event && event.time && event.team && event.type
  );
};

const validateLineups = (data: LineupsApiResponse): Lineup[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (lineup) => lineup && lineup.team && lineup.startXI
  );
};

// Sort events chronologically
const sortEventsChronologically = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    const timeA = a.time.elapsed + (a.time.extra || 0);
    const timeB = b.time.elapsed + (b.time.extra || 0);
    return timeA - timeB;
  });
};
```

### Event Type Handling

```typescript
// Event type mapping with penalty support
const getEventIcon = (eventType: string, detail: string): string => {
  switch (eventType) {
    case "Goal":
      return "⚽";
    case "Card":
      return detail.includes("Red") ? "🟥" : "🟨";
    case "subst":
      return "🔄";
    default:
      return "📝";
  }
};

// Enhanced goal icon with penalty indicator
const getGoalIcon = (
  detail: string,
  isPenalty: boolean = false
): React.ReactElement => {
  if (isPenalty) {
    return (
      <View style={styles.goalIconContainer}>
        <Text style={styles.ballIcon}>⚽</Text>
        <Text style={styles.penaltyIndicator}>P</Text>
      </View>
    );
  }
  return <Text style={styles.ballIcon}>⚽</Text>;
};

// Event color mapping
const getEventColor = (eventType: string, detail: string): string => {
  switch (eventType) {
    case "Goal":
      return "#4CAF50";
    case "Card":
      return detail.includes("Red") ? "#F44336" : "#FF9800";
    case "subst":
      return "#2196F3";
    default:
      return "#666";
  }
};

// Check if goal is a penalty
const isPenaltyGoal = (detail: string): boolean => {
  return (
    detail.toLowerCase().includes("penalty") ||
    detail.toLowerCase().includes("pen")
  );
};
```

### Lineup Formation Display

```typescript
// Parse formation string
const parseFormation = (formation: string): number[] => {
  return formation.split("-").map((num) => parseInt(num, 10));
};

// Get player position display
const getPositionDisplay = (position: string): string => {
  const positionMap: Record<string, string> = {
    G: "GK",
    D: "DEF",
    M: "MID",
    F: "FWD",
  };
  return positionMap[position] || position;
};

// Player status calculation from events
const calculatePlayerStatus = (
  playerId: number,
  events: Event[]
): PlayerStatus => {
  const playerEvents = events.filter(
    (event) => event.player?.id === playerId || event.assist?.id === playerId
  );

  let yellowCards = 0;
  let redCards = 0;
  let goals = 0;
  let isPenaltyGoal = false;

  playerEvents.forEach((event) => {
    if (event.type === "Card") {
      if (event.detail.includes("Yellow")) {
        yellowCards++;
      } else if (event.detail.includes("Red")) {
        redCards++;
      }
    } else if (event.type === "Goal") {
      goals++;
      if (event.detail.toLowerCase().includes("penalty")) {
        isPenaltyGoal = true;
      }
    }
  });

  // Handle second yellow = red card logic
  if (yellowCards >= 2) {
    redCards = Math.max(redCards, 1);
    yellowCards = 0; // Reset yellow cards when converted to red
  }

  return {
    yellowCards,
    redCards,
    goals,
    isPenaltyGoal,
    showOverlapping: yellowCards > 0 && redCards > 0,
    showMultiple:
      (goals > 0 && (yellowCards > 0 || redCards > 0)) ||
      (yellowCards > 0 && redCards > 0),
  };
};
```

## 🎉 Implementatie Status

### 📋 Planning

- **Match Detail Screen**: Basis screen structuur met tabs
- **Info Tab**: Match informatie weergave
- **Events Tab**: Events timeline implementatie
- **Lineups Tab**: Team lineups grid layout
- **API Services**: Events en Lineups API integratie
- **State Management**: Tab state management
- **Error Handling**: Comprehensive error handling
- **Performance**: Optimisatie voor grote datasets

### 🔧 Volgende Stappen

1. **Screen Setup**: Basis MatchDetailScreen met tab navigatie
2. **Info Tab**: MatchInfo component implementatie
3. **Events Tab**: EventsList en EventItem componenten
4. **Lineups Tab**: LineupsGrid en TeamLineup componenten
5. **API Integration**: Events en Lineups services
6. **State Management**: Context setup voor tab management
7. **Testing**: Comprehensive testing van alle tabs
8. **Performance**: Optimalisatie en caching

De Match Detail Screen feature is gepland en klaar voor implementatie! 🚀
