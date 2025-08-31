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
import { LeagueCard } from "./../league/LeagueCard";
import { League } from "@/types/api";

interface LeaguesSectionProps {
  title: string;
  leagues: League[];
  onLeaguePress: (league: League) => void;
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
}

export const LeaguesSection: React.FC<LeaguesSectionProps> = ({
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
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      color: theme.colors.text,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.xs,
    },
    skeletonCard: {
      width: theme.cards.small.width,
      height: theme.cards.small.height,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
      padding: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    skeletonLogo: {
      width: theme.cards.small.logoSize,
      height: theme.cards.small.logoSize,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.border,
    },
    skeletonText: {
      width: theme.cards.small.width * 0.6,
      height: theme.cards.small.fontSize,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.border,
    },
    skeletonBadge: {
      width: theme.cards.small.width * 0.8,
      height: theme.cards.small.fontSize * 1.5,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.border,
    },
    emptyState: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    },
    emptyText: {
      fontSize: theme.typography.caption.fontSize,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
  });
