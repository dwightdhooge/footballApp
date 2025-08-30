import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/core/context/ThemeContext";
import { Homescreen } from "@/screens/scores/Homescreen";
import { SearchScreen } from "@/screens/scores/SearchScreen";
import { CountryDetailScreen } from "@/screens/scores/CountryDetailScreen";
import { LeagueDetailScreen } from "@/screens/scores/LeagueDetailScreen";
import { CupDetailScreen } from "@/screens/scores/CupDetailScreen";
import { MatchDetailScreen } from "@/screens/scores/MatchDetailScreen";
import { PlayerDetailScreen } from "@/screens/scores/PlayerDetailScreen";
import { TeamDetailScreen } from "@/screens/scores/TeamDetailScreen";
import { ScoresStackParamList } from "@/core/types/navigation";

const Stack = createStackNavigator<ScoresStackParamList>();

export const ScoresStackNavigator: React.FC = () => {
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
