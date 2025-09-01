// src/platforms/web/app/search.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Layout } from "../components/Layout";
import { CategoryTabs, SearchResults } from "../components";
import { useWebTheme } from "../context/WebThemeProvider";
import { useSearch } from "@/context/SearchContext";

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "players" | "teams" | "leagues" | "cups" | "countries"
  >("teams");
  const { theme } = useWebTheme();
  const {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    error,
  } = useSearch();

  const handleCategoryChange = (
    category: "players" | "teams" | "leagues" | "cups" | "countries"
  ) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    router.back();
  };

  const counts = {
    players: searchResults.players.length,
    teams: searchResults.teams.length,
    leagues: searchResults.leagues.length,
    cups: searchResults.cups.length,
    countries: searchResults.countries.length,
  };

  const styles = getStyles(theme);

  return (
    <Layout>
      <View style={styles.mainContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Search</Text>

        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          counts={counts}
        />

        {hasSearched ? (
          <SearchResults
            results={searchResults}
            searchTerm={searchTerm}
            isLoading={isSearching}
            error={error}
            selectedCategory={selectedCategory}
            hasSearched={hasSearched}
          />
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>Search</Text>
            <Text style={styles.subtitle}>
              Enter at least 3 characters to start searching for countries,
              leagues, teams, or players
            </Text>
          </View>
        )}
      </View>
    </Layout>
  );
}

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignSelf: "flex-start",
    },
    backText: {
      marginLeft: 8,
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "500",
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      color: theme.colors.text,
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
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: "center",
      maxWidth: 400,
      color: theme.colors.textSecondary,
    },
  });
