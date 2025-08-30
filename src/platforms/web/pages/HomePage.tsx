// src/platforms/web/pages/HomePage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212121",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  loading: {
    fontSize: 18,
    color: "#666",
  },
  error: {
    fontSize: 18,
    color: "#f44336",
  },
});
