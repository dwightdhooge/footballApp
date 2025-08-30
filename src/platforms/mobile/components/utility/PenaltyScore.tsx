import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface PenaltyScoreProps {
  home: number | null;
  away: number | null;
}

export const PenaltyScore: React.FC<PenaltyScoreProps> = ({ home, away }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  // Don't render if no penalty scores
  if (home === null || away === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("match.penalty.label")}</Text>
      <Text style={styles.score}>
        {home}-{away}
      </Text>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },
    label: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs / 2,
    },
    score: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
  });
