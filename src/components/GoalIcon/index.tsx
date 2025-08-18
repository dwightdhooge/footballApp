import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface GoalIconProps {
  isPenalty?: boolean;
  size?: number | "small" | "caption" | "body" | "h3" | "h2" | "h1";
  style?: StyleProp<ViewStyle>;
}

/**
 * Herbruikbare component voor het tonen van goal iconen
 * Ondersteunt zowel gewone goals als penalty goals
 */
const GoalIcon: React.FC<GoalIconProps> = ({
  isPenalty = false,
  size = 12,
  style,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Convert string size to numeric fontSize
  const getFontSize = (): number => {
    if (typeof size === "number") {
      return size;
    }

    // Map string sizes to theme typography sizes
    switch (size) {
      case "small":
        return theme.typography.small.fontSize;
      case "caption":
        return theme.typography.caption.fontSize;
      case "body":
        return theme.typography.body.fontSize;
      case "h3":
        return theme.typography.h3.fontSize;
      case "h2":
        return theme.typography.h2.fontSize;
      case "h1":
        return theme.typography.h1.fontSize;
      default:
        return theme.typography.small.fontSize;
    }
  };

  const fontSize = getFontSize();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.goalIcon, { fontSize }]}>⚽</Text>
      {isPenalty && (
        <Text style={[styles.penaltyIndicator, { fontSize: fontSize * 0.7 }]}>
          P
        </Text>
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    goalIcon: {
      // Default styling voor het goal icoon
    },
    penaltyIndicator: {
      position: "absolute",
      top: -theme.spacing.xs / 2,
      right: -theme.spacing.xs / 2,
      fontWeight: "bold",
      color: theme.colors.warning,
      backgroundColor: theme.colors.text,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs / 2,
      paddingVertical: theme.spacing.xs / 4,
      minWidth: theme.spacing.sm,
      textAlign: "center",
    },
  });

export default GoalIcon;
