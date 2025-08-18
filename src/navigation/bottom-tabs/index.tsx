import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import ScoresStackNavigator from "@/navigation/stacks/scores";
import SettingsStackNavigator from "@/navigation/stacks/settings";
import { useTheme } from "@/context/ThemeContext";
import { RootTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabsNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
