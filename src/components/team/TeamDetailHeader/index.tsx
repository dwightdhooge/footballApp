import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import CachedImage from "@/components/common/CachedImage";
import { Team, TeamDetail } from "@/types/api";

interface TeamDetailHeaderProps {
  team: TeamDetail;
  basicTeam: Team;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TeamDetailHeader: React.FC<TeamDetailHeaderProps> = ({
  team,
  basicTeam,
  isFavorite,
  onToggleFavorite,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.teamInfo}>
        <CachedImage
          url={team.team.logo}
          size={80}
          fallbackText={team.team.name.charAt(0)}
          borderRadius={40}
          resizeMode="contain"
          ttl={30 * 24 * 60 * 60 * 1000} // 30 days for team logos
          style={styles.teamLogo}
        />
        <View style={styles.teamText}>
          <Text style={[styles.teamName, { color: theme.colors.text }]}>
            {team.team.name}
          </Text>
          <Text
            style={[styles.teamCode, { color: theme.colors.textSecondary }]}
          >
            {team.team.code}
          </Text>
          <Text
            style={[styles.teamCountry, { color: theme.colors.textSecondary }]}
          >
            {team.team.country}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={onToggleFavorite}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
    },
    teamInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    teamLogo: {
      marginRight: theme.spacing.md,
    },
    teamText: {
      flex: 1,
    },
    teamName: {
      ...theme.typography.h2,
      marginBottom: theme.spacing.xs,
    },
    teamCode: {
      ...theme.typography.body,
      marginBottom: theme.spacing.xs,
    },
    teamCountry: {
      ...theme.typography.small,
    },
    heartButton: {
      padding: theme.spacing.sm,
    },
  });

export default TeamDetailHeader;
