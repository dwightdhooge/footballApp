import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import ScoresStackNavigator from "@/navigation/stacks/scores";
import FavoritesStackNavigator from "@/navigation/stacks/favorites";
import SettingsStackNavigator from "@/navigation/stacks/settings";
import DebugStackNavigator from "@/navigation/stacks/debug";
import { useTheme } from "@/context/ThemeContext";
import { useDebug } from "@/context/DebugContext";
import { RootTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabsNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isDebugMode } = useDebug();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Scores"
        component={ScoresStackNavigator}
        options={{
          tabBarLabel: t("navigation.scores"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "football" : "football-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        options={{
          tabBarLabel: t("navigation.favorites"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: t("navigation.settings"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      {isDebugMode && (
        <Tab.Screen
          name="Debug"
          component={DebugStackNavigator}
          options={{
            tabBarLabel: "Debug",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "bug" : "bug-outline"}
                size={size}
                color={color}
              />
            ),
            headerShown: false,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
