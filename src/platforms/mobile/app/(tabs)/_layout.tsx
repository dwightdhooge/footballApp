// src/platforms/mobile/app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useDebug } from "@/context/DebugContext";

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isDebugMode } = useDebug();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t("navigation.scores"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "football" : "football-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(favorites)"
        options={{
          title: t("navigation.favorites"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("navigation.settings"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: "Debug",
          href: isDebugMode ? "/debug" : null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bug" : "bug-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
