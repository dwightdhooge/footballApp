// src/platforms/web/components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SearchBar } from "./SearchBar";
import { useWebTheme } from "../context/WebThemeProvider";
import { useSearch } from "@/context/SearchContext";

export const Header: React.FC = () => {
  const { theme } = useWebTheme();
  const {
    searchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
    performSearch,
  } = useSearch();

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearchClear = () => {
    clearSearch();
  };

  const handleSearchPress = () => {
    if (searchTerm.length > 0) {
      performSearch(searchTerm);
      router.push("/search");
    }
  };

  const handleHomePress = () => {
    router.push("/");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <View style={styles.appNameContainer}>
        <TouchableOpacity onPress={handleHomePress}>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            Pro Soccer Stats
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchTerm}
          onChangeText={handleSearchChange}
          onClear={handleSearchClear}
          onSearchPress={handleSearchPress}
          placeholder="Search for countries, leagues, teams..."
          isLoading={isSearching}
        />
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      gap: 16,
    },
    appNameContainer: {
      flex: 0,
      alignItems: "flex-start",
      minWidth: 120,
    },
    appName: {
      fontSize: 24,
      fontWeight: "bold",
    },
    searchContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    settingsButton: {
      padding: 8,
    },
  });
