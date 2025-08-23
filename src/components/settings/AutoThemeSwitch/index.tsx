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

const AutoThemeSwitch: React.FC<AutoThemeSwitchProps> = ({
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
      borderRadius: 8,
      marginHorizontal: 16,
      marginVertical: 4,
      padding: 16,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      marginRight: 8,
      width: 24,
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginLeft: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      marginTop: 4,
      color: theme.colors.textSecondary,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default AutoThemeSwitch;
