import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface PlayerCardProps {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  photo: string;
  position: string;
  onPress: () => void;
  onRemove: () => void; // Alleen voor favorites list
  disabled?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  id,
  name,
  firstname,
  lastname,
  photo,
  position,
  onPress,
  onRemove,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
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
          style={styles.photo}
          resizeMode="cover"
          onError={() => {
            console.warn(`Failed to load photo for ${name}`);
          }}
        />
      </View>

      {firstname && lastname ? (
        <>
          <Text style={styles.firstname} numberOfLines={1}>
            {firstname}
          </Text>
          <Text style={styles.lastname} numberOfLines={1}>
            {lastname}
          </Text>
        </>
      ) : (
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      )}

      <Text style={styles.position} numberOfLines={1}>
        {position}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      width: 100,
      height: 100,
      padding: theme.spacing.sm,
      borderRadius: theme.spacing.md,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      marginHorizontal: theme.spacing.sm,
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
      width: 24,
      height: 24,
      borderRadius: theme.spacing.lg,
    },
    name: {
      textAlign: "center",
      lineHeight: theme.typography.caption.fontSize * 1.3,
      marginBottom: theme.spacing.xs,
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
      fontWeight: theme.fontWeight.semibold,
    },
    firstname: {
      textAlign: "center",
      lineHeight: theme.typography.caption.fontSize * 1.3,
      marginBottom: theme.spacing.xs,
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
      fontWeight: theme.fontWeight.semibold,
    },
    lastname: {
      textAlign: "center",
      lineHeight: theme.typography.caption.fontSize * 1.3,
      marginBottom: theme.spacing.xs,
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
      fontWeight: theme.fontWeight.semibold,
    },
    position: {
      textAlign: "center",
      lineHeight: theme.typography.caption.fontSize * 1.3,
      fontSize: theme.typography.caption.fontSize * 0.8,
      color: theme.colors.info,
    },
  });

export default PlayerCard;
