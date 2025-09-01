// src/platforms/web/components/Breadcrumbs.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWebTheme } from "../context/WebThemeProvider";

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useWebTheme();
  const styles = getStyles(theme);

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const getSegmentTitle = (segment: string) => {
    switch (segment) {
      case "search":
        return "Search";
      case "settings":
        return "Settings";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const handleSegmentPress = (segment: string, index: number) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="home" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.homeText}>Home</Text>
      </TouchableOpacity>

      {segments.map((segment, index) => (
        <View key={index} style={styles.segmentContainer}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textSecondary}
          />
          <TouchableOpacity
            style={styles.segmentButton}
            onPress={() => handleSegmentPress(segment, index)}
          >
            <Text style={styles.segmentText}>{getSegmentTitle(segment)}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    homeButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    homeText: {
      marginLeft: 4,
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    segmentContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 8,
    },
    segmentButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    segmentText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });
