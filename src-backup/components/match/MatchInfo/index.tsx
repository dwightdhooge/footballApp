import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Fixture, Event } from "../../../types/api";
import GoalIcon from "../../utility/GoalIcon";
import TeamInfo from "../../team/TeamInfo";
import PenaltyScore from "../../utility/PenaltyScore";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  getStatusColor,
  formatMatchDate,
  formatMatchTime,
  isPenaltyGoal,
  formatScore,
  formatPenaltyScore,
} from "../../../utils/matchUtils";

interface MatchInfoProps {
  fixture: Fixture;
  events?: Event[];
  showHalfTimeScore?: boolean;
  showGoals?: boolean;
  showDetails?: boolean;
  onTeamPress?: (team: any) => void;
}

const MatchInfo: React.FC<MatchInfoProps> = ({
  fixture,
  events = [],
  showHalfTimeScore = true,
  showGoals = true,
  showDetails = true,
  onTeamPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Determine winner based on score
  const getWinner = (teamType: "home" | "away"): boolean => {
    if (fixture.fixture.status.short !== "FT") return false;

    const homeGoals = fixture.goals.home || 0;
    const awayGoals = fixture.goals.away || 0;

    if (teamType === "home") {
      return homeGoals > awayGoals;
    } else {
      return awayGoals > homeGoals;
    }
  };

  // Create team objects with winner property
  const homeTeam = { ...fixture.teams.home, winner: getWinner("home") };
  const awayTeam = { ...fixture.teams.away, winner: getWinner("away") };

  const getStatusDisplay = (status: any): string => {
    if (status.short === "LIVE") {
      return t("match.status.live", { elapsed: status.elapsed });
    }
    if (status.short === "FT") {
      return t("match.status.finished");
    }
    if (status.short === "HT") {
      return t("match.status.halftime");
    }
    if (status.short === "NS") {
      return t("match.status.notStarted");
    }
    return status.long;
  };

  const getTeamGoals = (teamName: string) => {
    return events.filter(
      (event) => event.team.name === teamName && event.type === "Goal"
    );
  };

  const getTeamCards = (teamName: string) => {
    return events.filter(
      (event) =>
        event.team.name === teamName &&
        event.type === "Card" &&
        event.detail.toLowerCase().includes("red card")
    );
  };

  const renderTeamEvents = (teamName: string, isHome: boolean) => {
    const goals = getTeamGoals(teamName);
    const cards = getTeamCards(teamName);
    const hasEvents = goals.length > 0 || cards.length > 0;

    if (!hasEvents) return null;

    return (
      <View style={styles.teamEventsContainer}>
        {/* Goals */}
        {goals.length > 0 && (
          <View style={styles.eventsSection}>
            {goals.map((goal, index) => {
              const isPenalty = isPenaltyGoal(goal.detail);
              return (
                <View key={`goal-${index}`} style={styles.eventItem}>
                  <Text style={styles.eventTime}>
                    {t("match.goal.minute", { minute: goal.time.elapsed })}
                  </Text>
                  <View style={styles.goalIconWrapper}>
                    <GoalIcon isPenalty={isPenalty} size={12} />
                  </View>
                  <Text style={styles.eventPlayer}>
                    {goal.player?.name || "Unknown Player"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Red Cards */}
        {cards.length > 0 && (
          <View style={styles.eventsSection}>
            {cards.map((card, index) => (
              <View key={`card-${index}`} style={styles.eventItem}>
                <Text style={styles.eventTime}>
                  {t("match.goal.minute", { minute: card.time.elapsed })}
                </Text>
                <Text style={styles.eventIcon}>🟥</Text>
                <Text style={styles.eventPlayer}>
                  {card.player?.name || "Unknown Player"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* League Info */}
      <View style={styles.leagueContainer}>
        <Image
          source={{
            uri:
              fixture.league?.logo ||
              "https://via.placeholder.com/24x24/4CAF50/FFFFFF?text=PL",
          }}
          style={styles.leagueLogo}
        />
        <View style={styles.leagueInfo}>
          <Text style={styles.leagueName}>
            {fixture.league?.name || t("match.competition.default")}
          </Text>
          <Text style={styles.leagueRound}>
            {fixture.league?.round || fixture.league?.type || "Competition"} •{" "}
            {new Date(fixture.fixture.date).getFullYear()}
          </Text>
        </View>
      </View>

      {/* Match Status */}
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            {
              color: getStatusColor(fixture.fixture.status.short, theme.colors),
            },
          ]}
        >
          {getStatusDisplay(fixture.fixture.status)}
        </Text>
        {fixture.fixture.status.elapsed && (
          <Text
            style={[
              styles.elapsedText,
              {
                color: getStatusColor(
                  fixture.fixture.status.short,
                  theme.colors
                ),
              },
            ]}
          >
            {fixture.fixture.status.elapsed}'
          </Text>
        )}
      </View>

      {/* Teams and Score */}
      <View style={styles.matchContainer}>
        {/* Home Team */}
        <View style={styles.teamContainer}>
          <TeamInfo
            team={homeTeam}
            logoSize={40}
            nameSize={14}
            showWinner={true}
            style={styles.teamInfo}
            onPress={onTeamPress ? () => onTeamPress(homeTeam) : undefined}
          />

          {/* Home Team Events */}
          {showGoals && renderTeamEvents(homeTeam.name, true)}
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {formatScore(fixture.goals.home, fixture.goals.away)}
          </Text>

          {/* Half Time Score */}
          {showHalfTimeScore && (
            <Text style={styles.halftimeText}>
              HT: {fixture.score.halftime?.home || 0}-
              {fixture.score.halftime?.away || 0}
            </Text>
          )}

          {/* Penalty Score */}
          <PenaltyScore
            home={fixture.score.penalty?.home || null}
            away={fixture.score.penalty?.away || null}
          />
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          <TeamInfo
            team={awayTeam}
            logoSize={40}
            nameSize={14}
            showWinner={true}
            style={styles.teamInfo}
            onPress={onTeamPress ? () => onTeamPress(awayTeam) : undefined}
          />

          {/* Away Team Events */}
          {showGoals && renderTeamEvents(awayTeam.name, false)}
        </View>
      </View>

      {/* Match Details */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            🕐 {formatMatchDate(fixture.fixture.date)} •{" "}
            {formatMatchTime(fixture.fixture.date)}
          </Text>

          {fixture.fixture.venue && (
            <Text style={styles.detailText}>
              📍 {fixture.fixture.venue.name}, {fixture.fixture.venue.city}
            </Text>
          )}

          <Text style={styles.detailText}>👨‍⚖️ {t("match.referee.default")}</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: theme.spacing.xs / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: theme.borderRadius.sm,
      elevation: 3,
    },
    leagueContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    leagueLogo: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      marginRight: theme.spacing.sm,
    },
    leagueInfo: {
      flex: 1,
    },
    leagueName: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.caption.fontWeight,
      color: theme.colors.text,
    },
    leagueRound: {
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing.xs / 2,
      color: theme.colors.text,
      fontWeight: theme.typography.caption.fontWeight,
    },
    statusContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    statusText: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      textTransform: "uppercase",
      color: theme.colors.text,
    },
    elapsedText: {
      fontSize: theme.typography.small.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
    },
    matchContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    teamContainer: {
      flex: 1,
      alignItems: "center",
    },
    teamInfo: {
      marginBottom: theme.spacing.xs,
    },
    teamEventsContainer: {
      width: "100%",
      marginTop: theme.spacing.xs,
    },
    eventsSection: {
      marginBottom: theme.spacing.xs,
    },
    eventItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 3,
      paddingHorizontal: theme.spacing.xs / 2,
    },
    eventTime: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.caption.fontWeight,
      width: theme.spacing.xl * 1.2,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    goalIconWrapper: {
      marginRight: theme.spacing.sm,
    },
    eventIcon: {
      fontSize: theme.spacing.sm,
      marginRight: theme.spacing.xs / 2,
    },
    eventPlayer: {
      fontSize: theme.typography.small.fontSize * 0.8,
      fontWeight: theme.typography.small.fontWeight,
      flex: 1,
      color: theme.colors.text,
    },
    scoreContainer: {
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    scoreText: {
      fontSize: theme.spacing.lg,
      fontWeight: theme.typography.h3.fontWeight,
      marginBottom: theme.spacing.xs / 2,
      color: theme.colors.text,
      textAlign: "center",
    },
    halftimeText: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.caption.fontWeight,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    detailsContainer: {
      alignItems: "center",
    },
    detailText: {
      fontSize: theme.typography.caption.fontSize,
      textAlign: "center",
      marginBottom: theme.spacing.xs / 2,
      color: theme.colors.textSecondary,
    },
  });

export default MatchInfo;
