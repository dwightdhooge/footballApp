import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import CategoryTabs from "@/components/favorites/CategoryTabs";
import FavoritesList from "@/components/favorites/FavoritesList";
import EmptyState from "@/components/utility/EmptyState";

const FavoritesHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    favoriteCountries,
    favoriteCompetitions,
    favoriteTeams,
    favoritePlayers,
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<
    "countries" | "competitions" | "teams" | "players"
  >("countries");

  const getFavoritesForCategory = () => {
    switch (selectedCategory) {
      case "countries":
        return favoriteCountries;
      case "competitions":
        return favoriteCompetitions;
      case "teams":
        return favoriteTeams;
      case "players":
        return favoritePlayers;
      default:
        return [];
    }
  };

  const getEmptyStateMessage = () => {
    switch (selectedCategory) {
      case "countries":
        return t("favorites.emptyCountries");
      case "competitions":
        return t("favorites.emptyCompetitions");
      case "teams":
        return t("favorites.emptyTeams");
      case "players":
        return t("favorites.emptyPlayers");
      default:
        return t("favorites.emptyGeneral");
    }
  };

  const favorites = getFavoritesForCategory();
  const hasFavorites = favorites.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("favorites.title")}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t("favorites.subtitle")}
        </Text>
      </View>

      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        counts={{
          countries: favoriteCountries.length,
          competitions: favoriteCompetitions.length,
          teams: favoriteTeams.length,
          players: favoritePlayers.length,
        }}
      />

      {hasFavorites ? (
        <FavoritesList category={selectedCategory} favorites={favorites} />
      ) : (
        <EmptyState message={getEmptyStateMessage()} icon="heart-outline" />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default FavoritesHomeScreen;
