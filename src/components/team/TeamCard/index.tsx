import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface TeamCardProps {
  id: number;
  name: string;
  logo: string;
  onPress: () => void;
  onRemove: () => void; // Alleen voor favorites list
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  name,
  logo,
  onPress,
  onRemove,
  size = "medium",
  disabled = false,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          width: 100,
          height: 100,
          logoSize: 24,
          fontSize: 12,
          padding: 8,
        };
      case "medium":
        return {
          width: 140,
          height: 120,
          logoSize: 40,
          fontSize: 14,
          padding: 12,
        };
      case "large":
        return {
          width: 160,
          height: 140,
          logoSize: 48,
          fontSize: 16,
          padding: 16,
        };
      default:
        return {
          width: 140,
          height: 120,
          logoSize: 40,
          fontSize: 14,
          padding: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
          padding: sizeStyles.padding,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.5 : 1,
          marginHorizontal: size === "small" ? 4 : 8, // Kleinere margin voor small size
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Ionicons name="close-circle" size={20} color={theme.colors.error} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logo }}
          style={[
            styles.logo,
            {
              width: sizeStyles.logoSize,
              height: sizeStyles.logoSize,
            },
          ]}
          resizeMode="contain"
          onError={() => {
            console.warn(`Failed to load logo for ${name}`);
          }}
        />
      </View>
      <Text style={[styles.name, { fontSize: sizeStyles.fontSize }]} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    borderRadius: 8,
  },
  name: {
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default TeamCard;
