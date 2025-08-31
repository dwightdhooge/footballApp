import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Country, League, Player, Team } from "@/core/types/api";
import { useTheme } from "@/context/ThemeContext";

interface SearchResultsProps {
  results: {
    teams: Team[];
    leagues: League[];
    cups: League[];
    countries: Country[];
    players: Player[];
  };
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  selectedCategory: "players" | "teams" | "leagues" | "cups" | "countries";
  hasSearched: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchTerm,
  isLoading,
  error,
  selectedCategory,
  hasSearched,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  // Add safety checks for results
  const safeResults = {
    teams: Array.isArray(results?.teams) ? results.teams : [],
    leagues: Array.isArray(results?.leagues) ? results.leagues : [],
    cups: Array.isArray(results?.cups) ? results.cups : [],
    countries: Array.isArray(results?.countries) ? results.countries : [],
    players: Array.isArray(results?.players) ? results.players : [],
  };

  const { teams, leagues, cups, countries, players } = safeResults;

  const totalResults =
    teams.length +
    leagues.length +
    cups.length +
    countries.length +
    players.length;

  // Only show loading if we have no previous results and no current results
  const shouldShowLoading = isLoading && totalResults === 0 && !hasSearched;

  if (shouldShowLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          {t("common.searching")} "{searchTerm}"...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t("common.error")}: {error}
        </Text>
      </View>
    );
  }

  if (totalResults === 0 && hasSearched) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t("search.noResults", { query: searchTerm })}
        </Text>
      </View>
    );
  }

  const getCurrentData = () => {
    switch (selectedCategory) {
      case "players":
        return players;
      case "teams":
        return teams;
      case "leagues":
        return leagues;
      case "cups":
        return cups;
      case "countries":
        return countries;
      default:
        return teams;
    }
  };

  const renderResultCard = (item: any, index: number) => {
    const renderContent = () => {
      switch (selectedCategory) {
        case "countries":
          return (
            <View style={styles.countryCard}>
              <Text style={styles.countryName}>{item.name}</Text>
              <Text style={styles.countryCode}>{item.code}</Text>
            </View>
          );

        case "leagues":
        case "cups":
          return (
            <View style={styles.leagueCard}>
              <Text style={styles.leagueName}>{item.league.name}</Text>
              <Text style={styles.leagueType}>{item.league.type}</Text>
            </View>
          );

        case "teams":
          return (
            <View style={styles.teamCard}>
              <Text style={styles.teamName}>{item.name}</Text>
            </View>
          );

        case "players":
          return (
            <View style={styles.playerCard}>
              <Text style={styles.playerName}>
                {item.firstname} {item.lastname}
              </Text>
              <Text style={styles.playerPosition}>{item.position}</Text>
            </View>
          );

        default:
          return null;
      }
    };

    return (
      <View key={`${selectedCategory}_${index}`} style={styles.cardContainer}>
        {renderContent()}
      </View>
    );
  };

  const currentData = getCurrentData();

  if (currentData.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          No {selectedCategory} found for "{searchTerm}"
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {currentData.map((item, index) => renderResultCard(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: theme.spacing.md,
    },
    cardContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 100,
      justifyContent: "center",
      width: "48%", // Two columns with spacing
      marginBottom: theme.spacing.md,
    },
    countryCard: {
      alignItems: "center",
    },
    countryName: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    countryCode: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    leagueCard: {
      alignItems: "center",
    },
    leagueName: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    leagueType: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    teamCard: {
      alignItems: "center",
    },
    teamName: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: "center",
    },
    playerCard: {
      alignItems: "center",
    },
    playerName: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    playerPosition: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      textAlign: "center",
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    errorText: {
      textAlign: "center",
      ...theme.typography.body,
      color: theme.colors.error,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      textAlign: "center",
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      minHeight: 300,
    },
    emptyStateText: {
      textAlign: "center",
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });
