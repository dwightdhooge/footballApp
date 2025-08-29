import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useFixtureStatistics } from "@/hooks/useFixtureStatistics";
import { Fixture } from "@/types/api";
import { EmptyState } from "@/components/common/StateComponents";

interface StatsProps {
  fixture: Fixture;
}

const Stats: React.FC<StatsProps> = ({ fixture }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { stats, isLoading, error, refetch } = useFixtureStatistics(fixture);
  const styles = getStyles(theme);

  if (isLoading) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.errorText}>{t("common.error")}</Text>
        <Text style={styles.retryText} onPress={refetch}>
          {t("common.retry")}
        </Text>
      </ScrollView>
    );
  }

  if (!stats || (Array.isArray(stats) && stats.length === 0)) {
    return (
      <View style={[styles.container, styles.emptyStateContainer]}>
        <EmptyState
          message={t("match.stats.noDataMessage")}
          icon="stats-chart"
        />
      </View>
    );
  }

  const renderStatRow = (
    label: string,
    homeValue: number,
    awayValue: number,
    unit: string = ""
  ) => (
    <View style={styles.statRow}>
      <Text style={styles.statValue}>
        {homeValue}
        {unit}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {awayValue}
        {unit}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsContainer}>
        {renderStatRow(
          "Possession",
          stats.possession.home,
          stats.possession.away,
          "%"
        )}
        {renderStatRow("Total Shots", stats.shots.home, stats.shots.away)}
        {renderStatRow(
          "Shots on Target",
          stats.shotsOnTarget.home,
          stats.shotsOnTarget.away
        )}
        {renderStatRow(
          "Shots off Target",
          stats.shotsOffTarget.home,
          stats.shotsOffTarget.away
        )}
        {renderStatRow(
          "Blocked Shots",
          stats.blockedShots.home,
          stats.blockedShots.away
        )}
        {renderStatRow(
          "Shots Inside Box",
          stats.shotsInsideBox.home,
          stats.shotsInsideBox.away
        )}
        {renderStatRow(
          "Shots Outside Box",
          stats.shotsOutsideBox.home,
          stats.shotsOutsideBox.away
        )}
        {renderStatRow("Corners", stats.corners.home, stats.corners.away)}
        {renderStatRow("Fouls", stats.fouls.home, stats.fouls.away)}
        {renderStatRow("Offsides", stats.offsides.home, stats.offsides.away)}
        {renderStatRow(
          "Yellow Cards",
          stats.yellowCards.home,
          stats.yellowCards.away
        )}
        {renderStatRow("Red Cards", stats.redCards.home, stats.redCards.away)}
        {renderStatRow(
          "Goalkeeper Saves",
          stats.goalkeeperSaves.home,
          stats.goalkeeperSaves.away
        )}
        {renderStatRow(
          "Total Passes",
          stats.totalPasses.home,
          stats.totalPasses.away
        )}
        {renderStatRow(
          "Accurate Passes",
          stats.accuratePasses.home,
          stats.accuratePasses.away
        )}
        {renderStatRow(
          "Pass Accuracy",
          stats.passAccuracy.home,
          stats.passAccuracy.away,
          "%"
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statLabel: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textSecondary,
    },
    statValue: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    statValueHome: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "right",
    },
    statValueAway: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "left",
    },
    teamName: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
    },
    loadingText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xl,
    },
    errorText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "500",
      color: theme.colors.error,
      textAlign: "center",
      marginTop: theme.spacing.xl,
    },
    retryText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "500",
      color: theme.colors.primary,
      textAlign: "center",
      marginTop: theme.spacing.sm,
      textDecorationLine: "underline",
    },
    emptyStateContainer: {
      justifyContent: "center",
    },
  });

export default Stats;
