import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useWebTheme } from "../context/WebThemeProvider";
import { useWebSettings } from "../context/WebSettingsProvider";

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
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

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

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
          <Text style={styles.sectionTitle}>{t("settings.appInfo.title")}</Text>

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
  );
};

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      flex: 1,
    },
    headerSpacer: {
      width: 40, // Same width as back button for centering
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
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
