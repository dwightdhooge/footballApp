# Project Structure

## 🎯 Overview

Deze document beschrijft de hoofdstructuur van de React Native Soccer App. De structuur volgt React Native + Expo best practices met TypeScript en is georganiseerd per platform (mobile/web) met shared core logic.

## 🏗 Main Structure

```
pro-soccer-app/
├── App.tsx                    # App entry point (platform detection)
├── app.json                   # Expo configuration
├── package.json               # Dependencies en scripts
├── tsconfig.json              # TypeScript configuration
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler config
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
│
├── src/                       # Source code
│   ├── platforms/             # Platform-specific implementations
│   │   ├── mobile/            # Mobile platform (iOS/Android)
│   │   │   ├── App.tsx        # Mobile app entry point
│   │   │   ├── components/    # Mobile-specific components
│   │   │   │   ├── common/    # Common mobile components
│   │   │   │   ├── country/   # Country-related components
│   │   │   │   ├── cup/       # Cup-related components
│   │   │   │   ├── favorites/ # Favorites components
│   │   │   │   ├── homescreen/# Homescreen components
│   │   │   │   ├── league/    # League components
│   │   │   │   ├── match/     # Match components
│   │   │   │   ├── player/    # Player components
│   │   │   │   ├── settings/  # Settings components
│   │   │   │   ├── team/      # Team components
│   │   │   │   └── utility/   # Utility components
│   │   │   ├── screens/       # Mobile screen implementations
│   │   │   │   ├── favorites/ # Favorites screens
│   │   │   │   ├── scores/    # Scores tab screens
│   │   │   │   └── settings/  # Settings screens
│   │   │   └── navigation/    # Mobile navigation setup
│   │   │       ├── bottom-tabs/# Bottom tabs navigatie
│   │   │       └── stacks/    # Stack navigatie per tab
│   │   └── web/               # Web platform
│   │       ├── App.tsx        # Web app entry point
│   │       ├── components/    # Web-specific components
│   │       │   ├── cards/     # Web card components
│   │       │   ├── CategoryTabs.tsx # Web favorites tabs
│   │       │   ├── SearchBar.tsx    # Web search component
│   │       │   └── SearchResults.tsx# Web search results
│   │       ├── context/       # Web-specific context providers
│   │       │   ├── WebSettingsProvider.tsx
│   │       │   └── WebThemeProvider.tsx
│   │       └── pages/         # Web page implementations
│   │           ├── HomePage.tsx
│   │           └── SettingsScreen.tsx
│   ├── shared/                # Shared resources
│   │   ├── i18n/              # Internationalisatie
│   │   │   ├── i18n.ts        # i18n configuration
│   │   │   └── translations/  # Translation files
│   │   │       ├── en.json    # English translations
│   │   │       ├── fr-BE.json # French (Belgium) translations
│   │   │       └── nl-BE.json # Dutch (Belgium) translations
│   │   └── styles/            # Shared styling en theming
│   │       └── theme.ts       # App theme configuration
│   └── core/                  # Shared core logic
│       ├── context/           # Shared state management
│       │   ├── DebugContext.tsx
│       │   ├── FavoritesContext.tsx
│       │   ├── SearchContext.tsx
│       │   ├── SettingsContext.tsx
│       │   ├── ThemeContext.tsx
│       │   └── index.ts       # Context exports
│       ├── hooks/             # Custom React hooks
│       │   ├── useCountryData.ts
│       │   ├── useCupData.ts
│       │   ├── useFixtureStatistics.ts
│       │   ├── useImageCache.ts
│       │   ├── useLeagueData.ts
│       │   ├── useMatchData.ts
│       │   ├── usePlayerData.ts
│       │   ├── useSvgCache.ts
│       │   ├── useTeamData.ts
│       │   └── index.ts       # Hooks exports
│       ├── services/          # API calls en data handling
│       │   ├── api/           # API integratie
│       │   │   ├── config.ts  # API configuratie
│       │   │   ├── countries.ts
│       │   │   ├── events.ts
│       │   │   ├── fixtures.ts
│       │   │   ├── leagues.ts
│       │   │   ├── lineups.ts
│       │   │   ├── players.ts
│       │   │   ├── rounds.ts
│       │   │   ├── standings.ts
│       │   │   ├── statistics.ts
│       │   │   ├── svg.ts
│       │   │   ├── teams.ts
│       │   │   └── index.ts   # API exports
│       │   ├── cache/         # Caching utilities
│       │   │   ├── deduplication.ts
│       │   │   ├── storage.ts
│       │   │   ├── utils.ts
│       │   │   └── index.ts   # Cache exports
│       │   ├── storage/       # Local storage utilities
│       │   │   ├── favorites.ts
│       │   │   ├── imageCache.ts
│       │   │   ├── svgCache.ts
│       │   │   └── index.ts   # Storage exports
│       │   └── index.ts       # Services exports
│       ├── types/             # TypeScript type definities
│       │   ├── api.ts         # API response types
│       │   ├── components.ts  # Component prop types
│       │   ├── navigation.ts  # Navigation types
│       │   ├── common.ts      # Algemene types
│       │   └── index.ts       # Types exports
│       ├── utils/             # Helper functies
│       │   ├── constants/     # App constanten
│       │   │   ├── api.ts     # API constants
│       │   │   ├── app.ts     # App constants
│       │   │   ├── cache.ts   # Cache constants
│       │   │   ├── constants.ts# General constants
│       │   │   └── index.ts   # Constants exports
│       │   ├── eventUtils.ts  # Event handling utilities
│       │   ├── helpers.ts     # Algemene helpers
│       │   ├── matchUtils.ts  # Match-related utilities
│       │   └── index.ts       # Utils exports
│       └── index.ts           # Core exports
│
├── assets/                    # Statische assets
│   ├── adaptive-icon.png      # Adaptive icon
│   ├── favicon.png            # Favicon
│   ├── icon.png               # App icon
│   └── splash-icon.png        # Splash screen icon
│
├── docs/                      # Project documentatie
│   ├── features/              # Feature specificaties
│   │   ├── country-detail-screen.md
│   │   ├── cup-detail-screen.md
│   │   ├── favorites-system.md
│   │   ├── favorites-tab.md
│   │   ├── homescreen.md
│   │   ├── league-detail-screen.md
│   │   ├── match-detail-screen.md
│   │   ├── player-detail-screen.md
│   │   ├── settings-screen.md
│   │   ├── suggested-countries.md
│   │   └── svg-caching.md
│   └── general/               # Algemene documentatie
│       ├── app-overview.md    # App overzicht
│       ├── components.md      # Component specificaties
│       ├── navigation.md      # Navigatie structuur
│       ├── api-integration.md # API integratie
│       ├── project-structure.md # Project structuur
│       └── i18n-setup.md     # Internationalisatie setup
│
└── index.js                   # Entry point voor Expo
```

