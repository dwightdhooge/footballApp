import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "@/core/context/FavoritesContext";
import { SearchProvider } from "@/core/context/SearchContext";
import { SettingsProvider } from "@/core/context/SettingsContext";
import { ThemeProvider } from "@/core/context/ThemeContext";
import { DebugProvider } from "@/core/context/DebugContext";
import { BottomTabsNavigator } from "@/navigation/bottom-tabs/BottomTabsNavigator";
import "@/i18n"; // Initialize i18n

export const App = () => {
  return (
    <NavigationContainer>
      <SettingsProvider>
        <ThemeProvider>
          <DebugProvider>
            <FavoritesProvider>
              <SearchProvider>
                <StatusBar style="auto" />
                <BottomTabsNavigator />
              </SearchProvider>
            </FavoritesProvider>
          </DebugProvider>
        </ThemeProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
};
