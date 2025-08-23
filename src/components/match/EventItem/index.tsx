import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Event } from "../../../types/api";
import GoalIcon from "../../utility/GoalIcon";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  getEventIcon,
  getEventColor,
  formatEventTime,
  isPenaltyGoal,
} from "../../../utils/matchUtils";
import CachedImage from "../../common/CachedImage";

interface EventItemProps {
  event: Event;
  onPress?: () => void;
  size?: "small" | "medium" | "large";
  homeTeamName?: string;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  onPress,
  size = "medium",
  homeTeamName,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const penaltyGoal = isPenaltyGoal(event.detail);
  const isHomeTeam = homeTeamName ? event.team.name === homeTeamName : false;

  const content = (
    <View style={[styles.container, styles[size]]}>
      {/* Minute */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {formatEventTime(event.time.elapsed, event.time.extra)}
        </Text>
      </View>

      {/* Event Icon */}
      <View style={styles.iconContainer}>
        {event.type === "Goal" ? (
          <GoalIcon isPenalty={penaltyGoal} size={16} />
        ) : (
          <Text style={styles.eventIcon}>
            {getEventIcon(event.type, event.detail)}
          </Text>
        )}
      </View>

      {/* Event Details */}
      <View style={styles.eventDetails}>
        {/* Player Name and Event Type Row */}
        <View style={styles.playerEventRow}>
          <Text style={styles.playerName} numberOfLines={1}>
            {event.player ? event.player.name : event.team.name}
          </Text>
          <Text
            style={[
              styles.eventType,
              { color: getEventColor(event.type, event.detail, theme.colors) },
            ]}
          >
            {t(`events.types.${event.type.toLowerCase()}`, event.type)}
          </Text>
        </View>

        {/* Substitution Details with Arrows */}
        {event.type === "subst" && event.assist && event.assist.name && (
          <View style={styles.substitutionRow}>
            <Text style={styles.substitutionText}>
              <Text style={styles.arrowIn}>↑</Text> {event.assist.name}
            </Text>
          </View>
        )}

        {/* Assist Information for Goals */}
        {event.type === "Goal" && event.assist && event.assist.name && (
          <Text style={styles.assistText}>
            {t("events.assist")}: {event.assist.name}
          </Text>
        )}

        {/* Comments */}
        {event.comments && (
          <Text style={styles.commentsText}>{event.comments}</Text>
        )}
      </View>

      {/* Team Logo + Abbreviated Name */}
      <View style={styles.teamContainer}>
        <CachedImage
          url={event.team.logo}
          size={24}
          fallbackText="Team"
          borderRadius={4}
          resizeMode="contain"
          ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
        />
        <Text style={styles.teamAbbreviation} numberOfLines={1}>
          {getTeamAbbreviation(event.team.name)}
        </Text>
      </View>
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
      alignItems: "flex-start",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    small: {
      paddingHorizontal: theme.spacing.sm,
    },
    medium: {
      paddingHorizontal: theme.spacing.md,
    },
    large: {
      paddingHorizontal: theme.spacing.lg,
    },
    timeContainer: {
      width: theme.spacing.xl * 1,
      alignItems: "center",
      marginRight: theme.spacing.sm,
    },
    time: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    iconContainer: {
      width: theme.spacing.xl * 1,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
      paddingTop: theme.spacing.xs,
    },
    eventIcon: {
      fontSize: 12,
      lineHeight: 12,
    },
    eventDetails: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    playerEventRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 2,
    },
    playerName: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    eventType: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    assistText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginBottom: theme.spacing.xs / 2,
    },
    commentsText: {
      fontSize: theme.typography.caption.fontSize - 1,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
    },
    eventDetail: {
      fontSize: theme.typography.caption.fontSize - 1,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    teamContainer: {
      alignItems: "center",
      width: theme.spacing.xl * 1,
    },
    teamLogo: {
      width: theme.spacing.lg,
      height: theme.spacing.xl,
      marginBottom: theme.spacing.xs / 2,
    },
    teamAbbreviation: {
      fontSize: theme.typography.caption.fontSize - 2,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    substitutionRow: {
      marginBottom: theme.spacing.xs / 2,
    },
    substitutionText: {
      fontSize: theme.typography.caption.fontSize - 1,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    arrowOut: {
      fontSize: theme.typography.caption.fontSize - 1,
      color: theme.colors.textSecondary,
    },
    arrowIn: {
      fontSize: theme.typography.caption.fontSize - 1,
      color: theme.colors.textSecondary,
    },
  });

// Helper function to get team abbreviation
const getTeamAbbreviation = (teamName: string): string => {
  if (!teamName) return "";

  // Split by spaces and take first letter of each word
  const words = teamName.split(" ");
  if (words.length === 1) {
    // Single word team name, take first 3-4 letters
    return teamName.substring(0, Math.min(4, teamName.length));
  }

  // Multiple words, take first letter of each word
  return words
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 3);
};

export default EventItem;
