import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Country, LeagueItem } from "../../../types/api";
import { TeamSearchResult } from "@/services/api/teams";
import CountryCard from "../../country/CountryCard";
import TeamCard from "../../team/TeamCard";
import LeagueCard from "../../league/LeagueCard";
import CategoryTabs from "../../favorites/CategoryTabs";
import EmptyState from "../../utility/EmptyState";
import { useTheme } from "@/context/ThemeContext";

// Simple error boundary component
class SearchResultsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "SearchResults error boundary caught error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text>Something went wrong displaying search results.</Text>
          <Text style={{ fontSize: 12, marginTop: 10 }}>
            Error: {this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

interface SearchResultsProps {
  results: {
    teams: TeamSearchResult[];
    leagues: LeagueItem[];
    countries: Country[];
  };
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  onCountryPress: (country: Country) => void;
  onTeamPress: (team: TeamSearchResult) => void;
  onLeaguePress: (league: LeagueItem) => void;
  onHeartPress: (country: Country) => void;
  isFavorite: (countryCode: string) => boolean;
}

const SearchResults: React.FC<SearchResultsProps> = (props) => {
  return (
    <SearchResultsErrorBoundary>
      <SearchResultsContent {...props} />
    </SearchResultsErrorBoundary>
  );
};

const SearchResultsContent: React.FC<SearchResultsProps> = ({
  results,
  searchTerm,
  isLoading,
  error,
  onCountryPress,
  onTeamPress,
  onLeaguePress,
  onHeartPress,
  isFavorite,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = React.useState<
    "players" | "teams" | "leagues" | "countries"
  >("players");

  const styles = getStyles(theme);

  // Add safety checks for results
  const safeResults = {
    teams: Array.isArray(results?.teams) ? results.teams : [],
    leagues: Array.isArray(results?.leagues) ? results.leagues : [],
    countries: Array.isArray(results?.countries) ? results.countries : [],
  };

  const { teams, leagues, countries } = safeResults;

  // Determine initial category based on available results
  React.useEffect(() => {
    if (teams.length > 0) {
      setSelectedCategory("teams");
    } else if (leagues.length > 0) {
      setSelectedCategory("leagues");
    } else if (countries.length > 0) {
      setSelectedCategory("countries");
    } else {
      setSelectedCategory("players"); // Default to players if no results
    }
  }, [teams.length, leagues.length, countries.length]);

  const handleCategoryChange = (
    category: "players" | "teams" | "leagues" | "countries"
  ) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
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

  const totalResults = teams.length + leagues.length + countries.length;
  if (totalResults === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t("search.noResults", { query: searchTerm })}
        </Text>
      </View>
    );
  }

  const renderFavoriteItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const handlePress = () => {
      try {
        switch (selectedCategory) {
          case "countries":
            onCountryPress(item);
            break;
          case "leagues":
            onLeaguePress(item);
            break;
          case "teams":
            onTeamPress(item);
            break;
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    const renderCard = () => {
      switch (selectedCategory) {
        case "countries":
          return (
            <CountryCard
              name={item.name}
              code={item.code}
              flag={item.flag}
              onPress={handlePress}
              size="small"
            />
          );

        case "leagues":
          return (
            <LeagueCard
              id={item.league.id}
              name={item.league.name}
              logo={item.league.logo}
              type={item.league.type}
              onPress={handlePress}
              size="small"
            />
          );

        case "teams":
          return (
            <TeamCard
              id={item.team.id}
              name={item.team.name}
              logo={item.team.logo}
              onPress={handlePress}
              size="small"
            />
          );

        default:
          return null;
      }
    };

    return <View style={styles.cardContainer}>{renderCard()}</View>;
  };

  const categoryCounts = {
    players: 0,
    teams: teams.length,
    leagues: leagues.length,
    countries: countries.length,
  };

  const getCurrentData = () => {
    switch (selectedCategory) {
      case "players":
        return [];
      case "teams":
        return teams;
      case "leagues":
        return leagues;
      case "countries":
        return countries;
      default:
        return teams;
    }
  };

  const getItemLayout = (data: any, index: number) => ({
    length: 116, // 100 (height) + 16 (marginBottom)
    offset: Math.floor(index / 3) * 116, // 3 kolommen per rij
    index,
  });

  const getEmptyStateMessage = () => {
    const message = (() => {
      switch (selectedCategory) {
        case "players":
          return (
            t("search.noPlayersResults", { query: searchTerm }) ||
            `No players found for "${searchTerm}"`
          );
        case "teams":
          return (
            t("search.noTeamsResults", { query: searchTerm }) ||
            `No teams found for "${searchTerm}"`
          );
        case "leagues":
          return (
            t("search.noLeaguesResults", { query: searchTerm }) ||
            `No leagues found for "${searchTerm}"`
          );
        case "countries":
          return (
            t("search.noCountriesResults", { query: searchTerm }) ||
            `No countries found for "${searchTerm}"`
          );
        default:
          return (
            t("search.noResults", { query: searchTerm }) ||
            `No results found for "${searchTerm}"`
          );
      }
    })();

    console.log(
      "Empty state message for category:",
      selectedCategory,
      ":",
      message
    );
    return message;
  };

  // Only show categories that have results
  const availableCategories = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .reduce((acc, [key, count]) => {
      acc[key as keyof typeof categoryCounts] = count;
      return acc;
    }, {} as typeof categoryCounts);

  return (
    <View style={styles.container}>
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        counts={categoryCounts}
      />

      {getCurrentData().length > 0 ? (
        <FlatList
          data={getCurrentData()}
          renderItem={renderFavoriteItem}
          keyExtractor={(item, index) => `${selectedCategory}_${index}`}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayout}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <EmptyState message={getEmptyStateMessage()} icon="search-outline" />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    resultsTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    scrollView: {
      maxHeight: 600, // Limit height to prevent taking too much space
    },
    scrollContent: {
      paddingBottom: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    horizontalScroll: {
      paddingHorizontal: theme.spacing.md,
    },
    cardContainer: {
      width: "32%", // Vaste breedte voor 3 kolommen met kleine spacing
      marginHorizontal: theme.spacing.xs / 2, // 4px tussen cards (2px aan elke kant)
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
    row: {
      justifyContent: "flex-start",
      marginBottom: theme.spacing.md, // 16px tussen rijen
    },
    listContent: {
      paddingHorizontal: theme.spacing.md, // 16px padding zoals op home
      paddingBottom: theme.spacing.xl,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      minHeight: 300, // Ensure minimum height for visibility
    },
  });

export default SearchResults;
