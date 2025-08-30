import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Standing } from "@/types/api";
import { TeamRow } from "./../team/TeamRow";

interface StandingsTableProps {
  standings: Standing[];
  onTeamPress: (team: any) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onTeamPress,
}) => {
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      {/* Pos - width: 30, center aligned */}
      <View style={styles.headerCellPos}>
        <Text style={styles.headerText}>Pos</Text>
      </View>

      {/* Team - flex: 1, left aligned */}
      <View style={styles.headerCellTeam}>
        <Text style={styles.headerTextTeam}>Team</Text>
      </View>

      {/* Stats container - width: 120, with 6 columns evenly spaced */}
      <View style={styles.headerCellStats}>
        <View style={styles.statsHeaderRow}>
          <Text style={styles.headerTextStat}>P</Text>
          <Text style={styles.headerTextStat}>W</Text>
          <Text style={styles.headerTextStat}>D</Text>
          <Text style={styles.headerTextStat}>L</Text>
          <Text style={styles.headerTextStat}>GF</Text>
          <Text style={styles.headerTextStat}>GA</Text>
        </View>
      </View>

      {/* Points & GD - width: 40, center aligned */}
      <View style={styles.headerCellPoints}>
        <Text style={styles.headerText}>Pts</Text>
      </View>
    </View>
  );

  const renderTeamRows = () => (
    <>
      {standings.map((standing, index) => (
        <TeamRow
          key={`${standing.team.id}-${standing.rank}-${index}`}
          rank={standing.rank}
          team={standing.team}
          points={standing.points}
          goalsDiff={standing.goalsDiff}
          form={standing.form}
          status={standing.status}
          description={standing.description}
          played={standing.all.played}
          won={standing.all.win}
          drawn={standing.all.draw}
          lost={standing.all.lose}
          goalsFor={standing.all.goals.for}
          goalsAgainst={standing.all.goals.against}
          onPress={() => onTeamPress(standing.team)}
          showForm={false}
          showStatus={false}
          size="standard"
        />
      ))}
    </>
  );

  return (
    <ScrollView style={styles.standingsContainer}>
      {renderTableHeader()}
      {renderTeamRows()}
    </ScrollView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    standingsContainer: {
      flex: 1,
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    headerText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      ...theme.typography.small,
    },
    headerCellPos: {
      width: 30,
      alignItems: "center",
    },
    headerCellTeam: {
      flex: 1,
      alignItems: "flex-start",
    },
    headerCellStats: {
      width: 120,
    },
    headerCellPoints: {
      width: 40,
      alignItems: "center",
    },
    headerTextTeam: {
      color: theme.colors.textSecondary,
      ...theme.typography.small,
      textAlign: "left",
    },
    headerTextStat: {
      color: theme.colors.textSecondary,
      ...theme.typography.small,
      flex: 1,
      textAlign: "center",
    },
    statsHeaderRow: {
      flexDirection: "row",
      width: 120,
      justifyContent: "space-between",
    },
  });
