import React from "react";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/context/ThemeContext";
import { useFavorites } from "@/core/context/FavoritesContext";
import { useCountryData } from "@/core/hooks/useCountryData";
import { LeaguesSection } from "@/components/country/LeaguesSection";
import { PlaceholderState } from "@/components/utility/PlaceholderState";

export default function CountryDetailScreen() {
  const { code } = useLocalSearchParams<{
    code: string;
  }>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    country,
    leagues,
    cups,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useCountryData(code);

  const isCountryFavorite = isFavorite(country?.code || "");

  const styles = getStyles(theme);

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("common.loading")}
          icon="hourglass-outline"
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState message={error} icon="alert-circle-outline" />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.countryNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: country.name || code?.toUpperCase() || "Country Details",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(country)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isCountryFavorite ? "heart" : "heart-outline"}
                size={24}
                color={
                  isCountryFavorite ? theme.colors.error : theme.colors.text
                }
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <LeaguesSection
          title={t("countryDetail.leagues")}
          leagues={leagues}
          onLeaguePress={(league) => {
            router.push({
              pathname: `/league/[id]`,
              params: {
                id: league.league.id.toString(),
                name: league.league.name,
                logo: league.league.logo,
                countryName: league.country.name,
                seasons: JSON.stringify(league.seasons),
              },
            });
          }}
          isLoading={isLoading}
          size="small"
        />

        <LeaguesSection
          title={t("countryDetail.cups")}
          leagues={cups}
          onLeaguePress={(league) => {
            router.push({
              pathname: `/cup/[id]`,
              params: {
                id: league.league.id.toString(),
                name: league.league.name,
                logo: league.league.logo,
                countryName: league.country.name,
                seasons: JSON.stringify(league.seasons),
              },
            });
          }}
          isLoading={isLoading}
          size="small"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
  });
