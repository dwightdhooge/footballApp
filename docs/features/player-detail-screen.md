# Player Detail Screen

## 📋 Overview

The Player Detail Screen displays comprehensive information about a specific football player, accessed when users tap on a player from lineup views or other player lists throughout the app.

## 🎯 User Stories

### Primary User Story

**As a** football fan  
**I want to** view detailed information about a specific player  
**So that** I can learn more about their background, stats, and current status

### Acceptance Criteria

- [ ] User can navigate to player detail from lineup views
- [ ] Player profile information is displayed clearly and organized
- [ ] Player photo is prominently displayed
- [ ] All player data from API is properly formatted and displayed
- [ ] Screen handles loading and error states gracefully
- [ ] Navigation back to previous screen works correctly
- [ ] User can switch between Career and Stats tabs
- [ ] Career tab displays player's team history and season timeline
- [ ] Stats tab shows player performance metrics

## 🏗 Technical Architecture

### Navigation Flow

```
Lineup View → Player Row Tap → Player Detail Screen
```

### Data Sources

- **Primary API**: `GET /players/profiles?player={id}`
- **Career API**: `GET /players/teams?player={id}`
- **Player ID Source**: Extracted from lineup API calls
- **Data Structure**: Player profile object with comprehensive information
- **Career Data**: Player's team history and season timeline

### Screen Structure

```
PlayerDetailScreen/
├── PlayerHeader/
│   ├── PlayerPhoto
│   ├── PlayerName
│   ├── PlayerPosition
│   └── PlayerNumber
├── TabNavigation/
│   ├── Career Tab
│   └── Stats Tab
├── TabContent/
│   ├── Career Tab Content
│   │   ├── TeamHistory
│   │   └── SeasonTimeline
│   └── Stats Tab Content
│       └── PerformanceMetrics
└── Navigation/
    └── BackButton
```

### Component Hierarchy

```
PlayerDetailScreen
├── PlayerHeader
│   ├── CachedImage (for player photo)
│   ├── PlayerName (firstname + lastname)
│   ├── PlayerPosition
│   └── PlayerNumber
├── TabNavigation
│   ├── Career Tab
│   └── Stats Tab
├── TabContent
│   ├── Career Tab Content
│   │   ├── TeamHistory
│   │   │   ├── TeamCard
│   │   │   │   ├── TeamLogo
│   │   │   │   ├── TeamName
│   │   │   │   └── SeasonsList
│   │   │   └── TeamTimeline
│   │   └── SeasonTimeline
│   └── Stats Tab Content
│       └── PerformanceMetrics
└── Navigation
    └── BackButton
```

### Data Models

#### Player Profile API Response

```typescript
interface PlayerProfileResponse {
  get: string;
  parameters: {
    player: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerProfile[];
}

interface PlayerProfile {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    number: number;
    position: string;
    photo: string;
  };
}
```

#### Player Teams/Career API Response

```typescript
interface PlayerTeamsResponse {
  get: string;
  parameters: {
    player: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: PlayerTeam[];
}

interface PlayerTeam {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  seasons: number[];
}
```

### State Management

- **Local State**: Loading, error states, player data, active tab, career data
- **Context**: No additional context needed (self-contained screen)
- **Caching**: Player photo using existing CachedImage component
- **Tab State**: Track active tab (Career/Stats) and load corresponding data

### API Integration

- **Profile Endpoint**: `/players/profiles`
- **Career Endpoint**: `/players/teams`
- **Method**: GET
- **Parameters**: `player` (player ID)
- **Error Handling**: Network errors, invalid player ID, empty responses
- **Data Loading**: Load profile data immediately, load career data when Career tab is selected

## 🧪 Quality & Testing

### Test Scenarios

