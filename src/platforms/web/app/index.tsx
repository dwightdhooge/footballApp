// src/platforms/web/app/index.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Layout } from "../components/Layout";
import { useWebTheme } from "../context/WebThemeProvider";

export default function HomePage() {
  const { theme } = useWebTheme();
  const styles = getStyles(theme);

  return (
    <Layout>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Pro Soccer Stats</Text>
        <Text style={styles.subtitle}>
          Discover football data from around the world. Search for countries,
          leagues, teams, or players to get started.
        </Text>
      </View>
    </Layout>
  );
}

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 32,
      textAlign: "center",
      maxWidth: 600,
      color: theme.colors.textSecondary,
      lineHeight: 26,
    },
  });
