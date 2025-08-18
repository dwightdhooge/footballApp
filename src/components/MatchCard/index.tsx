import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Fixture } from "../../types/api";

interface MatchCardProps {
  fixture: Fixture;
  onPress: () => void;
  size?: "small" | "medium" | "large";
  showVenue?: boolean;
  showStatus?: boolean;
  disabled?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
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

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      TBD: theme.colors.textSecondary,
      NS: theme.colors.textSecondary,
      "1H": theme.colors.success,
      HT: theme.colors.warning,
      "2H": theme.colors.success,
      ET: theme.colors.secondary,
      P: theme.colors.secondary,
      FT: theme.colors.info,
      AET: theme.colors.secondary,
      PEN: theme.colors.secondary,
      LIVE: theme.colors.success,
    };
    return statusMap[status] || theme.colors.textSecondary;
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
  const statusColor = getStatusColor(fixture.fixture.status.short);

  const styles = getStyles(theme, size);

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
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusText}>
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
              <Text style={styles.elapsedText}>
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
          <Image
            source={{ uri: fixture.teams.home.logo }}
            style={styles.teamLogo}
            resizeMode="contain"
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
          <Image
            source={{ uri: fixture.teams.away.logo }}
            style={styles.teamLogo}
            resizeMode="contain"
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

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
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
      paddingBottom: 8,
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
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    statusText: {
      color: "white",
      fontSize: 10,
      fontWeight: "600",
    },
    date: {
      fontWeight: "500",
    },
    time: {
      fontWeight: "500",
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    timeText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    matchContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      minHeight: 40,
    },
    teamContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 32,
    },
    teamLogo: {
      width: 24,
      height: 24,
      marginHorizontal: 4,
      resizeMode: "contain",
    },
    teamName: {
      flex: 1,
      fontWeight: "500",
      textAlign: "center",
    },
    teamNameText: {
      fontSize: 14,
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
      fontWeight: "600",
    },
    scoreText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    scoreSeparator: {
      fontWeight: "500",
      marginHorizontal: 4,
    },
    scoreSeparatorText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    scoreType: {
      fontWeight: "500",
      marginTop: 2,
    },
    vsText: {
      fontWeight: "500",
    },
    vsTextStyle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    venueContainer: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    venueText: {
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      fontSize: 12,
    },
    elapsedContainer: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    elapsedText: {
      color: "white",
      fontWeight: "600",
      fontSize: 12,
    },
    penaltyContainer: {
      marginTop: 4,
    },
    penaltyText: {
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
      fontSize: 12,
    },
    small: {
      padding: 8,
      fontSize: 12,
    },
    medium: {
      padding: 12,
      fontSize: 14,
    },
    large: {
      padding: 16,
      fontSize: 16,
    },
  });

export default MatchCard;
