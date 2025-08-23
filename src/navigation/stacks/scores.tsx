import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/context/ThemeContext";
import Homescreen from "@/screens/scores/homescreen";
import CountryDetailScreen from "@/screens/scores/country-detail";
import LeagueDetailScreen from "@/screens/scores/league-detail";
import CupDetailScreen from "@/screens/scores/cup-detail";
import MatchDetailScreen from "@/screens/scores/match-detail";
import PlayerDetailScreen from "@/screens/scores/player-detail/index";
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
        name="CountryDetail"
        component={CountryDetailScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="LeagueDetail"
        component={LeagueDetailScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="CupDetail"
        component={CupDetailScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default ScoresStackNavigator;
