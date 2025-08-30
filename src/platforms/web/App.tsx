// src/platforms/web/App.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HomePage } from "./pages/HomePage";

export const WebApp = () => {
  return <HomePage />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212121",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});
