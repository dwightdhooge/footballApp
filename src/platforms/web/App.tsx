// src/platforms/web/App.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { WebThemeProvider } from "./context/WebThemeProvider";
import { WebSettingsProvider } from "./context/WebSettingsProvider";
import { SearchProvider } from "@/context/SearchContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { HomePage } from "./pages/HomePage";

// Web-specific theme provider that forces light theme
const WebAppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WebSettingsProvider>
      <WebThemeProvider>{children}</WebThemeProvider>
    </WebSettingsProvider>
  );
};

export default function App() {
  return (
    <WebAppProvider>
      <SearchProvider>
        <FavoritesProvider>
          <View style={styles.container}>
            <HomePage />
          </View>
        </FavoritesProvider>
      </SearchProvider>
    </WebAppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Force white background
  },
});
