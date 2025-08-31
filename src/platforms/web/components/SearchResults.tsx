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
import { useWebTheme } from "../context/WebThemeProvider";
import { CountryCard, LeagueCard, TeamCard, PlayerCard } from "./cards";

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
  const { theme } = useWebTheme();
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
            <CountryCard
              name={item.name}
              code={item.code}
              flag={item.flag}
              onPress={() => {}} // TODO: Add navigation
              size="small"
            />
          );

        case "leagues":
        case "cups":
          return (
            <LeagueCard
              id={item.league.id}
              name={item.league.name}
              logo={item.league.logo}
              type={item.league.type}
              onPress={() => {}} // TODO: Add navigation
              size="small"
            />
          );

        case "teams":
          return (
            <TeamCard
              id={item.id}
              name={item.name}
              logo={item.logo}
              onPress={() => {}} // TODO: Add navigation
              size="small"
            />
          );

        case "players":
          return (
            <PlayerCard
              id={item.id}
              name={item.name}
              firstname={item.firstname}
              lastname={item.lastname}
              photo={item.photo}
              position={item.position || ""}
              onPress={() => {}} // TODO: Add navigation
            />
          );

        default:
          return null;
      }
    };

    return <View key={`${selectedCategory}_${index}`}>{renderContent()}</View>;
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

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: theme.spacing.md,
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
      justifyContent: "flex-start",
      padding: theme.spacing.md,
      gap: theme.spacing.md,
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
