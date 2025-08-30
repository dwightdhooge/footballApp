import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CategoryTabs } from "@/components/favorites/CategoryTabs";
import { FavoritesList } from "@/components/favorites/FavoritesList";

export const FavoritesHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    favoriteCountries,
    favoriteLeagues,
    favoriteCups,
    favoriteTeams,
    favoritePlayers,
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<
    "players" | "teams" | "leagues" | "cups" | "countries"
  >("players");

  const getFavoritesForCategory = () => {
    switch (selectedCategory) {
      case "players":
        return favoritePlayers;
      case "teams":
        return favoriteTeams;
      case "leagues":
        return favoriteLeagues;
      case "cups":
        return favoriteCups;
      case "countries":
        return favoriteCountries;
      default:
        return [];
    }
  };

  const favorites = getFavoritesForCategory();

  const styles = getStyles(theme);

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
          cups: favoriteCups.length,
          countries: favoriteCountries.length,
        }}
      />

      <FavoritesList category={selectedCategory} favorites={favorites} />
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: 22,
    },
  });
