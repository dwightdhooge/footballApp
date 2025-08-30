import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Event, Team } from "@/types/api";
import { GoalIcon } from "./../utility/GoalIcon";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  getEventIcon,
  getEventColor,
  formatEventTime,
  isPenaltyGoal,
} from "./../../../../core/utils/matchUtils";
import { CachedImage } from "./../common/CachedImage";

interface EventItemProps {
  event: Event;
  onPress?: () => void;
  homeTeam?: Team;
  awayTeam?: Team;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onPress,
  homeTeam,
  awayTeam,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const penaltyGoal = isPenaltyGoal(event.detail);
  const isHomeTeam = homeTeam ? event.team.name === homeTeam.name : false;

  const content = (
    <View style={styles.eventRow}>
      {/* Home Team Side */}
      <View style={styles.homeEventContainer}>
        {isHomeTeam && (
          <View style={styles.eventContent}>
            <View style={styles.eventDetails}>
              {/* Event Type First */}
              <View style={styles.eventTypeRow}>
                {event.type === "Goal" ? (
                  <GoalIcon isPenalty={penaltyGoal} size={12} />
                ) : (
                  <Text style={styles.eventIcon}>
                    {getEventIcon(event.type, event.detail)}
                  </Text>
                )}
                <Text
                  style={[
                    styles.eventType,
                    {
                      color: getEventColor(
                        event.type,
                        event.detail,
                        theme.colors
                      ),
                    },
                  ]}
                >
                  {t(`events.types.${event.type.toLowerCase()}`, event.type)}
                </Text>
              </View>

              {/* Goal: Player name with assist below */}
              {event.type === "Goal" && (
                <>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {event.player ? event.player.name : event.team.name}
                  </Text>
                  {event.assist && event.assist.name && (
                    <Text style={styles.assistText}>
                      {t("events.assist")}: {event.assist.name}
                    </Text>
                  )}
                </>
              )}

              {/* Substitution: Arrow left with player name, arrow right with assist */}
              {event.type === "subst" && (
                <>
                  <View style={styles.substitutionRow}>
                    <Text style={styles.substitutionText}>
                      <Text style={styles.arrowOut}>←</Text>{" "}
                      {event.player ? event.player.name : event.team.name}
                    </Text>
                  </View>
                  {event.assist && event.assist.name && (
                    <View style={styles.substitutionRow}>
                      <Text style={styles.substitutionText}>
                        <Text style={styles.arrowIn}>→</Text>{" "}
                        {event.assist.name}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Other event types: Just player name */}
              {event.type !== "Goal" && event.type !== "subst" && (
                <Text style={styles.playerName} numberOfLines={1}>
                  {event.player ? event.player.name : event.team.name}
                </Text>
              )}

              {/* Comments */}
              {event.comments && (
                <Text style={styles.commentsText}>{event.comments}</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Middle - Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {formatEventTime(event.time.elapsed, event.time.extra)}
        </Text>
      </View>

      {/* Away Team Side */}
      <View style={styles.awayEventContainer}>
        {!isHomeTeam && (
          <View style={styles.eventContent}>
            <View style={styles.eventDetails}>
              {/* Event Type First */}
              <View style={[styles.eventTypeRow, styles.awayEventTypeRow]}>
                <Text
                  style={[
                    styles.eventType,
                    {
                      color: getEventColor(
                        event.type,
                        event.detail,
                        theme.colors
                      ),
                    },
                  ]}
                >
                  {t(`events.types.${event.type.toLowerCase()}`, event.type)}
                </Text>
                {event.type === "Goal" ? (
                  <GoalIcon isPenalty={penaltyGoal} size={12} />
                ) : (
                  <Text style={styles.eventIcon}>
                    {getEventIcon(event.type, event.detail)}
                  </Text>
                )}
              </View>

              {/* Goal: Player name with assist below */}
              {event.type === "Goal" && (
                <>
                  <Text
                    style={[styles.playerName, styles.awayPlayerName]}
                    numberOfLines={1}
                  >
                    {event.player ? event.player.name : event.team.name}
                  </Text>
                  {event.assist && event.assist.name && (
                    <Text style={[styles.assistText, styles.awayAssistText]}>
                      {t("events.assist")}: {event.assist.name}
                    </Text>
                  )}
                </>
              )}

              {/* Substitution: Arrow left with player name, arrow right with assist */}
              {event.type === "subst" && (
                <>
                  <View
                    style={[styles.substitutionRow, styles.awaySubstitutionRow]}
                  >
                    <Text
                      style={[
                        styles.substitutionText,
                        styles.awaySubstitutionText,
                      ]}
                    >
                      <Text style={styles.arrowOut}>←</Text>{" "}
                      {event.player ? event.player.name : event.team.name}
                    </Text>
                  </View>
                  {event.assist && event.assist.name && (
                    <View
                      style={[
                        styles.substitutionRow,
                        styles.awaySubstitutionRow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.substitutionText,
                          styles.awaySubstitutionText,
                        ]}
                      >
                        <Text style={styles.arrowIn}>→</Text>{" "}
                        {event.assist.name}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Other event types: Just player name */}
              {event.type !== "Goal" && event.type !== "subst" && (
                <Text
                  style={[styles.playerName, styles.awayPlayerName]}
                  numberOfLines={1}
                >
                  {event.player ? event.player.name : event.team.name}
                </Text>
              )}

              {/* Comments */}
              {event.comments && (
                <Text style={[styles.commentsText, styles.awayCommentsText]}>
                  {event.comments}
                </Text>
              )}
            </View>
          </View>
        )}
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
    eventRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      minHeight: 60,
    },
    homeEventContainer: {
      flex: 1,
      alignItems: "flex-start",
    },
    awayEventContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    eventContent: {
      flexDirection: "row",
      alignItems: "center",
      maxWidth: "100%",
    },
    eventDetails: {
      flex: 1,
    },
    playerName: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs / 2,
    },
    awayPlayerName: {
      textAlign: "right",
    },
    eventTypeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 2,
    },
    awayEventTypeRow: {
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
    },
    eventType: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: "600",
      textTransform: "uppercase",
      marginLeft: theme.spacing.xs / 2,
    },
    eventIcon: {
      fontSize: 12,
      lineHeight: 12,
    },
    assistText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    awayAssistText: {
      textAlign: "right",
    },
    commentsText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    awayCommentsText: {
      textAlign: "right",
    },
    substitutionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 2,
    },
    awaySubstitutionRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    substitutionText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    awaySubstitutionText: {
      textAlign: "right",
    },
    arrowIn: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: theme.typography.small.fontSize,
    },
    arrowOut: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: theme.typography.small.fontSize,
    },
    timeContainer: {
      width: 60,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
    },
    time: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "700",
      color: theme.colors.primary,
      textAlign: "center",
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
