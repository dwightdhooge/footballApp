// src/platforms/web/App.tsx
import React from "react";
import { FavoritesProvider } from "@/core/context/FavoritesContext";
import { SearchProvider } from "@/core/context/SearchContext";
import { SettingsProvider } from "@/core/context/SettingsContext";
import { ThemeProvider } from "@/core/context/ThemeContext";
import { DebugProvider } from "@/core/context/DebugContext";
import { HomePage } from "./pages/HomePage";
import "@/i18n"; // Initialize i18n

export const WebApp = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <DebugProvider>
          <FavoritesProvider>
            <SearchProvider>
              <HomePage />
            </SearchProvider>
          </FavoritesProvider>
        </DebugProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};
