# Theming & Styling

## 🎯 Theming Overview

### Gebruikersdoelen

- **Consistente styling** door gecentraliseerde theming
- **Dark/Light mode** support met automatische detectie
- **Platform-specifieke optimalisaties** voor mobile en web
- **Herbruikbare styling patterns** door getStyles approach
- **Type-safe styling** met TypeScript interfaces

## 🏗 Technical Implementation

### Theme Structure

```typescript
// Theme configuration interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    button: TextStyle;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Light theme
const lightTheme: Theme = {
  colors: {
    primary: "#4CAF50",
    secondary: "#2196F3",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
    accent: "#FF9800",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    info: "#2196F3",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold",
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: "normal",
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "normal",
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: "normal",
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },
};

// Dark theme
const darkTheme: Theme = {
  colors: {
    primary: "#66BB6A",
    secondary: "#42A5F5",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#B0B0B0",
    border: "#333333",
    accent: "#FFB74D",
    error: "#EF5350",
    success: "#66BB6A",
    warning: "#FFB74D",
    info: "#42A5F5",
  },
  spacing: lightTheme.spacing, // Same spacing
  typography: lightTheme.typography, // Same typography
  borderRadius: lightTheme.borderRadius, // Same border radius
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  breakpoints: lightTheme.breakpoints, // Same breakpoints
};
```

### getStyles Pattern

#### Basic Usage

```typescript
// Component with getStyles pattern
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../core/context/ThemeContext";

interface MyComponentProps {
  title: string;
  subtitle?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, subtitle }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

// getStyles function
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
  });

export default MyComponent;
```

#### Advanced Usage with Variants

```typescript
// Component with size variants
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, variant, size, disabled);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// getStyles with variants
const getStyles = (
  theme: Theme,
  variant: "primary" | "secondary" | "outline",
  size: "small" | "medium" | "large",
  disabled: boolean
) =>
  StyleSheet.create({
    button: {
      backgroundColor: getButtonBackgroundColor(theme, variant, disabled),
      borderWidth: variant === "outline" ? 2 : 0,
      borderColor: variant === "outline" ? theme.colors.primary : "transparent",
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: getButtonPadding(size, theme),
      paddingVertical: getButtonPaddingVertical(size, theme),
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
      ...theme.shadows.sm,
    },
    text: {
      ...theme.typography.button,
      color: getButtonTextColor(theme, variant, disabled),
    },
  });

// Helper functions
const getButtonBackgroundColor = (
  theme: Theme,
  variant: "primary" | "secondary" | "outline",
  disabled: boolean
): string => {
  if (disabled) return theme.colors.border;

  switch (variant) {
    case "primary":
      return theme.colors.primary;
    case "secondary":
      return theme.colors.secondary;
    case "outline":
      return "transparent";
    default:
      return theme.colors.primary;
  }
};

const getButtonTextColor = (
  theme: Theme,
  variant: "primary" | "secondary" | "outline",
  disabled: boolean
): string => {
  if (disabled) return theme.colors.textSecondary;

  switch (variant) {
    case "primary":
    case "secondary":
      return "#FFFFFF";
    case "outline":
      return theme.colors.primary;
    default:
      return "#FFFFFF";
  }
};

const getButtonPadding = (
  size: "small" | "medium" | "large",
  theme: Theme
): number => {
  switch (size) {
    case "small":
      return theme.spacing.sm;
    case "medium":
      return theme.spacing.md;
    case "large":
      return theme.spacing.lg;
    default:
      return theme.spacing.md;
  }
};

const getButtonPaddingVertical = (
  size: "small" | "medium" | "large",
  theme: Theme
): number => {
  switch (size) {
    case "small":
      return theme.spacing.xs;
    case "medium":
      return theme.spacing.sm;
    case "large":
      return theme.spacing.md;
    default:
      return theme.spacing.sm;
  }
};
```

### Theme Context

#### Context Provider

```typescript
// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, Theme } from "../styles/theme";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  currentThemeMode: "light" | "dark" | "auto";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "auto">("auto");
  const [isDark, setIsDark] = useState(false);

  // Determine current theme
  const getCurrentTheme = (): Theme => {
    if (themeMode === "auto") {
      return colorScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  };

  // Update theme when mode or color scheme changes
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    setIsDark(currentTheme === darkTheme);
  }, [themeMode, colorScheme]);

  const theme = getCurrentTheme();

  const toggleTheme = () => {
    setThemeMode(isDark ? "light" : "dark");
  };

  const setTheme = (mode: "light" | "dark" | "auto") => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
        currentThemeMode: themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
```

#### Usage in Components

