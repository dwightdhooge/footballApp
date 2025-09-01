# Navigation Structure

## 🎯 Navigation Overview

### Gebruikersdoelen

- **Intuïtieve navigatie** tussen hoofdfunctionaliteiten
- **Snelle toegang** tot scores en instellingen
- **Consistente ervaring** tussen verschillende app secties
- **Efficiënte navigatie** met minimale taps
- **Cross-platform navigatie** voor mobile en web

## 🏗 Technical Implementation

### Platform-Specific Navigation Structure

#### Mobile Platform (`/src/platforms/mobile/navigation/`)

```typescript
// Mobile navigation structure
interface MobileNavigationStructure {
  "Bottom Tabs Navigator": {
    "Scores Tab": {
      "Scores Stack Navigator": {
        Homescreen: undefined;
        CountryDetailScreen: { item: Country };
        LeagueDetailScreen: { item: League };
        CupDetailScreen: { item: Cup };
        MatchDetailScreen: { item: Fixture };
        TeamDetailScreen: { item: Team };
        PlayerDetailScreen: { item: Player };
      };
    };
    "Favorites Tab": {
      "Favorites Stack Navigator": {
        FavoritesHomeScreen: undefined;
      };
    };
    "Settings Tab": {
      "Settings Stack Navigator": {
        SettingsScreen: undefined;
      };
    };
    "Debug Tab": {
      "Debug Stack Navigator": {
        DebugScreen: undefined;
      };
    };
  };
}
```

#### Web Platform (`/src/platforms/web/`)

```typescript
// Web navigation structure
interface WebNavigationStructure {
  "Web App Router": {
    HomePage: undefined;
    CountryDetailPage: { item: Country };
    LeagueDetailPage: { item: League };
    CupDetailPage: { item: Cup };
    MatchDetailPage: { item: Fixture };
    TeamDetailPage: { item: Team };
    PlayerDetailPage: { item: Player };
    SettingsPage: undefined;
  };
}
```

### Bottom Tabs Structure

```typescript
// Navigation types
interface NavigationParams {
  item: Country | League | Cup | Fixture | Team | Player;
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

type FavoritesTabFlow = {
  FavoritesHome: undefined;
};

type SettingsTabFlow = {
  Settings: undefined;
};

type DebugTabFlow = {
  Debug: undefined;
};

// App structure
interface AppNavigationStructure {
  "Bottom Tabs Navigator": {
    "Scores Tab": {
      "Scores Stack Navigator": {
        Homescreen: undefined;
        CountryDetailScreen: { item: Country };
        LeagueDetailScreen: { item: League };
        CupDetailScreen: { item: Cup };
        MatchDetailScreen: { item: Fixture };
        TeamDetailScreen: { item: Team };
        PlayerDetailScreen: { item: Player };
      };
    };
    "Favorites Tab": {
      "Favorites Stack Navigator": {
        FavoritesHomeScreen: undefined;
      };
    };
    "Settings Tab": {
      "Settings Stack Navigator": {
        SettingsScreen: undefined;
      };
    };
    "Debug Tab": {
      "Debug Stack Navigator": {
        DebugScreen: undefined;
      };
    };
  };
}
```

### Navigation Configuration

#### Bottom Tabs Navigator

```typescript
// Bottom Tabs Configuration
interface BottomTabsConfig {
  Scores: {
    screen: React.ComponentType<any>;
    options: {
      tabBarLabel: string;
      tabBarIcon: (props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactElement;
      tabBarActiveTintColor: string;
      tabBarInactiveTintColor: string;
    };
  };
  Favorites: {
    screen: React.ComponentType<any>;
    options: {
      tabBarLabel: string;
      tabBarIcon: (props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactElement;
      tabBarActiveTintColor: string;
      tabBarInactiveTintColor: string;
    };
  };
  Settings: {
    screen: React.ComponentType<any>;
    options: {
      tabBarLabel: string;
      tabBarIcon: (props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactElement;
      tabBarActiveTintColor: string;
      tabBarInactiveTintColor: string;
    };
  };
  Debug: {
    screen: React.ComponentType<any>;
    options: {
      tabBarLabel: string;
      tabBarIcon: (props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactElement;
      tabBarActiveTintColor: string;
      tabBarInactiveTintColor: string;
    };
  };
}

const bottomTabsConfig: BottomTabsConfig = {
  Scores: {
    screen: ScoresStackNavigator,
    options: {
      tabBarLabel: "Scores",
      tabBarIcon: ({ focused, color, size }) => (
        <Icon name="soccer-ball" size={size} color={color} />
      ),
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "#666",
    },
  },
  Favorites: {
    screen: FavoritesStackNavigator,
    options: {
      tabBarLabel: "Favorieten",
      tabBarIcon: ({ focused, color, size }) => (
        <Icon name="heart" size={size} color={color} />
      ),
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "#666",
    },
  },
  Settings: {
    screen: SettingsStackNavigator,
    options: {
      tabBarLabel: "Instellingen",
      tabBarIcon: ({ focused, color, size }) => (
        <Icon name="settings" size={size} color={color} />
      ),
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "#666",
    },
  },
  Debug: {
    screen: DebugStackNavigator,
    options: {
      tabBarLabel: "Debug",
      tabBarIcon: ({ focused, color, size }) => (
        <Icon name="bug" size={size} color={color} />
      ),
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "#666",
    },
  },
};
```

