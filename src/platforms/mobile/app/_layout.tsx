// src/platforms/mobile/app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { FavoritesProvider } from "@/core/context/FavoritesContext";
import { SearchProvider } from "@/core/context/SearchContext";
import { SettingsProvider } from "@/core/context/SettingsContext";
import { ThemeProvider, useTheme } from "@/core/context/ThemeContext";
import { DebugProvider } from "@/core/context/DebugContext";

function StackNavigator() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // We gebruiken onze eigen headers of tabs
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <DebugProvider>
          <FavoritesProvider>
            <SearchProvider>
              <StackNavigator />
            </SearchProvider>
          </FavoritesProvider>
        </DebugProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
