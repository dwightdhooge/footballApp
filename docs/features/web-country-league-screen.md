# Web Country & League Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Overzicht** van alle competities en cups per land in een web interface
- **Snelle navigatie** tussen leagues en cups via linkersidebar
- **Twee-kolommen layout** voor standings en matches
- **Seizoen en ronde selectie** voor verschillende competities
- **Responsive design** voor desktop, tablet en mobile

### User Stories

1. **Als voetbalfan** wil ik alle competities van een land kunnen bekijken in een overzichtelijke web interface
2. **Als gebruiker** wil ik snel kunnen wisselen tussen verschillende leagues en cups
3. **Als gebruiker** wil ik standings en matches tegelijk kunnen bekijken
4. **Als gebruiker** wil ik verschillende seizoenen en rondes kunnen selecteren
5. **Als gebruiker** wil ik een consistente ervaring hebben op alle apparaten

## 🏗 Technical Implementation

### Componenten Structuur

```
WebCountryDetailScreen/
├── CountrySidebar/           # Linkersidebar met leagues/cups
│   ├── LeagueCupList/        # Lijst van beschikbare competities
│   └── LeagueCupItem/        # Individuele league/cup items
├── MainContentArea/          # Hoofdinhoud gebied
│   ├── ContentHeader/        # Titel en seizoen/ronde selectie
│   │   ├── SeasonDropdown/   # Seizoen dropdown
│   │   └── RoundDropdown/    # Ronde dropdown (alleen voor cups)
│   ├── StandingsColumn/      # Linkerkolom met standings
│   └── MatchesColumn/        # Rechterkolom met matches
└── ResponsiveLayout/         # Responsive layout management
```

### Navigation Flow

1. **CountryCard Tap** → Navigate naar WebCountryDetailScreen
2. **Screen Load** → Fetch leagues/cups data voor land
3. **Auto-selection** → Eerste league automatisch geselecteerd
4. **Sidebar Navigation** → User kan wisselen tussen leagues/cups
5. **Content Update** → Standings en matches worden getoond

### API Endpoints

- `GET /leagues?code={countryCode}` - Alle leagues/cups voor land
- **Rate Limit**: 100 requests/day (free tier)
- **Caching**: Gebruik bestaande `useCountryData`, `useLeagueData`, `useCupData` hooks

### Data Flow

