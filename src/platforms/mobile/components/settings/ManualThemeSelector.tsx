import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

interface ManualThemeSelectorProps {
  currentTheme: "light" | "dark";
  onSelectTheme: (theme: "light" | "dark") => void;
  disabled?: boolean;
  isReadOnly?: boolean;
}

export const ManualThemeSelector: React.FC<ManualThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  disabled = false,
  isReadOnly = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDisabled = disabled || isReadOnly;

  const styles = getStyles(theme, currentTheme, isDisabled);

  return (
    <View style={[styles.container, isDisabled && styles.disabled]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="color-palette"
            size={20}
            color={
              isDisabled ? theme.colors.textSecondary : theme.colors.primary
            }
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("settings.theme.title")}</Text>
          <Text style={styles.subtitle}>
            {isReadOnly ? t("settings.autoTheme") : t("settings.theme.title")}
          </Text>
        </View>
      </View>

      <View style={styles.themeOptions}>
        <TouchableOpacity
          style={[
            styles.themeOption,
            currentTheme === "light" && styles.lightThemeActive,
            isDisabled && styles.disabledOption,
          ]}
          onPress={() => !isDisabled && onSelectTheme("light")}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <View style={styles.themePreview}>
            <View style={styles.lightPreview}>
              <View style={styles.lightHeader} />
              <View style={styles.lightContent} />
            </View>
          </View>
          <Text
            style={[
              styles.themeLabel,
              currentTheme === "light" && styles.activeThemeLabel,
              isDisabled && styles.disabledThemeLabel,
            ]}
          >
            {t("settings.lightTheme")}
          </Text>
          {currentTheme === "light" && !isDisabled && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.primary}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeOption,
            currentTheme === "dark" && styles.darkThemeActive,
            isDisabled && styles.disabledOption,
          ]}
          onPress={() => !isDisabled && onSelectTheme("dark")}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <View style={styles.themePreview}>
            <View style={styles.darkPreview}>
              <View style={styles.darkHeader} />
              <View style={styles.darkContent} />
            </View>
          </View>
          <Text
            style={[
              styles.themeLabel,
              currentTheme === "dark" && styles.activeThemeLabel,
              isDisabled && styles.disabledThemeLabel,
            ]}
          >
            {t("settings.darkTheme")}
          </Text>
          {currentTheme === "dark" && !isDisabled && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.primary}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  currentTheme: string,
  isDisabled: boolean
) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
      width: 24,
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginLeft: theme.spacing.xs,
    },
    title: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "500",
      color: isDisabled ? theme.colors.textSecondary : theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.small.fontSize,
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
    },
    themeOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    themeOption: {
      flex: 1,
      alignItems: "center",
      padding: theme.spacing.md,
      borderRadius: theme.spacing.sm,
      borderWidth: 2,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    lightThemeActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    darkThemeActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    disabledOption: {
      opacity: 0.5,
    },
    themePreview: {
      marginBottom: theme.spacing.sm,
    },
    lightPreview: {
      width: 40,
      height: 24,
      borderRadius: theme.spacing.xs,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    lightHeader: {
      height: 6,
      backgroundColor: "#F5F5F5",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lightContent: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    darkPreview: {
      width: 40,
      height: 24,
      borderRadius: theme.spacing.xs,
      backgroundColor: "#212121",
      borderWidth: 1,
      borderColor: "#424242",
      overflow: "hidden",
    },
    darkHeader: {
      height: 6,
      backgroundColor: "#424242",
      borderBottomWidth: 1,
      borderBottomColor: "#616161",
    },
    darkContent: {
      flex: 1,
      backgroundColor: "#212121",
    },
    themeLabel: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: "500",
      color: theme.colors.text,
    },
    activeThemeLabel: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    disabledThemeLabel: {
      color: theme.colors.textSecondary,
    },
    checkIcon: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.xs,
    },
    disabled: {
      opacity: 0.5,
    },
  });