```typescript
// Using theme in components
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../core/context/ThemeContext";

const MyComponent: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Current theme: {isDark ? "Dark" : "Light"}
      </Text>
      <TouchableOpacity onPress={toggleTheme} style={styles.button}>
        <Text style={styles.buttonText}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
    },
    buttonText: {
      ...theme.typography.button,
      color: "#FFFFFF",
    },
  });
```

### Platform-Specific Theming

#### Mobile Platform

```typescript
// Mobile-specific theme extensions
interface MobileTheme extends Theme {
  platform: {
    statusBar: {
      backgroundColor: string;
      barStyle: "light-content" | "dark-content";
    };
    navigation: {
      headerBackground: string;
      headerTint: string;
      tabBarBackground: string;
      tabBarActiveTint: string;
      tabBarInactiveTint: string;
    };
  };
}

// Mobile theme with platform-specific properties
const mobileLightTheme: MobileTheme = {
  ...lightTheme,
  platform: {
    statusBar: {
      backgroundColor: lightTheme.colors.primary,
      barStyle: "light-content",
    },
    navigation: {
      headerBackground: lightTheme.colors.surface,
      headerTint: lightTheme.colors.text,
      tabBarBackground: lightTheme.colors.surface,
      tabBarActiveTint: lightTheme.colors.primary,
      tabBarInactiveTint: lightTheme.colors.textSecondary,
    },
  },
};

const mobileDarkTheme: MobileTheme = {
  ...darkTheme,
  platform: {
    statusBar: {
      backgroundColor: darkTheme.colors.primary,
      barStyle: "dark-content",
    },
    navigation: {
      headerBackground: darkTheme.colors.surface,
      headerTint: darkTheme.colors.text,
      tabBarBackground: darkTheme.colors.surface,
      tabBarActiveTint: darkTheme.colors.primary,
      tabBarInactiveTint: darkTheme.colors.textSecondary,
    },
  },
};
```

#### Web Platform

```typescript
// Web-specific theme extensions
interface WebTheme extends Theme {
  platform: {
    responsive: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    css: {
      variables: Record<string, string>;
      mediaQueries: Record<string, string>;
    };
  };
}

// Web theme with platform-specific properties
const webLightTheme: WebTheme = {
  ...lightTheme,
  platform: {
    responsive: {
      mobile: `@media (max-width: ${lightTheme.breakpoints.mobile}px)`,
      tablet: `@media (min-width: ${
        lightTheme.breakpoints.mobile + 1
      }px) and (max-width: ${lightTheme.breakpoints.tablet}px)`,
      desktop: `@media (min-width: ${lightTheme.breakpoints.tablet + 1}px)`,
    },
    css: {
      variables: {
        "--primary-color": lightTheme.colors.primary,
        "--secondary-color": lightTheme.colors.secondary,
        "--background-color": lightTheme.colors.background,
        "--text-color": lightTheme.colors.text,
        "--border-color": lightTheme.colors.border,
        "--spacing-xs": `${lightTheme.spacing.xs}px`,
        "--spacing-sm": `${lightTheme.spacing.sm}px`,
        "--spacing-md": `${lightTheme.spacing.md}px`,
        "--spacing-lg": `${lightTheme.spacing.lg}px`,
        "--spacing-xl": `${lightTheme.spacing.xl}px`,
        "--spacing-xxl": `${lightTheme.spacing.xxl}px`,
      },
      mediaQueries: {
        mobile: `@media (max-width: ${lightTheme.breakpoints.mobile}px)`,
        tablet: `@media (min-width: ${
          lightTheme.breakpoints.mobile + 1
        }px) and (max-width: ${lightTheme.breakpoints.tablet}px)`,
        desktop: `@media (min-width: ${lightTheme.breakpoints.tablet + 1}px)`,
      },
    },
  },
};

const webDarkTheme: WebTheme = {
  ...darkTheme,
  platform: {
    responsive: {
      mobile: `@media (max-width: ${darkTheme.breakpoints.mobile}px)`,
      tablet: `@media (min-width: ${
        darkTheme.breakpoints.mobile + 1
      }px) and (max-width: ${darkTheme.breakpoints.tablet}px)`,
      desktop: `@media (min-width: ${darkTheme.breakpoints.tablet + 1}px)`,
    },
    css: {
      variables: {
        "--primary-color": darkTheme.colors.primary,
        "--secondary-color": darkTheme.colors.secondary,
        "--background-color": darkTheme.colors.background,
        "--text-color": darkTheme.colors.text,
        "--border-color": darkTheme.colors.border,
        "--spacing-xs": `${darkTheme.spacing.xs}px`,
        "--spacing-sm": `${darkTheme.spacing.sm}px`,
        "--spacing-md": `${darkTheme.spacing.md}px`,
        "--spacing-lg": `${darkTheme.spacing.lg}px`,
        "--spacing-xl": `${darkTheme.spacing.xl}px`,
        "--spacing-xxl": `${darkTheme.spacing.xxl}px`,
      },
      mediaQueries: {
        mobile: `@media (max-width: ${darkTheme.breakpoints.mobile}px)`,
        tablet: `@media (min-width: ${
          darkTheme.breakpoints.mobile + 1
        }px) and (max-width: ${darkTheme.breakpoints.tablet}px)`,
        desktop: `@media (min-width: ${darkTheme.spacing.tablet + 1}px)`,
      },
    },
  },
};
```

