import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/context/ThemeContext";
import Homescreen from "@/screens/scores/homescreen";
import CountryDetailScreen from "@/screens/scores/country-detail";
import LeagueDetailScreen from "@/screens/scores/league-detail";
import CupDetailScreen from "@/screens/scores/cup-detail";
import MatchDetailScreen from "@/screens/scores/match-detail";
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
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: 20, // theme.typography.h2
          fontWeight: "bold",
        },
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
          headerShown: false, // We use our custom CountryHeader component
        }}
      />
      <Stack.Screen
        name="LeagueDetail"
        component={LeagueDetailScreen}
        options={{
          headerShown: false, // We use our custom header component
        }}
      />
      <Stack.Screen
        name="CupDetail"
        component={CupDetailScreen}
        options={{
          headerShown: false, // We use our custom CupHeader component
        }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{
          headerShown: false, // We use our custom header component
        }}
      />
    </Stack.Navigator>
  );
};

export default ScoresStackNavigator;
