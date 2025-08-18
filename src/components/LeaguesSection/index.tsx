import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import LeagueCard from "../LeagueCard";
import { LeagueItem } from "../../types/api";

interface LeaguesSectionProps {
  title: string;
  leagues: LeagueItem[];
  onLeaguePress: (league: LeagueItem) => void;
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
}

const LeaguesSection: React.FC<LeaguesSectionProps> = ({
  title,
  leagues,
  onLeaguePress,
  isLoading = false,
  size = "small",
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  const renderSkeletonCards = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <View key={`skeleton-${index}`} style={styles.skeletonCard}>
        <View style={styles.skeletonLogo} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonBadge} />
      </View>
    ));
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {t("leagues.noLeaguesFound", { type: title.toLowerCase() })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading
          ? renderSkeletonCards()
          : leagues.length === 0
          ? renderEmptyState()
          : leagues.map((league) => (
              <LeagueCard
                key={league.league.id}
                id={league.league.id}
                name={league.league.name}
                logo={league.league.logo}
                type={league.league.type}
                onPress={() => onLeaguePress(league)}
                size={size}
              />
            ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      color: theme.colors.text,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.sm,
    },
    skeletonCard: {
      width: 80,
      height: 100,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
      padding: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    skeletonLogo: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.border,
    },
    skeletonText: {
      width: 60,
      height: 12,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.border,
    },
    skeletonBadge: {
      width: 40,
      height: 16,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.border,
    },
    emptyState: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
  });

export default LeaguesSection;