```typescript
// 1. Country Selection → Fetch leagues/cups
useCountryData(countryCode: string)

// 2. League/Cup Selection → Initialize data hooks
useLeagueData(leagueId, seasons, initialSeason, selectedRound)
useCupData(cupId, seasons, initialSeason)

// 3. Season Change → Refresh all data
// 4. Round Change → Update fixtures only
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege leagues/cups**: Empty state voor beide secties
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Invalid league data**: Data validation en filtering
- **Mixed league types**: Correcte categorisering
- **Missing logos**: Fallback naar placeholder
- **Responsive breakpoints**: Correcte layout op alle schermformaten

### Performance Optimizations

- **Lazy Loading**: Alleen zichtbare leagues laden
- **Image Caching**: League logos cachen
- **Data Caching**: Leagues data cachen per land
- **Request Deduplication**: Voorkom multiple simultaneous API calls
- **Smart Caching**: Verschillende TTL voor verschillende data types
- **Virtual Scrolling**: Voor grote standings tables

### Error Handling

- **API Errors**: Basis error handling met console logging
- **Network Timeout**: HTTP status error handling
- **Invalid Data**: API response validation
- **Rate Limit**: HTTP status code handling
- **Data Processing Errors**: Try-catch blocks voor runtime errors
- **User Feedback**: Alert dialogs voor belangrijke errors
- **Refresh Retry**: Pull-to-refresh voor retry functionaliteit

## 📱 UI/UX Specifications

### Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Country Detail Screen                │
├─────────────────────┬───────────────────────────────────────┤
│   Left Sidebar      │           Main Content Area          │
│   (280px width)     │                                       │
│                     │  ┌─────────────────────────────────┐  │
│ ┌─────────────────┐ │  │        Content Header           │  │
│ │   Competitions  │ │  │  Title + Season + Round        │  │
│ │                 │ │  └─────────────────────────────────┘  │
│ │ ┌─────────────┐ │ │  ┌─────────────┬─────────────────┐  │
│ │ │   Leagues   │ │ │  │ Standings  │     Matches     │  │
│ │ │             │ │ │  │   Column   │     Column      │  │
│ │ │ [League1]   │ │ │  │             │                 │  │
│ │ │ [League2]   │ │ │  │ ┌─────────┐ │ ┌─────────────┐ │  │
│ │ │             │ │ │  │ │Standings│ │ │  Matches   │ │  │
│ │ └─────────────┘ │ │  │ │  Table  │ │ │    List    │ │  │
│ │                 │ │  │ └─────────┘ │ └─────────────┘ │  │
│ │ ┌─────────────┐ │ │  └─────────────┴─────────────────┘  │
│ │ │    Cups     │ │ │                                       │
│ │ │             │ │ │                                       │
│ │ │ [Cup1]      │ │ │                                       │
│ │ │ [Cup2]      │ │ │                                       │
│ │ └─────────────┘ │ │                                       │
│ └─────────────────┘ │                                       │
└─────────────────────┴───────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px)**: Full two-column layout (sidebar + main content)
- **Tablet (768px-1023px)**: Collapsible sidebar met overlay
- **Mobile (<768px)**: Stacked layout met bottom navigation

### Visual Design

- **Sidebar**: Fixed width (280px), subtle borders, active state highlighting
- **League/Cup Items**: Logo, name, type badge (League/Cup), country name
- **Content Header**: Large title, subtitle, season/round dropdowns
- **Two Columns**: Equal width columns met 16px gap
- **Spacing**: Consistent 16px padding, 12px tussen items
- **Background**: Subtle background colors voor sections

### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.7 activeOpacity)
- **Loading**: Skeleton state met placeholder content
- **Error**: Error state met retry options
- **Empty**: Empty state met dynamische titel
- **Selected**: Active sidebar item highlighting

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Gebruiker kan navigeren naar Web Country Detail Screen
- [ ] Leagues en cups worden correct geladen voor land
- [ ] Eerste league wordt automatisch geselecteerd
- [ ] Gebruiker kan wisselen tussen leagues en cups via sidebar
- [ ] Standings worden getoond in linkerkolom
- [ ] Matches worden getoond in rechterkolom
- [ ] Seizoen dropdown werkt voor alle competities
- [ ] Ronde dropdown werkt alleen voor cups
- [ ] Content blijft gesynchroniseerd met sidebar selectie

### Non-Functional Requirements

- [ ] Screen load time < 2 seconden
- [ ] API response time < 3 seconden
- [ ] Offline functionaliteit voor cached data
- [ ] Error states voor alle edge cases
- [ ] Loading states voor alle async operaties
- [ ] Smooth transitions tussen leagues/cups

### UI Requirements

- [ ] Responsive design voor desktop, tablet en mobile
- [ ] Consistent styling met app theme
- [ ] Accessibility support (WCAG AA compliance)
- [ ] Dark/Light mode support
- [ ] Smooth sidebar navigation
- [ ] Proper empty states en loading states

### Data Requirements

- [ ] Correcte API response parsing
- [ ] Proper league/cup categorisering
- [ ] Data validation voor corrupte responses
- [ ] Caching strategie voor leagues data
- [ ] Error handling voor API failures
- [ ] Seizoen en ronde management

## 🔧 Implementation Details

### 1. Main Screen Component

```typescript
// src/platforms/web/components/WebCountryDetailScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useWebTheme } from "../context/WebThemeProvider";
import { CountrySidebar } from "./CountrySidebar";
import { MainContentArea } from "./MainContentArea";
import { useCountryData } from "@/core/hooks/useCountryData";
import { League } from "@/core/types/api";

interface WebCountryDetailScreenProps {
  countryCode: string;
  countryName: string;
}

export const WebCountryDetailScreen: React.FC<WebCountryDetailScreenProps> = ({
  countryCode,
  countryName,
}) => {
  const { theme } = useWebTheme();
  const { leagues, cups, isLoading, error } = useCountryData(countryCode);

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedCup, setSelectedCup] = useState<League | null>(null);
  const [isLeagueView, setIsLeagueView] = useState(true);

  // Auto-select first league on mount
  useEffect(() => {
    if (leagues.length > 0 && !selectedLeague) {
      setSelectedLeague(leagues[0]);
      setIsLeagueView(true);
    }
  }, [leagues]);

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    setSelectedCup(null);
    setIsLeagueView(true);
  };

  const handleCupSelect = (cup: League) => {
    setSelectedCup(cup);
    setSelectedLeague(null);
    setIsLeagueView(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <View style={styles.container}>
      <CountrySidebar
        leagues={leagues}
        cups={cups}
        selectedLeague={selectedLeague}
        selectedCup={selectedCup}
        onLeagueSelect={handleLeagueSelect}
        onCupSelect={handleCupSelect}
      />
      <MainContentArea
        selectedLeague={selectedLeague}
        selectedCup={selectedCup}
        isLeagueView={isLeagueView}
        countryCode={countryCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.background,
  },
});
```

### 2. Country Sidebar Component

```typescript
// src/platforms/web/components/CountrySidebar.tsx
export const CountrySidebar: React.FC<CountrySidebarProps> = ({
  leagues,
  cups,
  selectedLeague,
  selectedCup,
  onLeagueSelect,
  onCupSelect,
}) => {
  const { theme } = useWebTheme();

  const isSelected = (item: League) => {
    if (item.league.type === "League") {
      return selectedLeague?.league.id === item.league.id;
    } else {
      return selectedCup?.league.id === item.league.id;
    }
  };

  const handleSelect = (item: League) => {
    if (item.league.type === "League") {
      onLeagueSelect(item);
    } else {
      onCupSelect(item);
    }
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.title}>Competitions</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Leagues Section */}
        {leagues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leagues</Text>
            {leagues.map((league) => (
              <LeagueCupItem
                key={league.league.id}
                item={league}
                isSelected={isSelected(league)}
                onSelect={() => handleSelect(league)}
              />
            ))}
          </View>
        )}

        {/* Cups Section */}
        {cups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cups</Text>
            {cups.map((cup) => (
              <LeagueCupItem
                key={cup.league.id}
                item={cup}
                isSelected={isSelected(cup)}
                onSelect={() => handleSelect(cup)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
```

### 3. Main Content Area Component

```typescript
// src/platforms/web/components/MainContentArea.tsx
export const MainContentArea: React.FC<MainContentAreaProps> = ({
  selectedLeague,
  selectedCup,
  isLeagueView,
  countryCode,
}) => {
  const { theme } = useWebTheme();
  const selectedItem = isLeagueView ? selectedLeague : selectedCup;

  if (!selectedItem) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <ContentHeader
        selectedItem={selectedItem}
        isLeagueView={isLeagueView}
        countryCode={countryCode}
      />

      <View style={styles.content}>
        <StandingsColumn
          selectedItem={selectedItem}
          isLeagueView={isLeagueView}
          countryCode={countryCode}
        />
        <MatchesColumn
          selectedItem={selectedItem}
          isLeagueView={isLeagueView}
          countryCode={countryCode}
        />
      </View>
    </View>
  );
};
```

### 4. Custom Hook Integration

```typescript
// src/platforms/web/hooks/useWebCountryDetail.ts
export const useWebCountryDetail = (
  countryCode: string
): UseWebCountryDetailReturn => {
  const { leagues, cups, isLoading, error, refresh } = useCountryData(
    countryCode
  );

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedCup, setSelectedCup] = useState<League | null>(null);
  const [isLeagueView, setIsLeagueView] = useState(true);

  // Auto-select first league
  useEffect(() => {
    if (leagues.length > 0 && !selectedLeague && !selectedCup) {
      setSelectedLeague(leagues[0]);
      setIsLeagueView(true);
    }
  }, [leagues]);

  // Initialize league data hook when league is selected
  const leagueData = selectedLeague
    ? useLeagueData(
        selectedLeague.league.id,
        selectedLeague.seasons,
        selectedLeague.seasons.find((s) => s.current) ||
          selectedLeague.seasons[0]
      )
    : null;

  // Initialize cup data hook when cup is selected
  const cupData = selectedCup
    ? useCupData(
        selectedCup.league.id,
        selectedCup.seasons,
        selectedCup.seasons.find((s) => s.current) || selectedCup.seasons[0]
      )
    : null;

  return {
    leagues,
    cups,
    isLoading,
    error,
    selectedLeague,
    selectedCup,
    isLeagueView,
    leagueData,
    cupData,
    selectLeague,
    selectCup,
    refreshData,
  };
};
```

## 🚀 Implementation Phases

### Phase 1: Basic Structure

- Create `WebCountryDetailScreen` component
- Implement left sidebar met leagues/cups list
- Basic layout structure

### Phase 2: Data Integration

- Integrate `useCountryData` voor sidebar
- Implement league/cup selection logic
- Basic content area structure

### Phase 3: League View

- Integrate `useLeagueData` voor standings
- Implement season selection
- Display standings in left column

### Phase 4: Matches & Rounds

- Add matches column met round selection
- Integrate fixtures display
- Complete league view functionality

### Phase 5: Cup View

- Integrate `useCupData` voor cup competitions
- Implement cup-specific round selection
- Handle league vs cup view switching

### Phase 6: Polish & Optimization

- Responsive design implementation
- Loading and error states
- Performance optimization
- Accessibility improvements

## 🔧 Usage Examples

### Navigation to Web Country Detail

```typescript
// From CountryCard in SearchResults
const handleCountryPress = (countryCode: string) => {
  router.push(`/country/${countryCode}`);
};

// In CountryCard
<CountryCard
  key={country.code}
  {...country}
  onPress={() => handleCountryPress(country.code)}
/>;
```

### League/Cup Selection

```typescript
// In CountrySidebar
const handleSelect = (item: League) => {
  if (item.league.type === "League") {
    onLeagueSelect(item);
  } else {
    onCupSelect(item);
  }
};

// League/Cup Item
<LeagueCupItem
  key={item.league.id}
  item={item}
  isSelected={isSelected(item)}
  onSelect={() => handleSelect(item)}
/>;
```

### Season and Round Selection

```typescript
// In ContentHeader
<View style={styles.controls}>
  <SeasonDropdown selectedItem={selectedItem} countryCode={countryCode} />
  {!isLeagueView && (
    <RoundDropdown selectedItem={selectedItem} countryCode={countryCode} />
  )}
</View>
```

## 📊 Success Metrics

### User Experience

- **Navigation Speed**: Time to navigate between leagues
- **Content Load Time**: Time to display standings/matches
- **User Engagement**: Time spent on league detail pages

### Technical Performance

- **API Response Time**: Average response time for data
- **Cache Hit Rate**: Percentage of requests served from cache
- **Bundle Size**: Web bundle size optimization

### Accessibility

- **WCAG Compliance**: Meet AA standards
- **Screen Reader Compatibility**: Full navigation support
- **Keyboard Navigation**: Complete keyboard accessibility

This comprehensive documentation provides everything needed to implement the web country & league screen feature, maintaining consistency with the existing mobile app architecture while providing a rich web experience.
