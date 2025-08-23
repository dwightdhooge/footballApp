import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { FavoritesStackParamList } from "@/types/navigation";
import FavoritesHomeScreen from "@/screens/favorites/FavoritesHomeScreen";
import CountryDetailScreen from "@/screens/scores/country-detail";
import LeagueDetailScreen from "@/screens/scores/league-detail";
import CupDetailScreen from "@/screens/scores/cup-detail";
import MatchDetailScreen from "@/screens/scores/match-detail";
import PlayerDetailScreen from "@/screens/scores/player-detail";

const Stack = createStackNavigator<FavoritesStackParamList>();

const FavoritesStackNavigator: React.FC = () => {
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
    </Stack.Navigator>
  );
};

export default FavoritesStackNavigator;
