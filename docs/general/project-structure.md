# Project Structure

## 🎯 Overview

Deze document beschrijft de hoofdstructuur van de React Native Soccer App. De structuur volgt React Native + Expo best practices met TypeScript en is georganiseerd per feature/domain.

## 🏗 Main Structure

```
convoApp/
├── App.tsx                    # App entry point
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
│   ├── components/            # Herbruikbare UI componenten
│   │   ├── [ComponentName]/   # Component directories
│   │   └── ...               # Additional components
│   │
│   ├── screens/               # App schermen
│   │   ├── [TabName]/         # Tab-specific screens
│   │   │   ├── [ScreenName]/  # Individual screen directories
│   │   │   └── ...           # Additional screens
│   │   └── ...               # Additional tabs
│   │
│   ├── navigation/            # Navigatie configuratie
│   │   ├── bottom-tabs/       # Bottom tabs navigatie
│   │   ├── stacks/            # Stack navigatie per tab
│   │   └── ...               # Additional navigation types
│   │
│   ├── services/              # API calls en data handling
│   │   ├── api/               # API integratie
│   │   │   ├── config.ts      # API configuratie
│   │   │   ├── [EndpointName].ts # API endpoint files
│   │   │   └── ...           # Additional endpoints
│   │   ├── storage/           # Local storage utilities
│   │   │   ├── [StorageName].ts # Storage utility files
│   │   │   └── ...           # Additional storage utilities
│   │   └── ...               # Additional service types
│   │
│   ├── context/               # State management
│   │   ├── [ContextName].tsx  # Context provider files
│   │   └── ...               # Additional contexts
│   │
│   ├── types/                 # TypeScript type definities
│   │   ├── api.ts             # API response types
│   │   ├── navigation.ts      # Navigation types
│   │   ├── components.ts      # Component prop types
│   │   ├── common.ts          # Algemene types
│   │   └── ...               # Additional type files
│   │
│   ├── utils/                 # Helper functies
│   │   ├── validation.ts      # Data validatie
│   │   ├── formatting.ts      # Data formatting
│   │   ├── constants.ts       # App constanten
│   │   ├── helpers.ts         # Algemene helpers
│   │   └── ...               # Additional utility files
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use[HookName].ts   # Custom hook files
│   │   └── ...               # Additional hooks
│   │
│   └── styles/                # Styling en theming
│       ├── theme.ts           # App theme configuratie
│       ├── colors.ts          # Kleur definities
│       ├── typography.ts      # Typography styles
│       ├── spacing.ts         # Spacing utilities
│       └── ...               # Additional style files
│
├── assets/                    # Statische assets
│   ├── images/                # Afbeeldingen
│   │   ├── icons/             # App iconen
│   │   ├── placeholders/      # Placeholder afbeeldingen
│   │   └── ...               # Additional image categories
│   ├── fonts/                 # Custom fonts
│   ├── splash/                # Splash screen assets
│   └── ...                   # Additional asset types
│
├── docs/                      # Project documentatie
│   ├── features/              # Feature specificaties
│   │   ├── [feature-name].md  # Feature documentation files
│   │   └── ...               # Additional features
│   └── general/               # Algemene documentatie
│       ├── app-overview.md    # App overzicht
│       ├── components.md      # Component specificaties
│       ├── navigation.md      # Navigatie structuur
│       ├── api-integration.md # API integratie
│       ├── project-structure.md # Project structuur
│       ├── i18n-setup.md     # Internationalisatie setup met automatische taalherkenning
│       └── ...               # Additional documentation
│
└── index.js                   # Entry point voor Expo
```

## 📁 Directory Explanations

### `/src/components/`

Herbruikbare UI componenten die gebruikt worden in meerdere screens. Elke component heeft zijn eigen directory met TypeScript interfaces en implementatie.

### `/src/screens/`

App schermen georganiseerd per tab. Elke screen heeft zijn eigen directory met component, types, en styling.

### `/src/navigation/`

Navigatie configuratie voor React Navigation. Bottom tabs en stack navigators per tab.

### `/src/services/`

API integratie en local storage utilities. Georganiseerd per functionaliteit.

### `/src/context/`

React Context providers voor state management. Elke context heeft zijn eigen file met TypeScript types.

### `/src/types/`

TypeScript type definities georganiseerd per categorie. Centrale plek voor alle type definities.

### `/src/utils/`

Helper functies en utilities. Data validatie, formatting, en algemene helpers.

### `/src/hooks/`

Custom React hooks voor herbruikbare logica. API calls, storage, en debouncing.

### `/src/styles/`

Styling en theming configuratie. Theme, colors, typography, en spacing utilities.

### `/assets/`

Statische assets zoals afbeeldingen, fonts, en splash screen assets.

### `/docs/`

Project documentatie georganiseerd per feature en algemene informatie.

- **`/docs/features/`** - Feature-specifieke documentatie
- **`/docs/general/`** - Algemene projectdocumentatie inclusief:
  - [App Overview](app-overview.md)
  - [Components](components.md)
  - [Navigation](navigation.md)
  - [API Integration](api-integration.md)
  - [Project Structure](project-structure.md)
  - [i18n Setup](i18n-setup.md)

## 🔧 Configuration Files

### `App.tsx`

Hoofdentry point van de app met providers en navigatie setup.

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

### Feature-Based Organization

- Code georganiseerd per feature/domain
- Herbruikbare componenten in `/components/`
- Feature-specifieke code in `/screens/`

### Type Safety

- Alle code heeft TypeScript types
- Types gecentraliseerd in `/types/`
- Strict TypeScript configuratie

### Separation of Concerns

- UI componenten gescheiden van business logic
- API calls in `/services/`
- State management in `/context/`

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

- React Navigation v6
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

### Quality

- **Testability**: Modular structure supports testing
- **Consistency**: Standardized patterns
- **Documentation**: Living documentation in `/docs/`

### Performance

- **Lazy Loading**: Screens loaded on demand
- **Asset Optimization**: Efficient asset handling
- **Memory Management**: Proper cleanup and caching

### Team Collaboration

- **Clear Ownership**: Feature-based organization
- **Code Reviews**: Easy to review and understand
- **Onboarding**: Clear structure for new developers

## 🔄 Future-Proof Design

### Extensibility

- **New Features**: Easy to add new screens and components
- **New APIs**: Simple to add new service endpoints
- **New Contexts**: Straightforward to add new state management
- **New Types**: Centralized type system supports growth

### Flexibility

- **Generic Structure**: Works for any React Native app
- **Scalable Patterns**: Established patterns for growth
- **Modular Design**: Easy to refactor and reorganize
- **Clear Conventions**: Consistent naming and organization
