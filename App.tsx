import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SearchProvider } from "@/context/SearchContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { DebugProvider } from "@/context/DebugContext";
import BottomTabsNavigator from "@/navigation/bottom-tabs";
import "@/i18n"; // Initialize i18n

export default function App() {
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
}
