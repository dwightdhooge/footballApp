import React, { createContext, useContext } from "react";
import { createTheme, Theme, ThemeMode } from "@/styles/theme";
import { useSettings } from "./SettingsContext";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getCurrentTheme } = useSettings();
  const themeMode = getCurrentTheme();
  const theme = createTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ theme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
