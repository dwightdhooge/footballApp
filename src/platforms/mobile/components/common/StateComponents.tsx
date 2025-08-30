import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  actionLabel,
  onAction,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Ionicons name={icon} size={48} color={theme.colors.textSecondary} />
      </View>

      <Text style={[styles.emptyStateMessage, { color: theme.colors.text }]}>
        {message}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionText, { color: theme.colors.onPrimary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
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
    // Loading state styles
    message: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
    // Error state styles
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
      color: theme.colors.onPrimary,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "500",
    },
    // Empty state styles
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    emptyStateMessage: {
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
      lineHeight: theme.typography.body.fontSize * 1.5,
      marginBottom: theme.spacing.xl,
      maxWidth: 280,
    },
    actionButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.spacing.xl,
      minWidth: 120,
      alignItems: "center",
    },
    actionText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
    },
  });
