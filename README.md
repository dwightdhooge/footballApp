# Soccer App

A React Native Expo app that provides real-time soccer data via the API-Football API. The app focuses on simple navigation per country with personal favorites functionality.

## Features

### Core Features

- **Homescreen** with country search and favorites
- **Country-specific data** (matches, teams, players)
- **Favorites system** for personal countries
- **Real-time updates** of live matches

### Screen Features

- **Homescreen**: Search countries and manage favorites
- **Country Detail**: View leagues and cups for a specific country
- **League Detail**: View standings and matches for a league
- **Cup Detail**: View matches for different rounds of a cup

### Cup Detail Screen

The Cup Detail Screen allows users to:

- Select different seasons for cup data
- Choose different rounds (Final, Semi-finals, Quarter-finals, etc.)
- View all matches for the selected season and round
- Navigate back to previous screens

#### Components Used

- `CupHeader`: Navigation header with back button
- `CupInfo`: Displays cup logo, name, and country
- `SeasonDropdown`: Reusable season selection component
- `RoundDropdown`: Reusable round selection component
- `MatchesList`: Displays list of matches with loading/error states
- `MatchCard`: Individual match display component

#### API Integration

- Uses existing rounds and fixtures API endpoints
- Supports coverage checking for fixtures
- Handles current round detection
- Implements proper error handling and loading states

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: React Context API
- **API**: API-Football v3
- **Styling**: React Native StyleSheet
- **TypeScript**: For type safety and better developer experience

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── services/           # API calls and data handling
├── context/            # State management
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── styles/             # Styling and theming
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on iOS:

   ```bash
   npm run ios
   ```

4. Run on Android:
   ```bash
   npm run android
   ```

## API Configuration

The app uses the API-Football v3 API with the following configuration:

- Base URL: https://v3.football.api-sports.io/
- Rate Limit: 100 requests/day (free tier)
- Authentication: x-apisports-key header

## Development

### TypeScript

The project uses TypeScript for type safety. Run type checking:

```bash
npx tsc --noEmit
```

### Code Organization

- Components are organized by feature/domain
- Reusable components in `/components/`
- Feature-specific code in `/screens/`
- API integration in `/services/`
- State management in `/context/`

### Navigation Flow

1. **Homescreen** → Country search/selection
2. **Country Detail** → Leagues and cups per country
3. **League Detail** → Standings and matches per league
4. **Cup Detail** → Matches per cup round

## Contributing

1. Follow the established project structure
2. Use TypeScript for all new code
3. Follow the component patterns established in the codebase
4. Ensure proper error handling and loading states
5. Test navigation flows thoroughly
