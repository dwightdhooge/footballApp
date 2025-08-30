import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CountryCardProps } from "@/types/components";
import { FlagSvg } from "./FlagSvg";
import { useTheme } from "@/context/ThemeContext";

export const CountryCard: React.FC<CountryCardProps> = ({
  name,
  code,
  flag,
  onPress,
  onRemove,
  size = "medium",
  disabled = false,
}) => {
  const { theme } = useTheme();

  const styles = getStyles(theme, size);
  const flagSize = theme.cards[size as keyof typeof theme.cards].logoSize;

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      )}

      <View style={styles.contentContainer}>
        <FlagSvg url={flag} size={flagSize} />
        <Text style={styles.countryName} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: string) =>
  StyleSheet.create({
    container: {
      width: theme.cards[size as keyof typeof theme.cards].width,
      borderRadius: 12,
      padding: size === "small" ? 8 : 16, // Kleinere padding voor small size
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
      minHeight: theme.cards[size as keyof typeof theme.cards].height,
      position: "relative",
      marginHorizontal: size === "small" ? 4 : 8, // Kleinere margin voor small size
    },
    removeButton: {
      position: "absolute",
      top: 8,
      right: 8,
      zIndex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    countryName: {
      textAlign: "center",
      fontWeight: "600",
      lineHeight:
        theme.cards[size as keyof typeof theme.cards].lineHeight *
        theme.cards[size as keyof typeof theme.cards].fontSize,
      marginTop: 8,
      fontSize: theme.cards[size as keyof typeof theme.cards].fontSize,
      color: theme.colors.text,
    },
    disabled: {
      opacity: 0.5,
    },
  });
