# Soccer App - App Overview

## 🎯 Product Vision

Een React Native Expo app die voetbalfans toegang geeft tot real-time voetbaldata via de API-Football API. De app focust op eenvoudige navigatie per land met persoonlijke favorieten functionaliteit, ondersteund door een cross-platform architectuur.

### Gebruikersdoelen

- **Snelle toegang** tot voetbaldata per land
- **Persoonlijke favorieten** beheren
- **Real-time updates** van wedstrijden en scores
- **Intuïtieve interface** voor voetbalfans van alle niveaus
- **Cross-platform ervaring** tussen mobile en web

### Kernfunctionaliteiten

1. **Homescreen** met landen zoeken en favorieten
2. **Land-specifieke data** (wedstrijden, teams, spelers)
3. **Favorieten systeem** voor persoonlijke landen
4. **Real-time updates** van live wedstrijden
5. **Platform-specifieke optimalisaties** voor mobile en web

## 🏗 Technical Architecture

### Tech Stack

- **Framework**: React Native met Expo (managed workflow)
- **Platforms**: Mobile (iOS/Android) + Web
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React Context API
- **API**: API-Football v3
- **Styling**: React Native StyleSheet met getStyles pattern
- **TypeScript**: Voor type safety en betere developer experience
- **Cross-Platform**: Shared business logic, platform-specific UI

### App Structuur

```typescript
// App structure with TypeScript
interface AppStructure {
  src: {
    platforms: {
      mobile: {
        components: string; // Mobile-specific componenten
        screens: string; // Mobile screen implementaties
        navigation: string; // Mobile navigation setup
        App: string; // Mobile app entry point
      };
      web: {
        components: string; // Web-specific componenten
        pages: string; // Web page implementaties
        context: string; // Web-specific context providers
        App: string; // Web app entry point
      };
    };
    shared: {
      i18n: string; // Internationalisatie
      styles: string; // Shared styling en theming
    };
    core: {
      context: string; // Shared state management
      hooks: string; // Custom hooks
      services: string; // API calls en data handling
      types: string; // TypeScript types
      utils: string; // Helper functies
    };
  };
}

// TypeScript configuration
interface TypeScriptConfig {
  strict: boolean;
  noImplicitAny: boolean;
  strictNullChecks: boolean;
  strictFunctionTypes: boolean;
  noImplicitReturns: boolean;
  noFallthroughCasesInSwitch: boolean;
}
```

### Platform Architecture

#### Mobile Platform (`/src/platforms/mobile/`)

- **Components**: React Native componenten met platform-specific styling
- **Screens**: Mobile-optimized screen layouts
- **Navigation**: React Navigation met bottom tabs en stack navigators
- **App.tsx**: Mobile app entry point met providers

#### Web Platform (`/src/platforms/web/`)

- **Components**: Web-optimized componenten met responsive design
- **Pages**: Web page implementaties
- **Context**: Web-specific theme en settings providers
- **App.tsx**: Web app entry point met web-specific providers

#### Shared Core (`/src/core/`)

- **Context**: FavoritesContext, SettingsContext, ThemeContext
- **Hooks**: Custom hooks voor API calls en data management
- **Services**: API integratie en storage utilities
- **Types**: TypeScript interfaces en types
- **Utils**: Helper functies en constants

### API Integratie

- **Base URL**: https://v3.football.api-sports.io/
- **Authentication**: x-apisports-key
- **Rate Limiting**: 100 requests/day (free tier)
- **Endpoints**: Countries, Leagues, Teams, Matches
- **Type Safety**: TypeScript interfaces voor alle API responses
- **Caching**: Deduplication en storage caching

### Performance Considerations

- **Lazy Loading**: Landen data alleen laden wanneer nodig
- **Caching**: Favorieten lokaal opslaan, API response caching
- **Offline Support**: Basis functionaliteit zonder internet
- **Image Optimization**: Vlaggen optimaliseren voor mobile en web
- **Type Checking**: Compile-time error detection
- **Platform Optimization**: Platform-specific rendering optimalisaties

### Error Handling

- **API Errors**: Graceful degradation bij API downtime
- **Network Issues**: Offline mode met cached data
- **User Feedback**: Loading states en error messages
- **Type Errors**: TypeScript compile-time error detection
- **Runtime Errors**: Try-catch blocks voor runtime errors
- **Platform Errors**: Platform-specific error handling

### Navigation Flow

#### Mobile Platform

```typescript
// Navigation types
interface NavigationParams {
  item: Country | League | Cup;
}

interface NavigationState {
  index: number;
  routes: Array<{
    name: string;
    params?: NavigationParams;
  }>;
}

// Navigation flow types
type ScoresTabFlow = {
  Homescreen: undefined;
  CountryDetail: { item: Country };
  LeagueDetail: { item: League };
  CupDetail: { item: Cup };
  MatchDetail: { item: Fixture };
  TeamDetail: { item: Team };
  PlayerDetail: { item: Player };
};

type SettingsTabFlow = {
  Settings: undefined;
};

type FavoritesTabFlow = {
  FavoritesHome: undefined;
};

type DebugTabFlow = {
  Debug: undefined;
};
```

#### Web Platform

```typescript
// Web navigation types
interface WebNavigationState {
  currentPage: string;
  params?: Record<string, any>;
}

type WebPageFlow = {
  Home: undefined;
  CountryDetail: { item: Country };
  LeagueDetail: { item: League };
  CupDetail: { item: Cup };
  MatchDetail: { item: Fixture };
  TeamDetail: { item: Team };
  PlayerDetail: { item: Player };
  Settings: undefined;
};
```

### Theming & Styling

#### getStyles Pattern

```typescript
// Theme configuration
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// getStyles pattern
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
  });
```

#### Platform-Specific Theming

- **Mobile**: React Native StyleSheet met platform-specific properties
- **Web**: CSS-in-JS met responsive design considerations
- **Shared**: Common theme structure en color schemes
- **Dynamic**: Dark/light mode support met auto-detection

### TypeScript Benefits

- **Type Safety**: Compile-time error detection
- **Better IDE Support**: IntelliSense en autocomplete
- **Refactoring**: Safe refactoring met type checking
- **Documentation**: Types serve as documentation
- **Runtime Safety**: Reduced runtime errors
- **Team Collaboration**: Better code understanding
- **Platform Safety**: Platform-specific type checking

### Cross-Platform Considerations

#### Shared Logic

- **Business Logic**: API calls, data processing, state management
- **Types**: Common TypeScript interfaces
- **Utils**: Helper functies en constants
- **i18n**: Internationalisatie setup

#### Platform-Specific Implementation

- **UI Components**: Platform-optimized rendering
- **Navigation**: Platform-specific navigation patterns
- **Styling**: Platform-specific styling approaches
- **Performance**: Platform-specific optimizations

#### Code Sharing Strategy

- **Monorepo Structure**: Single source of truth
- **Conditional Imports**: Platform-specific imports
- **Shared Interfaces**: Common contracts between platforms
- **Testing**: Platform-specific test suites
