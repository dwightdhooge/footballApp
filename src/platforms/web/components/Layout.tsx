// src/platforms/web/components/Layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";
import { useWebTheme } from "../context/WebThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useWebTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Header />
      <Breadcrumbs />

      <View style={styles.mainContent}>{children}</View>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mainContent: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
