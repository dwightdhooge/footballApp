import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Lineup, Event, Player } from "@/types/api";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { PlayerRow } from "./../player/PlayerRow";
import {
  hasPlayerScored,
  hasPlayerScoredPenalty,
  hasPlayerYellowCard,
  hasPlayerRedCard,
  hasPlayerBeenSubstitutedOut,
  hasPlayerBeenSubstitutedIn,
  getPlayerSubstitutionMinute,
} from "./../../../../core/utils/eventUtils";

interface TeamLineupProps {
  lineup: Lineup;
  onPlayerPress?: (player: any) => void;
  showFormation?: boolean;
  showCoach?: boolean;
  events?: Event[];
  navigateToPlayer?: (player: Player) => void;
}

export const TeamLineup: React.FC<TeamLineupProps> = ({
  lineup,
  onPlayerPress,
  showFormation = true,
  showCoach = true,
  events = [],
  navigateToPlayer,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  // Player status functions using imported utilities
  const getPlayerStatus = (playerName: string) => ({
    hasScored: hasPlayerScored(playerName, events),
    hasScoredPenalty: hasPlayerScoredPenalty(playerName, events),
    hasYellowCard: hasPlayerYellowCard(playerName, events),
    hasRedCard: hasPlayerRedCard(playerName, events),
    hasBeenSubstitutedOut: hasPlayerBeenSubstitutedOut(playerName, events),
    hasBeenSubstitutedIn: hasPlayerBeenSubstitutedIn(playerName, events),
    substitutionMinute: getPlayerSubstitutionMinute(playerName, events),
  });

  const renderPlayer = (playerData: any, isStarting: boolean = true) => {
    const playerStatus = getPlayerStatus(playerData.player.name);
    const {
      hasScored,
      hasScoredPenalty,
      hasYellowCard,
      hasRedCard,
      hasBeenSubstitutedOut,
      hasBeenSubstitutedIn,
      substitutionMinute,
    } = playerStatus;

    return (
      <PlayerRow
        key={playerData.player.id}
        player={playerData.player}
        position={playerData.player.pos}
        isStarting={isStarting}
        showPosition={false}
        showNumber={true}
        playerStatus={{
          yellowCards: hasYellowCard ? 1 : 0,
          redCards: hasRedCard ? 1 : 0,
          goals: hasScored ? 1 : 0,
          isPenaltyGoal: hasScoredPenalty,
          showOverlapping: false,
          showMultiple: false,
          hasBeenSubstitutedOut,
          hasBeenSubstitutedIn,
          substitutionMinute,
        }}
        navigateToPlayer={navigateToPlayer}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Formation Info */}
      {showFormation && lineup.formation && (
        <View style={styles.formationContainer}>
          <Text
            style={[styles.formation, { color: theme.colors.textSecondary }]}
          >
            {t("lineups.formation")}: {lineup.formation}
          </Text>
        </View>
      )}

      {/* Starting XI */}
      <View style={styles.section}>
        <View style={styles.playersGrid}>
          {lineup.startXI.map((playerData, index) =>
            renderPlayer(playerData, true)
          )}
        </View>
      </View>

      {/* Substitutes */}
      {lineup.substitutes && lineup.substitutes.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("lineups.substitutes")} ({lineup.substitutes.length})
          </Text>
          <View style={styles.playersGrid}>
            {lineup.substitutes.map((playerData, index) =>
              renderPlayer(playerData, false)
            )}
          </View>
        </View>
      )}

      {/* Coach - Moved to bottom */}
      {showCoach && lineup.coach && (
        <View style={styles.coachContainer}>
          <Text
            style={[styles.coachName, { color: theme.colors.textSecondary }]}
          >
            {t("lineups.coach")}: {lineup.coach.name}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    formationContainer: {
      marginBottom: theme.spacing.sm,
      alignItems: "center",
    },
    formation: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "300",
    },
    coachContainer: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      alignItems: "center",
    },
    coachName: {
      fontSize: theme.typography.caption.fontSize,
      fontStyle: "italic",
    },
    section: {
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    playersGrid: {
      flexDirection: "column",
    },
  });
