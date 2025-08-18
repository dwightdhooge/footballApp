# Navigation Structure

## 🎯 Navigation Overview

### Gebruikersdoelen

- **Intuïtieve navigatie** tussen hoofdfunctionaliteiten
- **Snelle toegang** tot scores en instellingen
- **Consistente ervaring** tussen verschillende app secties
- **Efficiënte navigatie** met minimale taps

## 🏗 Technical Implementation

### Bottom Tabs Structure

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
};

type SettingsTabFlow = {
  Settings: undefined;
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
      };
    };
    "Settings Tab": {
      "Settings Stack Navigator": {
        SettingsScreen: undefined;
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
        ],
      },
    },
    {
      name: "Settings",
      state: {
        index: 0,
        routes: [{ name: "Settings" }],
      },
    },
  ],
};
```

### Navigation Actions

#### Tab Navigation

```typescript
// Switch between tabs
const navigateToTab = (tabName: "Scores" | "Settings"): void => {
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

const switchToSettings = (): void => {
  navigation.navigate("Settings");
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

// Settings screen is standalone, no sub-navigation needed

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
  | "soccerapp://settings";

// Deep link mapping
interface DeepLinkMapping {
  "soccerapp://scores/country/:countryCode": "CountryDetail";
  "soccerapp://scores/league/:leagueId": "LeagueDetail";
  "soccerapp://scores/cup/:cupId": "CupDetail";
  "soccerapp://settings": "Settings";
}

const deepLinkMapping: DeepLinkMapping = {
  "soccerapp://scores/country/:countryCode": "CountryDetail",
  "soccerapp://scores/league/:leagueId": "LeagueDetail",
  "soccerapp://scores/cup/:cupId": "CupDetail",
  "soccerapp://settings": "Settings",
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
        };
      };
      Settings: {
        screens: {
          Settings: string;
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
        },
      },
      Settings: {
        screens: {
          Settings: "settings",
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
    }

    if (pathParts[0] === "settings") {
      return { screen: "Settings" };
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

    case "Settings":
      navigation.navigate("Settings");
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
