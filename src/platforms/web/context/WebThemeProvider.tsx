import React, { createContext, useContext } from "react";
import { createTheme, Theme, ThemeMode } from "@/shared/styles/theme";
import { useWebSettings } from "./WebSettingsProvider";

interface WebThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
}

const WebThemeContext = createContext<WebThemeContextType | undefined>(
  undefined
);

export const WebThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getCurrentTheme } = useWebSettings();
  const themeMode = getCurrentTheme();
  const theme = createTheme(themeMode);

  return (
    <WebThemeContext.Provider value={{ theme, themeMode }}>
      {children}
    </WebThemeContext.Provider>
  );
};

export const useWebTheme = (): WebThemeContextType => {
  const context = useContext(WebThemeContext);
  if (context === undefined) {
    throw new Error("useWebTheme must be used within a WebThemeProvider");
  }
  return context;
};
