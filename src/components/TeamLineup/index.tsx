import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Lineup, Event } from "../../types/api";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import GoalIcon from "../GoalIcon";
import {
  hasPlayerScored,
  hasPlayerScoredPenalty,
  hasPlayerYellowCard,
  hasPlayerRedCard,
  hasPlayerBeenSubstitutedOut,
  hasPlayerBeenSubstitutedIn,
  getPlayerSubstitutionMinute,
} from "../../utils/eventUtils";
import CachedImage from "../common/CachedImage";

interface TeamLineupProps {
  lineup: Lineup;
  onPlayerPress?: (player: any) => void;
  showFormation?: boolean;
  showCoach?: boolean;
  events?: Event[];
}

const TeamLineup: React.FC<TeamLineupProps> = ({
  lineup,
  onPlayerPress,
  showFormation = true,
  showCoach = true,
  events = [],
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
    } = playerStatus;

    return (
      <View key={playerData.player.id} style={styles.playerItem}>
        <Text style={styles.playerNumber}>{playerData.player.number}</Text>
        <Text
          style={[styles.playerName, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {playerData.player.name}
        </Text>
        <View style={styles.eventIcons}>
          {hasScored && <GoalIcon isPenalty={hasScoredPenalty} size={12} />}
          {(hasYellowCard || hasRedCard) && (
            <View style={styles.cardIcons}>
              {hasYellowCard && <Text style={styles.yellowCardIcon}>🟨</Text>}
              {hasRedCard && <Text style={styles.redCardIcon}>🟥</Text>}
            </View>
          )}
          {hasBeenSubstitutedOut && (
            <Text
              style={[styles.substitutionIcon, { color: theme.colors.error }]}
            >
              ←
            </Text>
          )}
          {hasBeenSubstitutedIn && (
            <Text
              style={[styles.substitutionIcon, { color: theme.colors.success }]}
            >
              →
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Team Header */}
      <View style={styles.teamHeader}>
        {lineup.team.logo && (
          <CachedImage
            url={lineup.team.logo}
            size={24}
            fallbackText="Team"
            borderRadius={4}
            resizeMode="contain"
            ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
          />
        )}
        <View style={styles.teamInfo}>
          <Text style={[styles.teamName, { color: theme.colors.text }]}>
            {lineup.team.name}
          </Text>
        </View>
      </View>

      {/* Coach & Formation Info */}
      {(showCoach && lineup.coach) || (showFormation && lineup.formation) ? (
        <View style={styles.teamDetails}>
          {showCoach && lineup.coach && (
            <Text
              style={[styles.coachName, { color: theme.colors.textSecondary }]}
            >
              {t("lineups.coach")}: {lineup.coach.name}
            </Text>
          )}
          {showFormation && lineup.formation && (
            <Text
              style={[styles.formation, { color: theme.colors.textSecondary }]}
            >
              {t("lineups.formation")}: {lineup.formation}
            </Text>
          )}
        </View>
      ) : null}

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
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    teamHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    teamLogo: {
      width: theme.spacing.xl * 1.5,
      height: theme.spacing.xl * 1.5,
      marginRight: theme.spacing.md,
    },
    teamInfo: {
      flex: 1,
    },
    teamName: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    teamDetails: {
      marginBottom: theme.spacing.sm,
      paddingLeft: 0,
    },
    coachName: {
      fontSize: theme.typography.caption.fontSize,
      marginBottom: theme.spacing.xs / 2,
    },
    formation: {
      fontSize: theme.typography.caption.fontSize,
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
    playerItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      justifyContent: "space-between",
    },
    playerNumber: {
      fontSize: theme.typography.body.fontSize,
      marginRight: theme.spacing.sm,
      minWidth: theme.spacing.xl,
    },
    playerName: {
      fontSize: theme.typography.caption.fontSize,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    yellowCardIcon: {
      fontSize: theme.typography.caption.fontSize,
      marginRight: theme.spacing.xs / 2,
    },
    redCardIcon: {
      fontSize: theme.typography.caption.fontSize,
      marginRight: theme.spacing.xs / 2,
      position: "absolute",
      top: -theme.spacing.xs / 2,
      left: 0,
      zIndex: 1,
    },
    cardIcons: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      marginLeft: theme.spacing.xs / 2,
    },
    eventIcons: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: theme.spacing.xs,
    },
    substitutionIcon: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "bold",
      marginLeft: theme.spacing.xs,
      marginRight: theme.spacing.xs / 2,
    },
  });

export default TeamLineup;
