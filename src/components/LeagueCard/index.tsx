import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { League } from "../../types/api";
import { useTheme } from "@/context/ThemeContext";

interface LeagueCardProps {
  id: number;
  name: string;
  logo: string;
  type: "League" | "Cup";
  onPress: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  id,
  name,
  logo,
  type,
  onPress,
  size = "medium",
  disabled = false,
}) => {
  const { theme } = useTheme();

  const styles = getStyles(theme, size);

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: logo }}
        style={styles.logo}
        resizeMode="contain"
        onError={() => {
          // Fallback to placeholder if logo fails to load
          console.warn(`Failed to load logo for ${name}`);
        }}
      />
      <Text style={styles.name} numberOfLines={3} ellipsizeMode="tail">
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: string) =>
  StyleSheet.create({
    container: {
      width: theme.cards[size as keyof typeof theme.cards].width,
      marginHorizontal: theme.spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      minHeight: theme.cards[size as keyof typeof theme.cards].height,
    },
    logo: {
      width: theme.cards[size as keyof typeof theme.cards].logoSize,
      height: theme.cards[size as keyof typeof theme.cards].logoSize,
      marginBottom: theme.spacing.sm,
    },
    name: {
      fontSize: theme.cards[size as keyof typeof theme.cards].fontSize,
      fontWeight: "600",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight:
        theme.cards[size as keyof typeof theme.cards].lineHeight *
        theme.cards[size as keyof typeof theme.cards].fontSize,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default LeagueCard;