#### Scores Stack Navigator

```typescript
// Scores Stack Configuration
interface ScoresStackConfig {
  Homescreen: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
    };
  };
  CountryDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
  LeagueDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
  CupDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
  MatchDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
  TeamDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
  PlayerDetail: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
      headerBackTitle: string;
    };
  };
}

const scoresStackConfig: ScoresStackConfig = {
  Homescreen: {
    screen: Homescreen,
    options: {
      headerShown: false,
      title: "Soccer App",
    },
  },
  CountryDetail: {
    screen: CountryDetailScreen,
    options: {
      headerShown: true,
      title: "Land Details",
      headerBackTitle: "Terug",
    },
  },
  LeagueDetail: {
    screen: LeagueDetailScreen,
    options: {
      headerShown: true,
      title: "League Details",
      headerBackTitle: "Terug",
    },
  },
  CupDetail: {
    screen: CupDetailScreen,
    options: {
      headerShown: true,
      title: "Cup Details",
      headerBackTitle: "Terug",
    },
  },
  MatchDetail: {
    screen: MatchDetailScreen,
    options: {
      headerShown: true,
      title: "Match Details",
      headerBackTitle: "Terug",
    },
  },
  TeamDetail: {
    screen: TeamDetailScreen,
    options: {
      headerShown: true,
      title: "Team Details",
      headerBackTitle: "Terug",
    },
  },
  PlayerDetail: {
    screen: PlayerDetailScreen,
    options: {
      headerShown: true,
      title: "Player Details",
      headerBackTitle: "Terug",
    },
  },
};
```

#### Favorites Stack Navigator

```typescript
// Favorites Stack Configuration
interface FavoritesStackConfig {
  FavoritesHome: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
    };
  };
}

const favoritesStackConfig: FavoritesStackConfig = {
  FavoritesHome: {
    screen: FavoritesHomeScreen,
    options: {
      headerShown: false,
      title: "Favorieten",
    },
  },
};
```

#### Settings Stack Navigator

```typescript
// Settings Stack Configuration
interface SettingsStackConfig {
  Settings: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
    };
  };
}

const settingsStackConfig: SettingsStackConfig = {
  Settings: {
    screen: SettingsScreen,
    options: {
      headerShown: false,
      title: "Instellingen",
    },
  },
};
```

#### Debug Stack Navigator

```typescript
// Debug Stack Configuration
interface DebugStackConfig {
  Debug: {
    screen: React.ComponentType<any>;
    options: {
      headerShown: boolean;
      title: string;
    };
  };
}

const debugStackConfig: DebugStackConfig = {
  Debug: {
    screen: DebugScreen,
    options: {
      headerShown: false,
      title: "Debug",
    },
  },
};
```

### Navigation State Management

```typescript
// Navigation State
interface NavigationState {
  index: number; // Active tab index
  routes: Array<{
    name: string;
    state?: {
      index: number;
      routes: Array<{
        name: string;
        params?: NavigationParams;
      }>;
    };
  }>;
}

const navigationState: NavigationState = {
  index: 0,
  routes: [
    {
      name: "Scores",
      state: {
        index: 0,
        routes: [
          { name: "Homescreen" },
          { name: "CountryDetail", params: { item: country } },
          { name: "LeagueDetail", params: { item: league } },
          { name: "CupDetail", params: { item: cup } },
          { name: "MatchDetail", params: { item: fixture } },
          { name: "TeamDetail", params: { item: team } },
          { name: "PlayerDetail", params: { item: player } },
        ],
      },
    },
    {
      name: "Favorites",
      state: {
        index: 0,
        routes: [{ name: "FavoritesHome" }],
      },
    },
    {
      name: "Settings",
      state: {
        index: 0,
        routes: [{ name: "Settings" }],
      },
    },
    {
      name: "Debug",
      state: {
        index: 0,
        routes: [{ name: "Debug" }],
      },
    },
  ],
};
```

