import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/context/ThemeContext";
import { CacheManagement } from "@/components/common/CacheManagement";

export default function DebugScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("debug.title")}</Text>
          <Text style={styles.headerSubtitle}>{t("debug.subtitle")}</Text>
        </View>

        {/* Cache Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("debug.performance")}</Text>
          <CacheManagement />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    headerTitle: {
      textAlign: "center",
      color: theme.colors.text,
      ...theme.typography.h1,
    },
    headerSubtitle: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      ...theme.typography.body,
      marginTop: theme.spacing.sm,
    },
    section: {
      marginTop: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      ...theme.typography.h3,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
  });
