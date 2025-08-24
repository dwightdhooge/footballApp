import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import CategoryTabs from "@/components/favorites/CategoryTabs";
import FavoritesList from "@/components/favorites/FavoritesList";

const FavoritesHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    favoriteCountries,
    favoriteLeagues,
    favoriteTeams,
    favoritePlayers,
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<
    "players" | "teams" | "leagues" | "countries"
  >("players");

  const getFavoritesForCategory = () => {
    switch (selectedCategory) {
      case "players":
        return favoritePlayers;
      case "teams":
        return favoriteTeams;
      case "leagues":
        return favoriteLeagues;
      case "countries":
        return favoriteCountries;
      default:
        return [];
    }
  };

  const favorites = getFavoritesForCategory();

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
          players: favoritePlayers.length,
          teams: favoriteTeams.length,
          leagues: favoriteLeagues.length,
          countries: favoriteCountries.length,
        }}
      />

      <FavoritesList category={selectedCategory} favorites={favorites} />
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
