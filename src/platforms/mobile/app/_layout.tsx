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
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="country/[code]"
        options={{
          headerShown: true,
          title: "Country Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="league/[id]"
        options={{
          headerShown: true,
          title: "League Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="cup/[id]"
        options={{
          headerShown: true,
          title: "Cup Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="match/[id]"
        options={{
          headerShown: true,
          title: "Match Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="team/[id]"
        options={{
          headerShown: true,
          title: "Team Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="player/[id]"
        options={{
          headerShown: true,
          title: "Player Details",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: true,
          title: "Search",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
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
