import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import {
  AutoThemeSwitch,
  ManualThemeSelector,
  AppVersionSection,
  CacheManagement,
} from "@/components";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    isAutoTheme,
    currentTheme,
    appVersion,
    buildNumber,
    toggleAutoTheme,
    setManualTheme,
    getCurrentThemeForDisplay,
  } = useSettings();

  const currentThemeForDisplay = getCurrentThemeForDisplay();
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
          <Text style={styles.headerTitle}>{t("settings.title")}</Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.theme")}</Text>

          {/* Auto Theme Switch */}
          <AutoThemeSwitch
            isAutoTheme={isAutoTheme}
            onToggle={toggleAutoTheme}
            subtitle={t("settings.autoTheme")}
          />

          {/* Manual Theme Selector */}
          <ManualThemeSelector
            currentTheme={currentThemeForDisplay}
            onSelectTheme={setManualTheme}
            disabled={isAutoTheme}
            isReadOnly={isAutoTheme}
          />
        </View>

        {/* Cache Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <CacheManagement />
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.about")}</Text>

          <AppVersionSection
            appVersion={appVersion}
            buildNumber={buildNumber}
            subtitle={t("homescreen.title")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default SettingsScreen;
