import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { FavoritesStackParamList } from "@/core/types/navigation";
import { FavoritesHomeScreen } from "@/screens/favorites/FavoritesHomeScreen";
import { CountryDetailScreen } from "@/screens/scores/CountryDetailScreen";
import { LeagueDetailScreen } from "@/screens/scores/LeagueDetailScreen";
import { CupDetailScreen } from "@/screens/scores/CupDetailScreen";
import { MatchDetailScreen } from "@/screens/scores/MatchDetailScreen";
import { PlayerDetailScreen } from "@/screens/scores/PlayerDetailScreen";
import { TeamDetailScreen } from "@/screens/scores/TeamDetailScreen";

const Stack = createStackNavigator<FavoritesStackParamList>();

export const FavoritesStackNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: t("navigation.back"),
      }}
    >
      <Stack.Screen
        name="FavoritesHome"
        component={FavoritesHomeScreen}
        options={{
          title: t("navigation.favorites"),
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
      <Stack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};
