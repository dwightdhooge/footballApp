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
  const styles = getStyles(theme, size);

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          width: 100,
          height: 100,
          photoSize: 24,
          fontSize: theme.typography.caption.fontSize,
          padding: theme.spacing.sm,
        };
      case "medium":
        return {
          width: 140,
          height: 120,
          photoSize: 40,
          fontSize: theme.typography.small.fontSize,
          padding: theme.spacing.md,
        };
      case "large":
        return {
          width: 160,
          height: 140,
          photoSize: 48,
          fontSize: theme.typography.body.fontSize,
          padding: theme.spacing.md,
        };
      default:
        return {
          width: 140,
          height: 120,
          photoSize: 40,
          fontSize: theme.typography.small.fontSize,
          padding: theme.spacing.md,
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
          marginHorizontal:
            size === "small" ? theme.spacing.xs : theme.spacing.sm,
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
      <Text
        style={[
          styles.name,
          {
            fontSize: sizeStyles.fontSize,
            color: theme.colors.text,
          },
        ]}
        numberOfLines={2}
      >
        {name}
      </Text>
      <Text
        style={[
          styles.position,
          {
            fontSize: sizeStyles.fontSize * 0.8,
            color: theme.colors.textSecondary,
          },
        ]}
        numberOfLines={1}
      >
        {position}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: string) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.spacing.md,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    removeButton: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      zIndex: 1,
    },
    photoContainer: {
      marginBottom: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    photo: {
      borderRadius: theme.spacing.lg,
    },
    name: {
      fontWeight: "600",
      textAlign: "center",
      lineHeight: theme.typography.small.fontSize * 1.3,
      marginBottom: theme.spacing.xs,
    },
    position: {
      textAlign: "center",
      lineHeight: theme.typography.caption.fontSize * 1.3,
    },
  });

export default PlayerCard;
