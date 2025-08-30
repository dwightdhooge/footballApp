import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface TeamCardProps {
  id: number;
  name: string;
  logo: string;
  onPress: () => void;
  onRemove?: () => void; // Made optional
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  id,
  name,
  logo,
  onPress,
  onRemove,
  size = "medium",
  disabled = false,
}) => {
  const { theme } = useTheme();

  const styles = getStyles(theme, size);

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
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      )}

      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logo }}
          style={styles.logo}
          resizeMode="contain"
          onError={() => {
            console.warn(`Failed to load logo for ${name}`);
          }}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: string) =>
  StyleSheet.create({
    container: {
      width: size === "small" ? 100 : size === "large" ? 160 : 140,
      height: size === "small" ? 100 : size === "large" ? 140 : 120,
      padding: size === "small" ? 8 : size === "large" ? 16 : 12,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      marginHorizontal: size === "small" ? 4 : 8,
    },
    disabled: {
      opacity: 0.5,
    },
    removeButton: {
      position: "absolute",
      top: 4,
      right: 4,
      zIndex: 1,
    },
    logoContainer: {
      marginBottom: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: size === "small" ? 24 : size === "large" ? 48 : 40,
      height: size === "small" ? 24 : size === "large" ? 48 : 40,
      borderRadius: 8,
    },
    name: {
      fontWeight: "600",
      textAlign: "center",
      lineHeight: 18,
      fontSize: size === "small" ? 12 : size === "large" ? 16 : 14,
      color: theme.colors.text,
    },
  });
