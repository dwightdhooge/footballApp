// src/platforms/web/app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { WebThemeProvider } from "../context/WebThemeProvider";
import { WebSettingsProvider } from "../context/WebSettingsProvider";
import { SearchProvider } from "@/context/SearchContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <WebSettingsProvider>
      <WebThemeProvider>
        <SearchProvider>
          <FavoritesProvider>
            <Stack
              screenOptions={{
                headerShown: false, // We gebruiken onze eigen Header component
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="search" />
              <Stack.Screen name="settings" />
            </Stack>
          </FavoritesProvider>
        </SearchProvider>
      </WebThemeProvider>
    </WebSettingsProvider>
  );
}
