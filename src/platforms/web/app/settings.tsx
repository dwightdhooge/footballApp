// src/platforms/web/app/settings.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useWebTheme } from "../context/WebThemeProvider";
import { useWebSettings } from "../context/WebSettingsProvider";
import { Layout } from "../components/Layout";

export default function SettingsPage() {
  const { theme } = useWebTheme();
  const { t } = useTranslation();
  const {
    isAutoTheme,
    manualTheme,
    toggleAutoTheme,
    setManualTheme,
  } = useWebSettings();

  const handleAutoThemeToggle = () => {
    toggleAutoTheme();
  };

  const handleManualThemeChange = (newTheme: "light" | "dark") => {
    setManualTheme(newTheme);
  };

  const handleBack = () => {
    router.back();
  };

  const styles = getStyles(theme);

  return (
    <Layout>
      <View style={styles.mainContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>{t("settings.title")}</Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("settings.theme.title")}</Text>

            {/* Auto Theme Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>
                  {t("settings.theme.auto")}
                </Text>
                <Text style={styles.settingDescription}>
                  {t("settings.theme.autoDescription")}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isAutoTheme ? styles.toggleActive : styles.toggleInactive,
                ]}
                onPress={handleAutoThemeToggle}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isAutoTheme
                      ? styles.toggleThumbActive
                      : styles.toggleThumbInactive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Manual Theme Selection */}
            {!isAutoTheme && (
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    {t("settings.theme.manual")}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {t("settings.theme.manualDescription")}
                  </Text>
                </View>
                <View style={styles.themeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      manualTheme === "light"
                        ? styles.themeButtonActive
                        : styles.themeButtonInactive,
                    ]}
                    onPress={() => handleManualThemeChange("light")}
                  >
                    <Text
                      style={[
                        styles.themeButtonText,
                        manualTheme === "light"
                          ? styles.themeButtonTextActive
                          : styles.themeButtonTextInactive,
                      ]}
                    >
                      {t("settings.theme.light")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      manualTheme === "dark"
                        ? styles.themeButtonActive
                        : styles.themeButtonInactive,
                    ]}
                    onPress={() => handleManualThemeChange("dark")}
                  >
                    <Text
                      style={[
                        styles.themeButtonText,
                        manualTheme === "dark"
                          ? styles.themeButtonTextActive
                          : styles.themeButtonTextInactive,
                      ]}
                    >
                      {t("settings.theme.dark")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("settings.appInfo.title")}
            </Text>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("settings.appInfo.version")}
              </Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t("settings.appInfo.build")}
              </Text>
              <Text style={styles.settingValue}>1</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignSelf: "flex-start",
    },
    backText: {
      marginLeft: 8,
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "500",
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: 16,
    },
    settingItem: {
      marginBottom: 24,
    },
    settingInfo: {
      marginBottom: 8,
    },
    settingLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    settingDescription: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    settingValue: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    toggleButton: {
      width: 48,
      height: 24,
      borderRadius: 12,
      padding: 2,
      alignSelf: "flex-start",
    },
    toggleActive: {
      backgroundColor: theme.colors.primary,
    },
    toggleInactive: {
      backgroundColor: theme.colors.border,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
    },
    toggleThumbActive: {
      transform: [{ translateX: 24 }],
    },
    toggleThumbInactive: {
      transform: [{ translateX: 0 }],
    },
    themeButtons: {
      flexDirection: "row",
      gap: 12,
    },
    themeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      minWidth: 80,
      alignItems: "center",
    },
    themeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    themeButtonInactive: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    themeButtonText: {
      ...theme.typography.small,
      fontWeight: "600",
    },
    themeButtonTextActive: {
      color: theme.colors.onPrimary,
    },
    themeButtonTextInactive: {
      color: theme.colors.text,
    },
  });
