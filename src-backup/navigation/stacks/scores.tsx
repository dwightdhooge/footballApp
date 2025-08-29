import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/context/ThemeContext";
import Homescreen from "@/screens/scores/homescreen";
import SearchScreen from "@/screens/scores/search-screen/index";
import CountryDetailScreen from "@/screens/scores/country-detail";
import LeagueDetailScreen from "@/screens/scores/league-detail";
import CupDetailScreen from "@/screens/scores/cup-detail";
import MatchDetailScreen from "@/screens/scores/match-detail";
import PlayerDetailScreen from "@/screens/scores/player-detail/index";
import TeamDetailScreen from "@/screens/scores/team-detail";
import { ScoresStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<ScoresStackParamList>();

const ScoresStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: theme.colors.text,
        },
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="Homescreen"
        component={Homescreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
      <Stack.Screen name="LeagueDetail" component={LeagueDetailScreen} />
      <Stack.Screen name="CupDetail" component={CupDetailScreen} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
      <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
    </Stack.Navigator>
  );
};

export default ScoresStackNavigator;
