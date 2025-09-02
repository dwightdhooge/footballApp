import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Country, League, Team, Player } from "@/core/types/api";
import { useTheme } from "@/core/context/ThemeContext";
import { useSearch } from "@/core/context/SearchContext";
import { SearchBar } from "@/components/homescreen/SearchBar";
import { SearchResults } from "@/components/homescreen/SearchResults";
import { CategoryTabs } from "@/components/favorites/CategoryTabs";
import { PlaceholderState } from "@/components/utility/PlaceholderState";

export default function SearchScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    error: searchError,
    setSearchTerm,
    clearSearch,
  } = useSearch();

  const [selectedCategory, setSelectedCategory] = React.useState<
    "players" | "teams" | "leagues" | "cups" | "countries"
  >("countries");

  const handleCountryPress = (country: Country) => {
    router.push({
      pathname: `/country/${country.code}`,
      params: {
        name: country.name,
        flag: country.flag,
      },
    });
  };

  const handleTeamPress = (team: Team) => {
    router.push({
      pathname: `/team/[id]`,
      params: {
        id: team.id.toString(),
        name: team.name,
        logo: team.logo,
        country: team.country || "Unknown",
      },
    });
  };

  const handleLeaguePress = (league: League) => {
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
  };

  const handleCupPress = (cup: League) => {
    router.push({
      pathname: `/cup/[id]`,
      params: {
        id: cup.league.id.toString(),
        name: cup.league.name,
        logo: cup.league.logo,
        countryName: cup.country.name,
        seasons: JSON.stringify(cup.seasons),
      },
    });
  };

  const handlePlayerPress = (player: Player) => {
    router.push({
      pathname: `/player/[id]`,
      params: {
        id: player.id.toString(),
        name: player.name,
        firstname: player.firstname,
        lastname: player.lastname,
        photo: player.photo,
        position: player.position,
        number: player.number?.toString(),
      },
    });
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: t("search.title"),
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={clearSearch}
          isLoading={isSearching}
          isValid={searchTerm.length === 0 || searchTerm.length >= 3}
        />

        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          counts={{
            players: searchResults.players?.length || 0,
            teams: searchResults.teams?.length || 0,
            leagues: searchResults.leagues?.length || 0,
            cups: searchResults.cups?.length || 0,
            countries: searchResults.countries?.length || 0,
          }}
        />

        {searchTerm.length < 3 ? (
          <PlaceholderState message={t("search.enterQuery")} icon="search" />
        ) : (
          <SearchResults
            results={searchResults}
            searchTerm={searchTerm}
            isLoading={isSearching}
            error={searchError}
            selectedCategory={selectedCategory}
            onCountryPress={handleCountryPress}
            onTeamPress={handleTeamPress}
            onLeaguePress={handleLeaguePress}
            onCupPress={handleCupPress}
            onPlayerPress={handlePlayerPress}
            onHeartPress={() => {}} // Not needed for search
            isFavorite={() => false} // Not needed for search
            hasSearched={hasSearched}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.md,
    },
  });
