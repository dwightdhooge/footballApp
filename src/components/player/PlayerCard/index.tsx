import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface PlayerCardProps {
  id: number;
  name: string;
  photo: string;
  position: string;
  onPress: () => void;
  onRemove: () => void; // Alleen voor favorites list
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  id,
  name,
  photo,
  position,
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
          photoSize: 24,
          fontSize: 12,
          padding: 8,
        };
      case "medium":
        return {
          width: 140,
          height: 120,
          photoSize: 40,
          fontSize: 14,
          padding: 12,
        };
      case "large":
        return {
          width: 160,
          height: 140,
          photoSize: 48,
          fontSize: 16,
          padding: 16,
        };
      default:
        return {
          width: 140,
          height: 120,
          photoSize: 40,
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

      <View style={styles.photoContainer}>
        <Image
          source={{ uri: photo }}
          style={[
            styles.photo,
            {
              width: sizeStyles.photoSize,
              height: sizeStyles.photoSize,
            },
          ]}
          resizeMode="cover"
          onError={() => {
            console.warn(`Failed to load photo for ${name}`);
          }}
        />
      </View>
      <Text style={[styles.name, { fontSize: sizeStyles.fontSize }]} numberOfLines={2}>
        {name}
      </Text>
      <Text style={[styles.position, { fontSize: sizeStyles.fontSize * 0.8 }]} numberOfLines={1}>
        {position}
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
  photoContainer: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    borderRadius: 20,
  },
  name: {
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 4,
  },
  position: {
    textAlign: "center",
    lineHeight: 16,
  },
});

export default PlayerCard;
