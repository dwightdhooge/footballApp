import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Lineup, Event } from "../../types/api";
import PlayerRow from "../PlayerRow";
import PlayerStatus from "../PlayerStatus";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { isPenaltyGoal } from "../../utils/matchUtils";

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

  const calculatePlayerStatus = (
    playerId: number
  ): {
    yellowCards: number;
    redCards: number;
    goals: number;
    isPenaltyGoal: boolean;
    showOverlapping: boolean;
    showMultiple: boolean;
  } => {
    const playerEvents = events.filter(
      (event) => event.player?.id === playerId || event.assist?.id === playerId
    );

    let yellowCards = 0;
    let redCards = 0;
    let goals = 0;
    let penaltyGoal = false;

    playerEvents.forEach((event) => {
      if (event.type === "Card") {
        if (event.detail.includes("Yellow")) {
          yellowCards++;
        } else if (event.detail.includes("Red")) {
          redCards++;
        }
      } else if (event.type === "Goal") {
        goals++;
        if (isPenaltyGoal(event.detail)) {
          penaltyGoal = true;
        }
      }
    });

    // Handle second yellow = red card logic
    if (yellowCards >= 2) {
      redCards = Math.max(redCards, 1);
      yellowCards = 0; // Reset yellow cards when converted to red
    }

    return {
      yellowCards,
      redCards,
      goals,
      isPenaltyGoal: penaltyGoal,
      showOverlapping: yellowCards > 0 && redCards > 0,
      showMultiple:
        (goals > 0 && (yellowCards > 0 || redCards > 0)) ||
        (yellowCards > 0 && redCards > 0),
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.teamInfo}>
          <Image source={{ uri: lineup.team.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{lineup.team.name}</Text>
        </View>
        {showFormation && (
          <Text style={styles.formation}>{lineup.formation}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("lineups.sections.startingXI")}
        </Text>
        {lineup.startXI.map((playerData, index) => (
          <PlayerRow
            key={`start-${playerData.player.id}`}
            player={playerData.player}
            position={playerData.player.pos}
            isStarting={true}
            onPress={
              onPlayerPress ? () => onPlayerPress(playerData.player) : undefined
            }
            showPosition={true}
            showNumber={true}
            playerStatus={calculatePlayerStatus(playerData.player.id)}
          />
        ))}
      </View>

      {lineup.substitutes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("lineups.sections.substitutes")}
          </Text>
          {lineup.substitutes.map((playerData, index) => (
            <PlayerRow
              key={`sub-${playerData.player.id}`}
              player={playerData.player}
              position={playerData.player.pos}
              isStarting={false}
              onPress={
                onPlayerPress
                  ? () => onPlayerPress(playerData.player)
                  : undefined
              }
              showPosition={false}
              showNumber={true}
              playerStatus={calculatePlayerStatus(playerData.player.id)}
            />
          ))}
        </View>
      )}

      {showCoach && lineup.coach && (
        <View style={styles.coachSection}>
          <Text style={styles.sectionTitle}>{t("lineups.sections.coach")}</Text>
          <View style={styles.coachInfo}>
            <Image
              source={{ uri: lineup.coach.photo }}
              style={styles.coachPhoto}
            />
            <Text style={styles.coachName}>{lineup.coach.name}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    teamInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    teamLogo: {
      width: theme.spacing.xl * 1.5,
      height: theme.spacing.xl * 1.5,
      marginRight: theme.spacing.sm,
    },
    teamName: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    formation: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    section: {
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    coachSection: {
      marginTop: theme.spacing.sm,
    },
    coachInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    coachPhoto: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      marginRight: theme.spacing.sm,
      borderRadius: theme.spacing.xl / 2,
    },
    coachName: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
    },
  });

export default TeamLineup;