### Responsive Design

#### Breakpoint Utilities

```typescript
// Responsive utilities
const useResponsive = () => {
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      });
    };

    updateDimensions();
    Dimensions.addEventListener("change", updateDimensions);

    return () => {
      // Cleanup for newer React Native versions
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener("change", updateDimensions);
      }
    };
  }, []);

  const isMobile = dimensions.width <= theme.breakpoints.mobile;
  const isTablet =
    dimensions.width > theme.breakpoints.mobile &&
    dimensions.width <= theme.breakpoints.tablet;
  const isDesktop = dimensions.width > theme.breakpoints.tablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    dimensions,
  };
};

// Responsive component example
const ResponsiveComponent: React.FC = () => {
  const { theme } = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const styles = getStyles(theme, { isMobile, isTablet, isDesktop });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responsive Component</Text>
      <Text style={styles.subtitle}>
        {isMobile && "Mobile View"}
        {isTablet && "Tablet View"}
        {isDesktop && "Desktop View"}
      </Text>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  responsive: { isMobile: boolean; isTablet: boolean; isDesktop: boolean }
) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: responsive.isMobile ? theme.spacing.sm : theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      fontSize: responsive.isMobile ? 20 : responsive.isTablet ? 24 : 28,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: responsive.isMobile ? 14 : 16,
    },
  });
```

## 🧪 Quality Considerations

### Edge Cases

- **Theme Switching**: Smooth transitions between themes
- **Platform Detection**: Proper theme selection per platform
- **Color Contrast**: Accessibility compliance
- **Fallback Values**: Default values for missing theme properties
- **Performance**: Efficient theme updates

### Performance Optimizations

- **Theme Caching**: Cache computed styles
- **Lazy Loading**: Load theme variants on demand
- **Memoization**: Memoize getStyles results
- **Style Deduplication**: Avoid duplicate style objects

### Error Handling

- **Missing Theme Properties**: Fallback to default values
- **Invalid Theme Data**: Validation and error reporting
- **Platform Mismatch**: Graceful degradation
- **Theme Loading Errors**: Fallback themes

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Theme switching werkt correct
- [ ] Dark/light mode support
- [ ] Platform-specific theming
- [ ] Responsive design support
- [ ] Type-safe theme usage
- [ ] Consistent styling across app

### Non-Functional Requirements

- [ ] Theme switching performance < 100ms
- [ ] Memory efficient theme storage
- [ ] Accessibility compliance
- [ ] Cross-platform consistency

### UI Requirements

- [ ] Smooth theme transitions
- [ ] Consistent color schemes
- [ ] Proper contrast ratios
- [ ] Platform-specific optimizations

## 🔧 Usage Examples

### Basic Component Styling

```typescript
const Card: React.FC<CardProps> = ({ title, content }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.md,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    content: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });
```

### Variant-Based Styling

```typescript
const Badge: React.FC<BadgeProps> = ({ text, variant = "default" }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, variant);

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  variant: "default" | "success" | "warning" | "error"
) =>
  StyleSheet.create({
    badge: {
      backgroundColor: getBadgeColor(theme, variant),
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
    },
    text: {
      ...theme.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

const getBadgeColor = (
  theme: Theme,
  variant: "default" | "success" | "warning" | "error"
): string => {
  switch (variant) {
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "error":
      return theme.colors.error;
    default:
      return theme.colors.secondary;
  }
};
```

### Responsive Styling

```typescript
const Grid: React.FC<GridProps> = ({ children }) => {
  const { theme } = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const styles = getStyles(theme, { isMobile, isTablet, isDesktop });

  return <View style={styles.grid}>{children}</View>;
};

const getStyles = (
  theme: Theme,
  responsive: { isMobile: boolean; isTablet: boolean; isDesktop: boolean }
) =>
  StyleSheet.create({
    grid: {
      flexDirection: responsive.isMobile ? "column" : "row",
      gap: responsive.isMobile ? theme.spacing.sm : theme.spacing.md,
      padding: responsive.isMobile ? theme.spacing.sm : theme.spacing.md,
    },
  });
```
