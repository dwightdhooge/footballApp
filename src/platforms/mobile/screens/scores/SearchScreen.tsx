import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Country, LeagueItem, Team, PlayerProfile } from "@/core/types/api";
import { TeamSearchResult } from "@/core/services/api/teams";
import { ScoresStackParamList } from "@/core/types/navigation";
import { useTheme } from "@/core/context/ThemeContext";
import { useSearch } from "@/core/context/SearchContext";
import { SearchBar } from "@/components/homescreen/SearchBar";
import { SearchResults } from "@/components/homescreen/SearchResults";
import { CategoryTabs } from "@/components/favorites/CategoryTabs";
import { PlaceholderState } from "@/components/utility/PlaceholderState";

type SearchScreenNavigationProp = StackNavigationProp<ScoresStackParamList>;

export const SearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();

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
    navigation.navigate("CountryDetail", { item: country });
  };

  const handleTeamPress = (team: TeamSearchResult) => {
    const teamItem: Team = {
      id: team.team.id,
      name: team.team.name,
      logo: team.team.logo,
      winner: false,
    };
    navigation.navigate("TeamDetail", { item: teamItem });
  };

  const handleLeaguePress = (league: LeagueItem) => {
    navigation.navigate("LeagueDetail", { item: league });
  };

  const handleCupPress = (cup: LeagueItem) => {
    navigation.navigate("CupDetail", { item: cup });
  };

  const handlePlayerPress = (player: PlayerProfile) => {
    navigation.navigate("PlayerDetail", { item: player });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t("search.title")}</Text>
          <View style={styles.placeholder} />
        </View>

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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
    },
    placeholder: {
      width: 40,
    },
  });