## 📁 Directory Explanations

### `/src/platforms/`

Platform-specific implementations gescheiden van shared core logic.

#### `/src/platforms/mobile/`

React Native mobile implementatie voor iOS en Android.

- **`components/`**: Mobile-specific componenten georganiseerd per feature
- **`screens/`**: Mobile screen implementaties per tab
- **`navigation/`**: React Navigation setup met bottom tabs en stacks
- **`App.tsx`**: Mobile app entry point met providers

#### `/src/platforms/web/`

Web platform implementatie met responsive design.

- **`components/`**: Web-optimized componenten
- **`pages/`**: Web page implementaties
- **`context/`**: Web-specific theme en settings providers
- **`App.tsx`**: Web app entry point met web-specific providers

### `/src/shared/`

Resources die gedeeld worden tussen platforms.

- **`i18n/`**: Internationalisatie setup met automatische taalherkenning
- **`styles/`**: Shared styling en theming configuratie

### `/src/core/`

Gedeelde business logic en utilities.

- **`context/`**: React Context providers voor state management
- **`hooks/`**: Custom React hooks voor herbruikbare logica
- **`services/`**: API integratie en storage utilities
- **`types/`**: TypeScript type definities
- **`utils/`**: Helper functies en constants

## 🔧 Configuration Files

