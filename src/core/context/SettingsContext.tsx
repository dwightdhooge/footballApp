import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Settings Context Types
interface SettingsContextType {
  // Theme Configuration
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
  currentTheme: "light" | "dark";

  // App Information
  appVersion: string;
  buildNumber: string;

  // Actions
  toggleAutoTheme: () => void;
  setManualTheme: (theme: "light" | "dark") => void;
  getCurrentTheme: () => "light" | "dark";
  getCurrentThemeForDisplay: () => "light" | "dark";
}

// Theme Settings Interface
interface ThemeSettings {
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
}

// Create Context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Settings Provider Component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAutoTheme, setIsAutoTheme] = useState<boolean>(true);
  const [manualTheme, setManualThemeState] = useState<"light" | "dark" | null>(
    null
  );
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Get app version
  const getAppVersion = (): { version: string; buildNumber: string } => {
    try {
      return {
        version: Constants.expoConfig?.version || "1.0.0",
        buildNumber: String(
          Constants.expoConfig?.ios?.buildNumber ||
            Constants.expoConfig?.android?.versionCode ||
            "1"
        ),
      };
    } catch (error) {
      console.error("App version detection error:", error);
      return {
        version: "1.0.0",
        buildNumber: "1",
      };
    }
  };

  const { version: appVersion, buildNumber } = getAppVersion();

  // Save theme settings
  const saveThemeSettings = async (settings: ThemeSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem("theme_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Theme settings save error:", error);
    }
  };

  // Load theme settings
  const loadThemeSettings = async (): Promise<ThemeSettings | null> => {
    try {
      const settings = await AsyncStorage.getItem("theme_settings");
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error("Theme settings load error:", error);
    }
    return null;
  };

  // Initialize theme settings
  const initializeTheme = async (): Promise<void> => {
    const settings = await loadThemeSettings();
    if (settings) {
      setIsAutoTheme(settings.isAutoTheme);
      setManualThemeState(settings.manualTheme);

      if (settings.isAutoTheme) {
        const deviceTheme = Appearance.getColorScheme() || "light";
        setCurrentTheme(deviceTheme);
      } else {
        setCurrentTheme(settings.manualTheme || "light");
      }
    }
  };

  // Toggle auto theme
  const toggleAutoTheme = (): void => {
    const newAutoTheme = !isAutoTheme;
    setIsAutoTheme(newAutoTheme);

    if (newAutoTheme) {
      // Switch to auto mode
      setManualThemeState(null);
      // Detect device theme
      const deviceTheme = Appearance.getColorScheme() || "light";
      setCurrentTheme(deviceTheme);
    }

    // Save settings
    saveThemeSettings({
      isAutoTheme: newAutoTheme,
      manualTheme: newAutoTheme ? null : manualTheme,
    });
  };

  // Set manual theme
  const setManualTheme = (theme: "light" | "dark"): void => {
    setManualThemeState(theme);
    setCurrentTheme(theme);
    setIsAutoTheme(false);

    // Save settings
    saveThemeSettings({
      isAutoTheme: false,
      manualTheme: theme,
    });
  };

  // Get current theme for display
  const getCurrentThemeForDisplay = (): "light" | "dark" => {
    if (isAutoTheme) {
      return Appearance.getColorScheme() || "light";
    }
    return manualTheme || "light";
  };

  // Get current theme
  const getCurrentTheme = (): "light" | "dark" => {
    if (isAutoTheme) {
      return Appearance.getColorScheme() || "light";
    }
    return manualTheme || "light";
  };

  // Listen to device theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isAutoTheme) {
        setCurrentTheme(colorScheme || "light");
      }
    });

    return () => subscription?.remove();
  }, [isAutoTheme]);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, []);

  const value: SettingsContextType = {
    isAutoTheme,
    manualTheme,
    currentTheme,
    appVersion,
    buildNumber,
    toggleAutoTheme,
    setManualTheme,
    getCurrentTheme,
    getCurrentThemeForDisplay,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
