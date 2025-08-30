import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Lineup, Event, Player } from "@/types/api";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./../common/StateComponents";
import { TeamLineup } from "./../team/TeamLineup";

interface LineupsGridProps {
  lineups: Lineup[];
  isLoading: boolean;
  error: string | null;
  onPlayerPress?: (player: any) => void;
  events?: Event[];
  onRetry?: () => void;
  navigateToPlayer?: (player: Player) => void;
}

export const LineupsGrid: React.FC<LineupsGridProps> = ({
  lineups,
  isLoading,
  error,
  onPlayerPress,
  events = [],
  onRetry,
  navigateToPlayer,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingState message={t("lineups.loadingLineups")} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState
          error={error}
          title={t("lineups.errorLoadingLineups")}
          onRetry={onRetry}
        />
      </View>
    );
  }

  if (lineups.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="people-outline"
          message={t("lineups.teamLineupsNotAvailable")}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.lineupsContainer}>
        {lineups.map((lineup, index) => (
          <View key={lineup.team.id} style={styles.teamColumn}>
            <TeamLineup
              lineup={lineup}
              onPlayerPress={onPlayerPress}
              events={events}
              showFormation={true}
              showCoach={true}
              navigateToPlayer={navigateToPlayer}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    contentContainer: {
      paddingBottom: theme.spacing.md,
    },
    lineupsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    teamColumn: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
  });


