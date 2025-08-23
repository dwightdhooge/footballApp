import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GoalIcon from "../../utility/GoalIcon";
import { useTheme } from "@/context/ThemeContext";

interface PlayerStatusProps {
  yellowCards: number;
  redCards: number;
  goals: number;
  isPenaltyGoal: boolean;
  showOverlapping?: boolean;
  showMultiple?: boolean;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({
  yellowCards,
  redCards,
  goals,
  isPenaltyGoal,
  showOverlapping = false,
  showMultiple = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!showMultiple && !goals && !yellowCards && !redCards) {
    return null;
  }

  return (
    <View style={styles.playerStatusContainer}>
      {goals > 0 && <GoalIcon isPenalty={isPenaltyGoal} size="small" />}
      {yellowCards > 0 && <Text style={styles.yellowCard}>🟨</Text>}
      {redCards > 0 && <Text style={styles.redCard}>🟥</Text>}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    playerStatusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    yellowCard: {
      fontSize: theme.typography.small.fontSize,
    },
    redCard: {
      fontSize: theme.typography.small.fontSize,
    },
  });

export default PlayerStatus;
