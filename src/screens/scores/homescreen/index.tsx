import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCountries } from "@/hooks";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import FavoritesSection from "@/components/FavoritesSection";
import SuggestedSection from "@/components/SuggestedSection";

type ScoresNavigationProp = StackNavigationProp<ScoresStackParamList>;

const Homescreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<ScoresNavigationProp>();

  // 🎯 Eén hook voor alle data logica!
  const {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    favorites,
    suggestedCountries,
    handleSearch,
    clearSearch,
    toggleFavorite,
    isFavorite,
    shouldShowSearchResults,
    shouldShowNoResults,
    shouldShowFavorites,
    shouldShowSuggested,
  } = useCountries();

  const handleCountryPress = (country: Country) => {
    navigation.navigate("CountryDetail", { item: country });
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("homescreen.title")}</Text>
            <Text style={styles.subtitle}>{t("homescreen.subtitle")}</Text>
          </View>

          <SearchBar
            value={searchTerm}
            onChangeText={handleSearch}
            onClear={clearSearch}
            isLoading={isSearching}
            isValid={searchTerm.length === 0 || searchTerm.length >= 3}
          />

          {isSearching && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t("common.searching")}</Text>
            </View>
          )}

          {searchError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{searchError}</Text>
            </View>
          )}

          {shouldShowSearchResults && (
            <SearchResults
              results={searchResults}
              searchTerm={searchTerm}
              isLoading={isSearching}
              error={searchError}
              onCountryPress={handleCountryPress}
              onHeartPress={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}

          {shouldShowNoResults && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {t("search.noResults", { query: searchTerm })}
              </Text>
            </View>
          )}

          {shouldShowFavorites && (
            <FavoritesSection
              favorites={favorites}
              onCountryPress={handleCountryPress}
              onHeartPress={toggleFavorite}
            />
          )}

          {shouldShowSuggested && (
            <SuggestedSection
              suggestedCountries={suggestedCountries}
              onCountryPress={handleCountryPress}
              onHeartPress={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      padding: theme.spacing.lg,
      alignItems: "center",
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body.fontSize,
    },
    errorContainer: {
      padding: theme.spacing.lg,
      alignItems: "center",
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
    },
    noResultsContainer: {
      padding: theme.spacing.lg,
      alignItems: "center",
    },
    noResultsText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
    },
  });

export default Homescreen;