### Navigation Actions

#### Tab Navigation

```typescript
// Switch between tabs
const navigateToTab = (
  tabName: "Scores" | "Favorites" | "Settings" | "Debug"
): void => {
  navigation.navigate(tabName);
};

// Get current tab
const getCurrentTab = (): string => {
  return navigation.getState().routes[navigation.getState().index].name;
};

// Switch tabs
const switchToScores = (): void => {
  navigation.navigate("Scores");
};

const switchToFavorites = (): void => {
  navigation.navigate("Favorites");
};

const switchToSettings = (): void => {
  navigation.navigate("Settings");
};

const switchToDebug = (): void => {
  navigation.navigate("Debug");
};
```

#### Stack Navigation

```typescript
// Navigate to screens within tabs
const navigateToCountry = (country: Country): void => {
  navigation.navigate("CountryDetail", { item: country });
};

const navigateToLeague = (league: League): void => {
  navigation.navigate("LeagueDetail", { item: league });
};

const navigateToCup = (cup: Cup): void => {
  navigation.navigate("CupDetail", { item: cup });
};

const navigateToMatch = (fixture: Fixture): void => {
  navigation.navigate("MatchDetail", { item: fixture });
};

const navigateToTeam = (team: Team): void => {
  navigation.navigate("TeamDetail", { item: team });
};

const navigateToPlayer = (player: Player): void => {
  navigation.navigate("PlayerDetail", { item: player });
};

// Go back
const goBack = (): void => {
  navigation.goBack();
};
```

### Deep Linking

#### URL Structure

```typescript
// Deep link URL types
type DeepLinkURL =
  | `soccerapp://scores/country/${string}`
  | `soccerapp://scores/league/${number}`
  | `soccerapp://scores/cup/${number}`
  | `soccerapp://scores/match/${number}`
  | `soccerapp://scores/team/${number}`
  | `soccerapp://scores/player/${number}`
  | "soccerapp://favorites"
  | "soccerapp://settings"
  | "soccerapp://debug";

// Deep link mapping
interface DeepLinkMapping {
  "soccerapp://scores/country/:countryCode": "CountryDetail";
  "soccerapp://scores/league/:leagueId": "LeagueDetail";
  "soccerapp://scores/cup/:cupId": "CupDetail";
  "soccerapp://scores/match/:matchId": "MatchDetail";
  "soccerapp://scores/team/:teamId": "TeamDetail";
  "soccerapp://scores/player/:playerId": "PlayerDetail";
  "soccerapp://favorites": "Favorites";
  "soccerapp://settings": "Settings";
  "soccerapp://debug": "Debug";
}

const deepLinkMapping: DeepLinkMapping = {
  "soccerapp://scores/country/:countryCode": "CountryDetail",
  "soccerapp://scores/league/:leagueId": "LeagueDetail",
  "soccerapp://scores/cup/:cupId": "CupDetail",
  "soccerapp://scores/match/:matchId": "MatchDetail",
  "soccerapp://scores/team/:teamId": "TeamDetail",
  "soccerapp://scores/player/:playerId": "PlayerDetail",
  "soccerapp://favorites": "Favorites",
  "soccerapp://settings": "Settings",
  "soccerapp://debug": "Debug",
};
```

#### Deep Link Configuration

```typescript
// Deep link configuration
interface DeepLinkConfig {
  prefixes: string[];
  config: {
    screens: {
      Scores: {
        screens: {
          Homescreen: string;
          CountryDetail: string;
          LeagueDetail: string;
          CupDetail: string;
          MatchDetail: string;
          TeamDetail: string;
          PlayerDetail: string;
        };
      };
      Favorites: {
        screens: {
          FavoritesHome: string;
        };
      };
      Settings: {
        screens: {
          Settings: string;
        };
      };
      Debug: {
        screens: {
          Debug: string;
        };
      };
    };
  };
}

const deepLinkConfig: DeepLinkConfig = {
  prefixes: ["soccerapp://"],
  config: {
    screens: {
      Scores: {
        screens: {
          Homescreen: "scores",
          CountryDetail: "scores/country/:countryCode",
          LeagueDetail: "scores/league/:leagueId",
          CupDetail: "scores/cup/:cupId",
          MatchDetail: "scores/match/:matchId",
          TeamDetail: "scores/team/:teamId",
          PlayerDetail: "scores/player/:playerId",
        },
      },
      Favorites: {
        screens: {
          FavoritesHome: "favorites",
        },
      },
      Settings: {
        screens: {
          Settings: "settings",
        },
      },
      Debug: {
        screens: {
          Debug: "debug",
        },
      },
    },
  },
};
```

### Deep Linking

```typescript
// Handle deep links
interface DeepLinkRoute {
  screen: string;
  params?: NavigationParams;
}

