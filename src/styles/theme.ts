// Theme colors for light and dark modes
const lightColors = {
  primary: "#4CAF50",
  secondary: "#FF9800",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  text: "#212121",
  textSecondary: "#666666",
  border: "#E0E0E0",
  error: "#F44336",
  success: "#4CAF50",
  warning: "#FF9800",
  info: "#2196F3",
};

const darkColors = {
  primary: "#66BB6A", // Lichtere groen voor betere zichtbaarheid in dark mode
  secondary: "#FFB74D", // Lichtere oranje voor betere zichtbaarheid
  background: "#121212", // Echte dark background
  surface: "#1E1E1E", // Donkere surface
  text: "#FFFFFF", // Witte tekst voor contrast
  textSecondary: "#B0B0B0", // Grijze secundaire tekst
  border: "#2C2C2C", // Donkere borders
  error: "#EF5350", // Lichtere rode voor dark mode
  success: "#66BB6A", // Lichtere groen voor dark mode
  warning: "#FFB74D", // Lichtere oranje voor dark mode
  info: "#42A5F5", // Lichtere blauwe voor dark mode
};

// Export color sets for direct access
export { lightColors, darkColors };

// Theme type
export type ThemeMode = "light" | "dark";

// Export ThemeColors type
export type ThemeColors = typeof lightColors;

// Theme interface
export interface Theme {
  colors: typeof lightColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: "bold";
    };
    h2: {
      fontSize: number;
      fontWeight: "bold";
    };
    h3: {
      fontSize: number;
      fontWeight: "600";
    };
    body: {
      fontSize: number;
      fontWeight: "normal";
    };
    caption: {
      fontSize: number;
      fontWeight: "normal";
    };
    small: {
      fontSize: number;
      fontWeight: "normal";
    };
  };
  cards: {
    small: {
      width: number;
      height: number;
      logoSize: number;
      fontSize: number;
      lineHeight: number;
    };
    medium: {
      width: number;
      height: number;
      logoSize: number;
      fontSize: number;
      lineHeight: number;
    };
    large: {
      width: number;
      height: number;
      logoSize: number;
      fontSize: number;
      lineHeight: number;
    };
  };
}

// Create theme function
export const createTheme = (mode: ThemeMode): Theme => ({
  colors: mode === "light" ? lightColors : darkColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 20,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 18,
      fontWeight: "600",
    },
    body: {
      fontSize: 16,
      fontWeight: "normal",
    },
    caption: {
      fontSize: 12,
      fontWeight: "normal",
    },
    small: {
      fontSize: 12,
      fontWeight: "normal",
    },
  },
  cards: {
    small: {
      width: 100,
      height: 100,
      logoSize: 24,
      fontSize: 12,
      lineHeight: 1.2,
    },
    medium: {
      width: 200,
      height: 200,
      logoSize: 32,
      fontSize: 16,
      lineHeight: 1.4,
    },
    large: {
      width: 300,
      height: 300,
      logoSize: 40,
      fontSize: 20,
      lineHeight: 1.6,
    },
  },
});

// Default theme (light mode for backward compatibility)
export const theme = createTheme("light");
