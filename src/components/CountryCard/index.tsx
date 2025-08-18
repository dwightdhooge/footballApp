import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CountryCardProps } from "@/types/components";
import FlagSvg from "@/components/FlagSvg";
import { useTheme } from "@/context/ThemeContext";

const CountryCard: React.FC<CountryCardProps> = ({
  name,
  code,
  flag,
  isFavorite,
  onPress,
  onHeartPress,
  size = "medium",
  showHeart = true,
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
      {showHeart && (
        <TouchableOpacity
          style={styles.heartButton}
          onPress={onHeartPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
          />
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
      padding: 16,
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
    },
    heartButton: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
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

export default CountryCard;
