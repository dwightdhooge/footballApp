import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Team, Standing } from "../../../types/api";
import CachedImage from "../../common/CachedImage";

interface TeamRowProps {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  form: string;
  status: string;
  description: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  onPress: () => void;
  showForm?: boolean;
  showStatus?: boolean;
  size?: "compact" | "standard" | "detailed";
}

const TeamRow: React.FC<TeamRowProps> = ({
  rank,
  team,
  points,
  goalsDiff,
  form,
  status,
  description,
  played,
  won,
  drawn,
  lost,
  goalsFor,
  goalsAgainst,
  onPress,
  showForm = true,
  showStatus = true,
  size = "standard",
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, size, goalsDiff);

  const getFormDisplay = () => {
    if (!form) return [];

    return form
      .slice(-5)
      .split("")
      .map((result, index) => ({
        result: result as "W" | "D" | "L",
        color:
          result === "W"
            ? theme.colors.success
            : result === "D"
            ? theme.colors.warning
            : theme.colors.error,
      }));
  };

  const getStatusDisplay = () => {
    if (description?.includes(t("standings.championsLeague"))) {
      return { type: "champions-league" as const, color: theme.colors.info };
    }
    if (description?.includes(t("standings.europaLeague"))) {
      return { type: "europa-league" as const, color: theme.colors.secondary };
    }
    if (description?.includes("Relegation")) {
      return { type: "relegation" as const, color: theme.colors.error };
    }
    return { type: "normal" as const, color: theme.colors.textSecondary };
  };

  const formDisplay = getFormDisplay();
  const statusDisplay = getStatusDisplay();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Rank */}
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{rank}</Text>
      </View>

      {/* Team Info */}
      <View style={styles.teamContainer}>
        <CachedImage
          url={team.logo}
          size={24}
          fallbackText="Team"
          borderRadius={4}
          resizeMode="contain"
          ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
        />
        <Text style={styles.teamName} numberOfLines={1}>
          {team.name}
        </Text>
      </View>

      {/* Statistics - Only show in standard/detailed */}
      {size !== "compact" && (
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>{played}</Text>
          <Text style={styles.stat}>{won}</Text>
          <Text style={styles.stat}>{drawn}</Text>
          <Text style={styles.stat}>{lost}</Text>
          <Text style={styles.stat}>{goalsFor}</Text>
          <Text style={styles.stat}>{goalsAgainst}</Text>
        </View>
      )}

      {/* Form - Only show in detailed */}
      {size === "detailed" && showForm && (
        <View style={styles.formContainer}>
          {formDisplay.map((formItem, index) => (
            <View
              key={index}
              style={[styles.formItem, { backgroundColor: formItem.color }]}
            >
              <Text style={styles.formText}>{formItem.result}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Status - Only show in detailed */}
      {size === "detailed" && showStatus && (
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: statusDisplay.color },
          ]}
        >
          <Text style={styles.statusText}>
            {statusDisplay.type === "champions-league"
              ? "CL"
              : statusDisplay.type === "europa-league"
              ? "EL"
              : statusDisplay.type === "relegation"
              ? "R"
              : status}
          </Text>
        </View>
      )}

      {/* Points and Goal Difference */}
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{points}</Text>
        <Text style={styles.goalsDiff}>
          {goalsDiff > 0 ? `+${goalsDiff}` : goalsDiff}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  size: string,
  goalsDiff: number
) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical:
        size === "compact"
          ? theme.spacing.sm
          : size === "detailed"
          ? theme.spacing.md
          : theme.spacing.sm,
    },
    rankContainer: {
      width: 30,
      alignItems: "center",
    },
    rank: {
      fontWeight: "600",
      fontSize:
        size === "compact"
          ? theme.typography.caption.fontSize
          : size === "detailed"
          ? theme.typography.body.fontSize
          : theme.typography.small.fontSize,
      color: theme.colors.text,
    },
    teamContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginRight: theme.spacing.sm,
    },
    teamLogo: {
      width: 20,
      height: 20,
      marginRight: theme.spacing.sm,
    },
    teamName: {
      flex: 1,
      fontWeight: "500",
      fontSize:
        size === "compact"
          ? theme.typography.caption.fontSize
          : size === "detailed"
          ? theme.typography.body.fontSize
          : theme.typography.small.fontSize,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    statsContainer: {
      flexDirection: "row",
      width: 120,
      justifyContent: "space-between",
      marginRight: theme.spacing.sm,
    },
    stat: {
      textAlign: "center",
      fontWeight: "500",
      fontSize:
        size === "compact"
          ? theme.typography.caption.fontSize
          : size === "detailed"
          ? theme.typography.small.fontSize
          : theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    formContainer: {
      flexDirection: "row",
      marginRight: theme.spacing.sm,
    },
    formItem: {
      width: 16,
      height: 16,
      borderRadius: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 2,
    },
    formText: {
      color: theme.colors.onSurface,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
    },
    statusContainer: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.spacing.xs,
      marginRight: theme.spacing.sm,
    },
    statusText: {
      color: theme.colors.onSurface,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
    },
    pointsContainer: {
      alignItems: "center",
      minWidth: 40,
    },
    points: {
      fontWeight: "600",
      fontSize:
        size === "compact"
          ? theme.typography.caption.fontSize
          : size === "detailed"
          ? theme.typography.body.fontSize
          : theme.typography.small.fontSize,
      color: theme.colors.text,
    },
    goalsDiff: {
      fontWeight: "500",
      fontSize:
        size === "compact"
          ? theme.typography.caption.fontSize
          : size === "detailed"
          ? theme.typography.small.fontSize
          : theme.typography.caption.fontSize,
      color:
        goalsDiff > 0
          ? theme.colors.success
          : goalsDiff < 0
          ? theme.colors.error
          : theme.colors.textSecondary,
    },
  });

export default TeamRow;
