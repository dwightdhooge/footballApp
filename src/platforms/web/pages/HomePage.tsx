// src/platforms/web/pages/HomePage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SearchBar, CategoryTabs, SearchResults } from "../components";
import { useTheme } from "@/context/ThemeContext";
import { useSearch } from "@/context/SearchContext";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "players" | "teams" | "leagues" | "cups" | "countries"
  >("teams");
  const { theme } = useTheme();
  const {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    error,
    setSearchTerm,
    clearSearch,
  } = useSearch();

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearchClear = () => {
    clearSearch();
  };

  const handleCategoryChange = (
    category: "players" | "teams" | "leagues" | "cups" | "countries"
  ) => {
    setSelectedCategory(category);
  };

  const counts = {
    players: searchResults.players.length,
    teams: searchResults.teams.length,
    leagues: searchResults.leagues.length,
    cups: searchResults.cups.length,
    countries: searchResults.countries.length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.appNameContainer}>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            ConvoApp
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchTerm}
            onChangeText={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Search for countries, leagues, teams..."
            isLoading={isSearching}
          />
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {hasSearched && (
        <View style={styles.searchResultsContainer}>
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            counts={counts}
          />
          <SearchResults
            results={searchResults}
            searchTerm={searchTerm}
            isLoading={isSearching}
            error={error}
            selectedCategory={selectedCategory}
            hasSearched={hasSearched}
          />
        </View>
      )}

      {!hasSearched && (
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Search for countries, leagues, teams, or players to get started
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  appNameContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 2,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  rightSpacer: {
    flex: 1,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 400,
  },
});
