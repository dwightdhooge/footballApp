import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SearchProvider } from "@/context/SearchContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import BottomTabsNavigator from "@/navigation/bottom-tabs";
import "@/i18n"; // Initialize i18n

export default function App() {
  return (
    <NavigationContainer>
      <SettingsProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <SearchProvider>
              <StatusBar style="auto" />
              <BottomTabsNavigator />
            </SearchProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
}
