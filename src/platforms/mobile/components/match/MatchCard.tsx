import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Fixture } from "@/types/api";
import { CachedImage } from "@/components/common/CachedImage";
import { getStatusColor } from "@/utils/matchUtils";

interface MatchCardProps {
  fixture: Fixture;
  onPress: () => void;
  size?: "small" | "medium" | "large";
  showVenue?: boolean;
  showStatus?: boolean;
  disabled?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  fixture,
  onPress,
  size = "medium",
  showVenue = true,
  showStatus = true,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getDisplayScore = () => {
    const { score, goals } = fixture;

    // Main score comes from goals object (always correct)
    const mainScore = {
      home: goals.home,
      away: goals.away,
    };

    // Check if penalties are available for additional display
    const hasPenalties =
      score.penalty?.home !== null && score.penalty?.away !== null;

    return {
      mainScore,
      hasPenalties,
      penaltyScore: hasPenalties
        ? {
            home: score.penalty.home,
            away: score.penalty.away,
          }
        : null,
    };
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayScore = getDisplayScore();
  const statusColor = getStatusColor(
    fixture.fixture.status.short,
    theme.colors
  );

  const styles = getStyles(theme, size, statusColor);

  return (
    <TouchableOpacity
      style={[styles.container, styles[size], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Match Info Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showStatus && (
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {fixture.fixture.status.short}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerCenter}>
          <Text style={[styles.date, styles.dateText]}>
            {formatDate(fixture.fixture.date)}
          </Text>
          <Text style={[styles.time, styles.timeText]}>
            {formatTime(fixture.fixture.date)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {fixture.fixture.status.elapsed && (
            <View style={styles.elapsedContainer}>
              <Text style={[styles.elapsedText, { color: statusColor }]}>
                {fixture.fixture.status.elapsed}'
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Teams and Score */}
      <View style={styles.matchContent}>
        {/* Home Team */}
        <View style={styles.teamContainer}>
          <CachedImage
            url={fixture.teams.home.logo}
            size={24}
            fallbackText="Team"
            borderRadius={4}
            resizeMode="contain"
            ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
          />
          <Text
            style={[styles.teamName, styles.teamNameText]}
            numberOfLines={1}
          >
            {fixture.teams.home.name}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          {displayScore.mainScore.home !== null &&
          displayScore.mainScore.away !== null ? (
            <>
              <View style={styles.scoreRow}>
                <Text style={[styles.score, styles.scoreText]}>
                  {displayScore.mainScore.home}
                </Text>
                <Text
                  style={[styles.scoreSeparator, styles.scoreSeparatorText]}
                >
                  -
                </Text>
                <Text style={[styles.score, styles.scoreText]}>
                  {displayScore.mainScore.away}
                </Text>
              </View>

              {/* Show penalties below if available */}
              {displayScore.hasPenalties && displayScore.penaltyScore && (
                <View style={styles.penaltyContainer}>
                  <Text style={styles.penaltyText}>
                    {t("matchCard.penaltiesLabel")}{" "}
                    {displayScore.penaltyScore.home}-
                    {displayScore.penaltyScore.away}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={[styles.vsText, styles.vsTextStyle]}>
              {t("matchCard.versus")}
            </Text>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          <Text
            style={[styles.teamName, styles.teamNameText]}
            numberOfLines={1}
          >
            {fixture.teams.away.name}
          </Text>
          <CachedImage
            url={fixture.teams.away.logo}
            size={24}
            fallbackText="Team"
            borderRadius={4}
            resizeMode="contain"
            ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
          />
        </View>
      </View>

      {/* Venue - Show in medium and large sizes */}
      {(size === "medium" || size === "large") &&
        showVenue &&
        fixture.fixture.venue && (
          <View style={styles.venueContainer}>
            <Text style={styles.venueText}>
              {fixture.fixture.venue.name}, {fixture.fixture.venue.city}
            </Text>
          </View>
        )}
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  size: string,
  statusColor: string
) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    disabled: {
      opacity: 0.5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerLeft: {
      flex: 1,
      alignItems: "flex-start",
    },
    headerCenter: {
      flex: 2,
      alignItems: "center",
    },
    headerRight: {
      flex: 1,
      alignItems: "flex-end",
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    statusText: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "600",
    },
    date: {
      fontWeight: theme.typography.caption.fontWeight,
    },
    time: {
      fontWeight: theme.typography.caption.fontWeight,
    },
    dateText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    timeText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    matchContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
      minHeight: 40,
    },
    teamContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 32,
      marginHorizontal: theme.spacing.sm,
    },
    teamName: {
      flex: 1,
      fontWeight: theme.typography.h3.fontWeight,
      textAlign: "center",
    },
    teamNameText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.text,
    },
    scoreContainer: {
      alignItems: "center",
      minWidth: 60,
    },
    scoreRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    score: {
      fontWeight: theme.typography.h3.fontWeight,
    },
    scoreText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
    },
    scoreSeparator: {
      fontWeight: theme.typography.caption.fontWeight,
      marginHorizontal: theme.spacing.xs,
    },
    scoreSeparatorText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
    },
    scoreType: {
      fontWeight: theme.typography.caption.fontWeight,
      marginTop: 2,
    },
    vsText: {
      fontWeight: theme.typography.caption.fontWeight,
    },
    vsTextStyle: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.textSecondary,
    },
    venueContainer: {
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    venueText: {
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      fontSize: theme.typography.caption.fontSize,
    },
    elapsedContainer: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    elapsedText: {
      fontWeight: "600",
      fontSize: theme.typography.caption.fontSize,
    },
    penaltyContainer: {
      marginTop: theme.spacing.xs,
    },
    penaltyText: {
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.caption.fontWeight,
      textAlign: "center",
      fontSize: theme.typography.caption.fontSize,
    },
    small: {
      padding: theme.spacing.sm,
      fontSize: theme.typography.caption.fontSize,
    },
    medium: {
      padding: theme.spacing.md,
      fontSize: theme.typography.small.fontSize,
    },
    large: {
      padding: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
    },
  });
