import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

interface AutoThemeSwitchProps {
  isAutoTheme: boolean;
  onToggle: () => void;
  disabled?: boolean;
  subtitle?: string;
}

export const AutoThemeSwitch: React.FC<AutoThemeSwitchProps> = ({
  isAutoTheme,
  onToggle,
  disabled = false,
  subtitle,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, disabled);

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="phone-portrait"
            size={20}
            color={disabled ? theme.colors.textSecondary : theme.colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("settings.autoTheme")}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <Switch
          value={isAutoTheme}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={isAutoTheme ? "#FFFFFF" : "#FFFFFF"}
          ios_backgroundColor={theme.colors.border}
        />
      </View>
    </View>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  disabled: boolean
) =>
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
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.small.fontSize,
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
    },
    disabled: {
      opacity: 0.5,
    },
  });
