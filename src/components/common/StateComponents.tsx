import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = "large",
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const displayMessage = message || t("common.loading");

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      <Text style={styles.message}>{displayMessage}</Text>
    </View>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  title,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const displayTitle = title || t("common.error");

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{error}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    icon: {
      fontSize: theme.spacing.xl * 3,
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    message: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: theme.spacing.xl * 1.25,
      marginBottom: theme.spacing.md,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.sm,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    retryText: {
      color: "white",
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "500",
    },
  });
