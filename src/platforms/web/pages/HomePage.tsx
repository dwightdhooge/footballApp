// src/platforms/web/pages/HomePage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SearchBar,
  CategoryTabs,
  SearchResults,
  SettingsScreen,
} from "../components";
import { useWebTheme } from "../context/WebThemeProvider";
import { useSearch } from "@/context/SearchContext";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "players" | "teams" | "leagues" | "cups" | "countries"
  >("teams");
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useWebTheme();
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

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleSettingsBack = () => {
    setShowSettings(false);
  };

  const counts = {
    players: searchResults.players.length,
    teams: searchResults.teams.length,
    leagues: searchResults.leagues.length,
    cups: searchResults.cups.length,
    countries: searchResults.countries.length,
  };

  if (showSettings) {
    return <SettingsScreen onBack={handleSettingsBack} />;
  }

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.appNameContainer}>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            Pro Soccer Stats
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
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
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
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              Search for countries, leagues, teams, or players to get started
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
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
    settingsButton: {
      padding: 8,
      marginLeft: 16,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    searchResultsContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