- [ ] **Happy Path**: Valid player ID returns complete profile data
- [ ] **Tab Navigation**: User can switch between Career and Stats tabs
- [ ] **Career Data**: Career tab displays team history and seasons correctly
- [ ] **Edge Cases**:
  - Player with missing photo
  - Player with incomplete birth information
  - Player with no assigned number
  - Player with no career history
  - Player with single team vs. multiple teams
- [ ] **Error Handling**:
  - Network failures
  - Invalid player ID
  - API rate limiting
  - Empty response data
  - Partial career data

### UI/UX Considerations

- **Accessibility**: Screen reader support for player information
- **Responsiveness**: Proper layout on different screen sizes
- **Loading States**: Skeleton loading for better perceived performance
- **Error States**: User-friendly error messages with retry options

### Performance Considerations

- **Image Caching**: Leverage existing CachedImage component
- **Lazy Loading**: Load player data only when screen is focused
- **Memory Management**: Clean up resources when screen unmounts

### Validation Requirements

- **Data Validation**: Ensure all required fields are present
- **Format Validation**: Validate date formats, number ranges
- **Fallback Values**: Provide defaults for missing data

## 🔄 Future Enhancements

### Phase 2 Features

- **Player Statistics**: Career stats, current season performance
- **Recent Matches**: Last 5-10 matches with performance data
- **Social Media**: Links to player's social media accounts
- **News Feed**: Recent news articles about the player
- **Career Timeline**: Visual timeline of player's career progression
- **Team Performance**: Player's performance while at each team

### Phase 3 Features

- **Player Comparison**: Compare with other players
- **Favorite Players**: Add to favorites list
- **Share Functionality**: Share player profile
- **Push Notifications**: Notify about player news/updates

## 📱 Screen Mockup

```
┌─────────────────────────────────────┐
│ ← Back                    Player    │
├─────────────────────────────────────┤
│                                     │
│        [Player Photo]               │
│                                     │
│        Neymar                       │
│        Attacker • #10               │
├─────────────────────────────────────┤
│ [Career] [Stats]                    │
├─────────────────────────────────────┤
│ Career Tab Content:                 │
│                                     │
│ 🇧🇷 Brazil (2026, 2023, 2022...)   │
│ 🏆 Al-Hilal Saudi FC (2024, 2023)  │
│ ⭐ Paris Saint Germain (2022-2017)  │
│ 🔵 Barcelona (2016-2013)            │
│ 🇧🇷 Brazil U23 (2016, 2012)        │
│ ⚽ Santos (2012-2009)               │
│ 🇧🇷 Brazil U20 (2011)               │
│ 🇧🇷 Brazil U17 (2009)               │
│                                     │
│ Stats Tab Content:                  │
│ [Performance metrics placeholder]   │
└─────────────────────────────────────┘
```

## ⚠️ Known Risks & Assumptions

### Risks

- **API Rate Limiting**: Player profile calls may be rate-limited
- **Data Consistency**: Player data may be outdated or incomplete
- **Image Availability**: Player photos may not be available for all players
- **Career Data Complexity**: Players may have complex career paths with multiple teams
- **Season Data Gaps**: Some seasons may be missing or incomplete

### Assumptions

- Player ID from lineup API is always valid
- All player profile fields are consistently available
- Player photos follow consistent URL pattern
- Birth date format is always ISO 8601
- Career data is ordered chronologically (newest first)
- Team logos follow consistent URL pattern
- All players have at least one team in their career

### Mitigation Strategies

- Implement proper error boundaries
- Add retry logic for failed API calls
- Provide fallback images for missing photos
- Cache player data to reduce API calls
- Implement lazy loading for career data (only when tab is selected)
- Provide fallback UI for missing career information
- Sort and validate career data before display

## 📚 Related Documentation

- [Lineup Components](./lineups-grid.md)
- [Player Row Component](./player-row.md)
- [API Integration](./api-integration.md)
- [Navigation Structure](./navigation.md)
- [Image Caching](./svg-caching.md)
- [Tab Navigation](./tab-navigation.md)
- [Team Components](./team-info.md)
