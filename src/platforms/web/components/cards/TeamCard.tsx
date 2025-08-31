import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useWebTheme } from "../../context/WebThemeProvider";

interface TeamCardProps {
  id: number;
  name: string;
  logo: string;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export const TeamCard: React.FC<TeamCardProps> = ({
  id,
  name,
  logo,
  onPress,
  size = "medium",
}) => {
  const { theme } = useWebTheme();

  const styles = getStyles(theme, size);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoPlaceholder}>🏟️</Text>
          )}
        </View>
        <Text style={styles.teamName} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: ReturnType<typeof useWebTheme>["theme"],
  size: string
) =>
  StyleSheet.create({
    container: {
      width: size === "small" ? 120 : size === "medium" ? 160 : 200,
      borderRadius: 12,
      padding: size === "small" ? 12 : size === "medium" ? 16 : 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      minHeight: size === "small" ? 100 : size === "medium" ? 120 : 140,
      position: "relative",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logoContainer: {
      marginBottom: 8,
      width: size === "small" ? 32 : size === "medium" ? 40 : 48,
      height: size === "small" ? 32 : size === "medium" ? 40 : 48,
      borderRadius: size === "small" ? 16 : size === "medium" ? 20 : 24,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: "100%",
      height: "100%",
      borderRadius: size === "small" ? 16 : size === "medium" ? 20 : 24,
    },
    logoPlaceholder: {
      fontSize: size === "small" ? 16 : size === "medium" ? 20 : 24,
    },
    teamName: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
      color: theme.colors.text,
      lineHeight: size === "small" ? 16 : size === "medium" ? 18 : 20,
    },
  });
