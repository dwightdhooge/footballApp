import React, { createContext, useContext, useState, useEffect } from "react";

// Web-specific settings context for theme management
interface WebSettingsContextType {
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
  currentTheme: "light" | "dark";
  appVersion: string;
  buildNumber: string;
  toggleAutoTheme: () => void;
  setManualTheme: (theme: "light" | "dark") => void;
  getCurrentTheme: () => "light" | "dark";
  getCurrentThemeForDisplay: () => "light" | "dark";
}

const WebSettingsContext = createContext<WebSettingsContextType | undefined>(
  undefined
);

export const WebSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAutoTheme, setIsAutoTheme] = useState(false);
  const [manualTheme, setManualTheme] = useState<"light" | "dark">("light");

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAutoTheme = localStorage.getItem("web_auto_theme");
    const savedManualTheme = localStorage.getItem("web_manual_theme");

    if (savedAutoTheme !== null) {
      setIsAutoTheme(JSON.parse(savedAutoTheme));
    }
    if (savedManualTheme !== null) {
      setManualTheme(savedManualTheme as "light" | "dark");
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (autoTheme: boolean, theme: "light" | "dark") => {
    if (typeof window === "undefined") return;

    localStorage.setItem("web_auto_theme", JSON.stringify(autoTheme));
    localStorage.setItem("web_manual_theme", theme);
  };

  const toggleAutoTheme = () => {
    const newAutoTheme = !isAutoTheme;
    setIsAutoTheme(newAutoTheme);
    savePreferences(newAutoTheme, manualTheme);
  };

  const updateManualTheme = (theme: "light" | "dark") => {
    setManualTheme(theme);
    savePreferences(isAutoTheme, theme);
  };

  const getCurrentTheme = () => (isAutoTheme ? "light" : manualTheme);

  const value: WebSettingsContextType = {
    isAutoTheme,
    manualTheme,
    currentTheme: getCurrentTheme(),
    appVersion: "1.0.0",
    buildNumber: "1",
    toggleAutoTheme,
    setManualTheme: updateManualTheme,
    getCurrentTheme,
    getCurrentThemeForDisplay: getCurrentTheme,
  };

  return (
    <WebSettingsContext.Provider value={value}>
      {children}
    </WebSettingsContext.Provider>
  );
};

export const useWebSettings = (): WebSettingsContextType => {
  const context = useContext(WebSettingsContext);
  if (context === undefined) {
    throw new Error("useWebSettings must be used within a WebSettingsProvider");
  }
  return context;
};
