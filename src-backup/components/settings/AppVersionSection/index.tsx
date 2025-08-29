import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useDebug } from "@/context/DebugContext";

interface AppVersionSectionProps {
  appVersion: string;
  buildNumber: string;
  subtitle?: string;
}

const AppVersionSection: React.FC<AppVersionSectionProps> = ({
  appVersion,
  buildNumber,
  subtitle,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showDebugTab } = useDebug();

  const styles = getStyles(theme);

  const handleLongPress = () => {
    showDebugTab();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="information-circle"
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("settings.version")}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {appVersion} ({buildNumber})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
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
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.small.fontSize,
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
    },
    versionContainer: {
      marginLeft: theme.spacing.sm,
    },
    versionText: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
  });

export default AppVersionSection;
