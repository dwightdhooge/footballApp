import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Player } from "../../../types/api";
import PlayerStatus from "../PlayerStatus";
import { useTheme } from "@/context/ThemeContext";
import { getPlayerPositionDisplay } from "../../../utils/matchUtils";

interface PlayerRowProps {
  player: Player;
  position: string;
  isStarting: boolean;
  onPress?: () => void;
  showPosition?: boolean;
  showNumber?: boolean;
  playerStatus?: {
    yellowCards: number;
    redCards: number;
    goals: number;
    isPenaltyGoal: boolean;
    showOverlapping: boolean;
    showMultiple: boolean;
    hasBeenSubstitutedOut?: boolean;
    hasBeenSubstitutedIn?: boolean;
    substitutionMinute?: number;
  };
  navigateToPlayer?: (player: Player) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  position,
  isStarting,
  onPress,
  showPosition = true,
  showNumber = true,
  playerStatus,
  navigateToPlayer,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigateToPlayer) {
      navigateToPlayer(player);
    }
  };

  const content = (
    <View style={[styles.container, !isStarting && styles.substitute]}>
      <View style={styles.playerInfo}>
        {showPosition && (
          <View style={styles.positionContainer}>
            <Text style={styles.position}>
              {getPlayerPositionDisplay(position)}
            </Text>
          </View>
        )}

        {showNumber && (
          <View style={styles.numberContainer}>
            <Text style={styles.number}>{player.number}</Text>
          </View>
        )}

        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{player.name}</Text>
        </View>
      </View>

      {playerStatus && (
        <View style={styles.statusContainer}>
          <PlayerStatus
            yellowCards={playerStatus.yellowCards}
            redCards={playerStatus.redCards}
            goals={playerStatus.goals}
            isPenaltyGoal={playerStatus.isPenaltyGoal}
            showOverlapping={playerStatus.showOverlapping}
            showMultiple={playerStatus.showMultiple}
          />

          {/* Substitution Arrows */}
          {playerStatus.hasBeenSubstitutedOut && (
            <Text style={styles.substitutionArrow}>
              ← {playerStatus.substitutionMinute}'
            </Text>
          )}
          {playerStatus.hasBeenSubstitutedIn && (
            <Text style={styles.substitutionArrow}>
              → {playerStatus.substitutionMinute}'
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress || navigateToPlayer) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    substitute: {
      // backgroundColor: theme.colors.background, // Verwijderd om geen achtergrondkleur te hebben
    },
    playerInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    positionContainer: {
      width: theme.spacing.xl * 1.875,
      alignItems: "center",
    },
    position: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.border,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.sm,
    },
    numberContainer: {
      width: theme.spacing.xl,
      alignItems: "center",
      marginRight: theme.spacing.sm,
    },
    number: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
    },
    playerDetails: {
      flex: 1,
    },
    playerName: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.caption.fontWeight,
      color: theme.colors.text,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: theme.spacing.sm,
    },
    substitutionArrow: {
      fontSize: theme.typography.xxSmall.fontSize,
      fontWeight: theme.typography.xxSmall.fontWeight,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.sm,
    },
  });

export default PlayerRow;
