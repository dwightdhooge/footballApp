import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface PlaceholderStateProps {
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const PlaceholderState: React.FC<PlaceholderStateProps> = ({
  message,
  icon,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Ionicons name={icon} size={48} color={theme.colors.textSecondary} />
      </View>

      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    message: {
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
      lineHeight: theme.typography.body.fontSize * 1.5,
      maxWidth: 280,
    },
  });
