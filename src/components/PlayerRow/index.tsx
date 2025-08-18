import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Player } from "../../types/api";
import PlayerStatus from "../PlayerStatus";
import { useTheme } from "@/context/ThemeContext";
import { getPlayerPositionDisplay } from "../../utils/matchUtils";

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
  };
}

const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  position,
  isStarting,
  onPress,
  showPosition = true,
  showNumber = true,
  playerStatus,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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
          {player.grid && (
            <Text style={styles.gridPosition}>{player.grid}</Text>
          )}
        </View>
      </View>

      {playerStatus && (
        <PlayerStatus
          yellowCards={playerStatus.yellowCards}
          redCards={playerStatus.redCards}
          goals={playerStatus.goals}
          isPenaltyGoal={playerStatus.isPenaltyGoal}
          showOverlapping={playerStatus.showOverlapping}
          showMultiple={playerStatus.showMultiple}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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
      backgroundColor: theme.colors.background,
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
      width: theme.spacing.xl * 1.875,
      alignItems: "center",
      marginRight: theme.spacing.sm,
    },
    number: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    playerDetails: {
      flex: 1,
    },
    playerName: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "500",
      color: theme.colors.text,
    },
    gridPosition: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs / 2,
    },
  });

export default PlayerRow;
