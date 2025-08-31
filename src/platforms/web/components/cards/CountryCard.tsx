import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useWebTheme } from "../../context/WebThemeProvider";

interface CountryCardProps {
  name: string;
  code: string;
  flag: string;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export const CountryCard: React.FC<CountryCardProps> = ({
  name,
  code,
  flag,
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
        <View style={styles.flagContainer}>
          {flag ? (
            <Image
              source={{ uri: flag }}
              style={styles.flag}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.flagEmoji}>{getFlagEmoji(code)}</Text>
          )}
        </View>
        <Text style={styles.countryName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.countryCode}>{code}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
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
    flagContainer: {
      marginBottom: 8,
    },
    flag: {
      width: "100%",
      height: "100%",
      borderRadius: size === "small" ? 16 : size === "medium" ? 20 : 24,
    },
    flagEmoji: {
      fontSize: size === "small" ? 24 : size === "medium" ? 32 : 40,
    },
    countryName: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: size === "small" ? 16 : size === "medium" ? 18 : 20,
    },
    countryCode: {
      textAlign: "center",
      fontSize: size === "small" ? 10 : size === "medium" ? 11 : 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });
