import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Lineup, Event } from "../../types/api";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import GoalIcon from "../GoalIcon";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../common/StateComponents";
import {
  hasPlayerScored,
  hasPlayerScoredPenalty,
  hasPlayerYellowCard,
  hasPlayerRedCard,
  hasPlayerBeenSubstitutedOut,
  hasPlayerBeenSubstitutedIn,
  getPlayerSubstitutionMinute,
} from "../../utils/eventUtils";

interface LineupsGridProps {
  lineups: Lineup[];
  isLoading: boolean;
  error: string | null;
  onPlayerPress?: (player: any) => void;
  events?: Event[];
  onRetry?: () => void;
}

const LineupsGrid: React.FC<LineupsGridProps> = ({
  lineups,
  isLoading,
  error,
  onPlayerPress,
  events = [],
  onRetry,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Player status functions now use imported utilities
  const getPlayerStatus = (playerName: string) => ({
    hasScored: hasPlayerScored(playerName, events),
    hasScoredPenalty: hasPlayerScoredPenalty(playerName, events),
    hasYellowCard: hasPlayerYellowCard(playerName, events),
    hasRedCard: hasPlayerRedCard(playerName, events),
    hasBeenSubstitutedOut: hasPlayerBeenSubstitutedOut(playerName, events),
    hasBeenSubstitutedIn: hasPlayerBeenSubstitutedIn(playerName, events),
    substitutionMinute: getPlayerSubstitutionMinute(playerName, events),
  });

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <LoadingState message={t("lineups.loadingLineups")} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <ErrorState
          error={error}
          title={t("lineups.errorLoadingLineups")}
          onRetry={onRetry}
        />
      </View>
    );
  }

  if (lineups.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <EmptyState
          icon="👥"
          title={t("lineups.noLineupsAvailable")}
          message={t("lineups.teamLineupsNotAvailable")}
        />
      </View>
    );
  }

  const renderTeamLineup = (lineup: Lineup, isHome: boolean) => {
    return (
      <View key={lineup.team.id} style={styles.teamContainer}>
        {/* Team Header */}
        <View style={styles.teamHeader}>
          {lineup.team.logo && (
            <Image source={{ uri: lineup.team.logo }} style={styles.teamLogo} />
          )}
          <View style={styles.teamInfo}>
            <Text style={[styles.teamName, { color: theme.colors.text }]}>
              {lineup.team.name}
            </Text>
          </View>
        </View>

        {/* Coach & Formation Info */}
        {(lineup.coach || lineup.formation) && (
          <View style={styles.teamDetails}>
            {lineup.coach && (
              <Text
                style={[
                  styles.coachName,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("lineups.coach")}: {lineup.coach.name}
              </Text>
            )}
            {lineup.formation && (
              <Text
                style={[
                  styles.formation,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("lineups.formation")}: {lineup.formation}
              </Text>
            )}
          </View>
        )}

        {/* Starting XI */}
        <View style={styles.section}>
          <View style={styles.playersGrid}>
            {lineup.startXI.map((playerData, index) => {
              const playerStatus = getPlayerStatus(playerData.player.name);
              const {
                hasScored,
                hasScoredPenalty,
                hasYellowCard,
                hasRedCard,
                hasBeenSubstitutedOut,
                hasBeenSubstitutedIn,
                substitutionMinute,
              } = playerStatus;

              return (
                <View key={index} style={styles.playerItem}>
                  <Text style={[styles.playerNumber]}>
                    {playerData.player.number}
                  </Text>
                  <Text
                    style={[styles.playerName, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {playerData.player.name}
                  </Text>
                  <View style={styles.eventIcons}>
                    {hasScored && (
                      <GoalIcon isPenalty={hasScoredPenalty} size={12} />
                    )}
                    {(hasYellowCard || hasRedCard) && (
                      <View style={styles.cardIcons}>
                        {hasYellowCard && (
                          <Text style={styles.yellowCardIcon}>🟨</Text>
                        )}
                        {hasRedCard && (
                          <Text style={styles.redCardIcon}>🟥</Text>
                        )}
                      </View>
                    )}
                    {hasBeenSubstitutedOut && (
                      <Text
                        style={[
                          styles.substitutionIcon,
                          { color: theme.colors.error },
                        ]}
                      >
                        ←
                      </Text>
                    )}
                    {hasBeenSubstitutedIn && (
                      <Text
                        style={[
                          styles.substitutionIcon,
                          { color: theme.colors.success },
                        ]}
                      >
                        →
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Substitutes */}
        {lineup.substitutes && lineup.substitutes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t("lineups.substitutes")} ({lineup.substitutes.length})
            </Text>
            <View style={styles.playersGrid}>
              {lineup.substitutes.map((playerData, index) => {
                const playerStatus = getPlayerStatus(playerData.player.name);
                const {
                  hasScored,
                  hasScoredPenalty,
                  hasYellowCard,
                  hasRedCard,
                  hasBeenSubstitutedOut,
                  hasBeenSubstitutedIn,
                  substitutionMinute,
                } = playerStatus;

                return (
                  <View key={index} style={styles.playerItem}>
                    <Text style={[styles.playerNumber]}>
                      {playerData.player.number}
                    </Text>
                    <Text
                      style={[styles.playerName, { color: theme.colors.text }]}
                      numberOfLines={2}
                    >
                      {playerData.player.name}
                    </Text>
                    <View style={styles.eventIcons}>
                      {hasScored && (
                        <GoalIcon isPenalty={hasScoredPenalty} size={12} />
                      )}
                      {(hasYellowCard || hasRedCard) && (
                        <View style={styles.cardIcons}>
                          {hasYellowCard && (
                            <Text style={styles.yellowCardIcon}>🟨</Text>
                          )}
                          {hasRedCard && (
                            <Text style={styles.redCardIcon}>🟥</Text>
                          )}
                        </View>
                      )}
                      {hasBeenSubstitutedOut && (
                        <Text
                          style={[
                            styles.substitutionIcon,
                            { color: theme.colors.error },
                          ]}
                        >
                          ←
                        </Text>
                      )}
                      {hasBeenSubstitutedIn && (
                        <Text
                          style={[
                            styles.substitutionIcon,
                            { color: theme.colors.success },
                          ]}
                        >
                          →
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.lineupsContainer}>
        {lineups.map((lineup, index) => (
          <View key={lineup.team.id} style={styles.teamColumn}>
            {renderTeamLineup(lineup, index === 0)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lineupsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  teamContainer: {
    marginBottom: 16,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  teamDetails: {
    marginBottom: 12,
    paddingLeft: 0, // Left align with players section
  },
  coachName: {
    fontSize: 12,
    marginBottom: 2,
  },
  formation: {
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  playersGrid: {
    flexDirection: "column",
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    padding: 6,
    borderRadius: 6,
    justifyContent: "space-between",
  },
  playerNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 20,
  },
  playerName: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  yellowCardIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  redCardIcon: {
    fontSize: 12,
    marginRight: 2,
    position: "absolute",
    top: -2,
    left: 0,
    zIndex: 1,
  },
  cardIcons: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: 2,
  },
  eventIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  substitutionIcon: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
    marginRight: 2,
  },
  substitutionMinute: {
    fontSize: 10,
    marginLeft: 2,
    marginRight: 2,
    fontStyle: "italic",
  },
});

export default LineupsGrid;
