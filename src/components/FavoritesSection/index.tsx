import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import CountryCard from "@/components/CountryCard";
import { useTheme } from "@/context/ThemeContext";

interface FavoritesSectionProps {
  favorites: Country[];
  onCountryPress: (country: Country) => void;
  onHeartPress: (country: Country) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  onCountryPress,
  onHeartPress,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("favorites.title")}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t("favorites.noFavorites")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("favorites.title")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {favorites.map((favorite) => (
          <View key={favorite.code} style={styles.cardContainer}>
            <CountryCard
              name={favorite.name}
              code={favorite.code}
              flag={favorite.flag}
              isFavorite={true}
              onPress={() => onCountryPress(favorite)}
              onHeartPress={() => onHeartPress(favorite)}
              size="small"
              showHeart={true}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    cardContainer: {
      marginRight: theme.spacing.md,
    },
    emptyContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    emptyText: {
      textAlign: "center",
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });

export default FavoritesSection;
