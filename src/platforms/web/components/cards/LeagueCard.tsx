import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useWebTheme } from "../../context/WebThemeProvider";

interface LeagueCardProps {
  id: number;
  name: string;
  logo: string;
  type: "League" | "Cup";
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  id,
  name,
  logo,
  type,
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
            <Text style={styles.logoPlaceholder}>
              {type === "League" ? "⚽" : "🏆"}
            </Text>
          )}
        </View>
        <Text style={styles.leagueName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
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
    leagueName: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: size === "small" ? 16 : size === "medium" ? 18 : 20,
    },
    typeContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.primary + "15",
    },
    typeText: {
      fontSize: size === "small" ? 10 : size === "medium" ? 11 : 12,
      color: theme.colors.primary,
      fontWeight: "600",
      textTransform: "uppercase",
    },
  });