const parseDeepLink = (url: string): DeepLinkRoute | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    if (pathParts[0] === "scores") {
      if (pathParts[1] === "country") {
        return {
          screen: "CountryDetail",
          params: { item: { code: pathParts[2] } as Country },
        };
      }
      if (pathParts[1] === "league") {
        return {
          screen: "LeagueDetail",
          params: { item: { id: parseInt(pathParts[2]) } as League },
        };
      }
      if (pathParts[1] === "cup") {
        return {
          screen: "CupDetail",
          params: { item: { id: parseInt(pathParts[2]) } as Cup },
        };
      }
      if (pathParts[1] === "match") {
        return {
          screen: "MatchDetail",
          params: { item: { id: parseInt(pathParts[2]) } as Fixture },
        };
      }
      if (pathParts[1] === "team") {
        return {
          screen: "TeamDetail",
          params: { item: { id: parseInt(pathParts[2]) } as Team },
        };
      }
      if (pathParts[1] === "player") {
        return {
          screen: "PlayerDetail",
          params: { item: { id: parseInt(pathParts[2]) } as Player },
        };
      }
    }

    if (pathParts[0] === "favorites") {
      return { screen: "Favorites" };
    }

    if (pathParts[0] === "settings") {
      return { screen: "Settings" };
    }

    if (pathParts[0] === "debug") {
      return { screen: "Debug" };
    }

    return null;
  } catch (error) {
    console.error("Deep link parsing error:", error);
    return null;
  }
};

const handleDeepLink = (url: string): void => {
  const route = parseDeepLink(url);

  if (!route) {
    navigation.navigate("Scores");
    return;
  }

  switch (route.screen) {
    case "CountryDetail":
      navigation.navigate("Scores", {
        screen: "CountryDetail",
        params: route.params,
      });
      break;

    case "LeagueDetail":
      navigation.navigate("Scores", {
        screen: "LeagueDetail",
        params: route.params,
      });
      break;

    case "CupDetail":
      navigation.navigate("Scores", {
        screen: "CupDetail",
        params: route.params,
      });
      break;

    case "MatchDetail":
      navigation.navigate("Scores", {
        screen: "MatchDetail",
        params: route.params,
      });
      break;

    case "TeamDetail":
      navigation.navigate("Scores", {
        screen: "TeamDetail",
        params: route.params,
      });
      break;

    case "PlayerDetail":
      navigation.navigate("Scores", {
        screen: "PlayerDetail",
        params: route.params,
      });
      break;

    case "Favorites":
      navigation.navigate("Favorites");
      break;

    case "Settings":
      navigation.navigate("Settings");
      break;

    case "Debug":
      navigation.navigate("Debug");
      break;

    default:
      navigation.navigate("Scores");
  }
};
```

### Navigation State Management

```typescript
// Save navigation state
const saveNavigationState = (state: NavigationState): Promise<void> => {
  return AsyncStorage.setItem("navigation_state", JSON.stringify(state));
};

// Restore navigation state
const restoreNavigationState = async (): Promise<NavigationState | null> => {
  try {
    const state = await AsyncStorage.getItem("navigation_state");
    if (state) {
      return JSON.parse(state);
    }
  } catch (error) {
    console.error("Navigation state restore error:", error);
  }
  return null;
};

// Reset navigation state
const resetNavigationState = (): Promise<void> => {
  return AsyncStorage.removeItem("navigation_state");
};
```

### Web Platform Navigation

#### Web Router Configuration

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

// Web navigation handling
const handleWebNavigation = (page: keyof WebPageFlow, params?: any): void => {
  // Web-specific navigation logic
  window.history.pushState({ page, params }, "", `/${page.toLowerCase()}`);
  // Trigger page change
  window.dispatchEvent(new PopStateEvent("popstate"));
};

// Web route handling
const handleWebRoute = (pathname: string): void => {
  const pathParts = pathname.split("/").filter(Boolean);
  const page = pathParts[0] || "home";

  switch (page.toLowerCase()) {
    case "country":
      // Handle country detail page
      break;
    case "league":
      // Handle league detail page
      break;
    case "cup":
      // Handle cup detail page
      break;
    case "match":
      // Handle match detail page
      break;
    case "team":
      // Handle team detail page
      break;
    case "player":
      // Handle player detail page
      break;
    case "settings":
      // Handle settings page
      break;
    default:
      // Handle home page
      break;
  }
};
```