### `App.tsx`

Platform detection en routing naar juiste platform implementation.

### `app.json`

Expo configuratie met app metadata, permissions, en build settings.

### `package.json`

Dependencies, scripts, en project metadata.

### `tsconfig.json`

TypeScript configuratie met strict mode en path mapping.

### `babel.config.js`

Babel configuratie voor React Native en Expo.

### `metro.config.js`

Metro bundler configuratie voor asset handling.

### `.env`

Environment variables voor API keys en configuratie.

## 🎯 Key Principles

### Platform-Based Organization

- Code georganiseerd per platform (mobile/web)
- Shared business logic in `/core/`
- Platform-specific UI in `/platforms/[platform]/`

### Type Safety

- Alle code heeft TypeScript types
- Types gecentraliseerd in `/core/types/`
- Strict TypeScript configuratie

### Separation of Concerns

- UI componenten gescheiden van business logic
- API calls in `/core/services/`
- State management in `/core/context/`

### Maintainability

- Duidelijke directory structuur
- Consistent naming conventions
- Documentatie bij elke feature

### Scalability

- Modulaire architectuur
- Herbruikbare componenten
- Extensible service layer

## 📱 Platform Considerations

### React Native + Expo

- Expo managed workflow
- Cross-platform compatibility
- Native performance optimizations

### TypeScript

- Strict type checking
- Better developer experience
- Compile-time error detection

### Navigation

- React Navigation v6 (mobile)
- Web routing (web)
- Type-safe navigation
- Deep linking support

### State Management

- React Context API
- Local storage persistence
- Offline support

## ✅ Benefits

### Development

- **Clear Structure**: Easy to find and place code
- **Type Safety**: Compile-time error detection
- **Reusability**: Shared components and utilities
- **Maintainability**: Well-organized codebase
- **Platform Separation**: Clear boundaries between platforms

### Quality

- **Testability**: Modular structure supports testing
- **Consistency**: Standardized patterns
- **Documentation**: Living documentation in `/docs/`
- **Cross-Platform**: Shared logic reduces duplication

### Performance

- **Lazy Loading**: Screens loaded on demand
- **Asset Optimization**: Efficient asset handling
- **Memory Management**: Proper cleanup and caching
- **Platform Optimization**: Platform-specific rendering

### Team Collaboration

- **Clear Ownership**: Feature-based organization
- **Code Reviews**: Easy to review and understand
- **Onboarding**: Clear structure for new developers
- **Platform Expertise**: Developers can focus on specific platforms

## 🔄 Future-Proof Design

### Extensibility

- **New Features**: Easy to add new screens and components
- **New APIs**: Simple to add new service endpoints
- **New Contexts**: Straightforward to add new state management
- **New Types**: Centralized type system supports growth
- **New Platforms**: Easy to add new platform implementations

### Flexibility

- **Generic Structure**: Works for any React Native app
- **Scalable Patterns**: Established patterns for growth
- **Modular Design**: Easy to refactor and reorganize
- **Clear Conventions**: Consistent naming and organization
- **Platform Independence**: Core logic independent of UI layer

### Cross-Platform Strategy

- **Shared Business Logic**: Single source of truth for core functionality
- **Platform-Specific UI**: Optimized rendering per platform
- **Conditional Imports**: Platform-specific code loading
- **Unified API**: Consistent interface across platforms
- **Testing Strategy**: Platform-specific test suites

## 🔗 Related Documentation

- [App Overview](app-overview.md) - Algemene app informatie
- [Components](components.md) - Herbruikbare componenten
- [Navigation](navigation.md) - Navigatie structuur
- [API Integration](api-integration.md) - API integratie
- [i18n Setup](i18n-setup.md) - Internationalisatie setup
