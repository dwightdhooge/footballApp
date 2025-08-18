import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import CountryCard from "@/components/CountryCard";
import { useTheme } from "@/context/ThemeContext";

interface SearchResultsProps {
  results: Country[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  onCountryPress: (country: Country) => void;
  onHeartPress: (country: Country) => void;
  isFavorite: (countryCode: string) => boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchTerm,
  isLoading,
  error,
  onCountryPress,
  onHeartPress,
  isFavorite,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

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

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t("search.noResults", { query: searchTerm })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultsTitle}>
        {t("search.resultsFor", { query: searchTerm, count: results.length })}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {results.map((country) => (
          <View key={country.code} style={styles.cardContainer}>
            <CountryCard
              name={country.name}
              code={country.code}
              flag={country.flag}
              isFavorite={isFavorite(country.code)}
              onPress={() => onCountryPress(country)}
              onHeartPress={() => onHeartPress(country)}
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
    resultsTitle: {
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
  });

export default SearchResults;
