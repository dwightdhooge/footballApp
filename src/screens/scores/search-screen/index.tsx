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
import { Country, LeagueItem, Team } from "@/types/api";
import { TeamSearchResult } from "@/services/api/teams";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCountries } from "@/hooks";
import SearchBar from "@/components/homescreen/SearchBar";
import SearchResults from "@/components/homescreen/SearchResults";
import CategoryTabs from "@/components/favorites/CategoryTabs";
import PlaceholderState from "@/components/utility/PlaceholderState";

type SearchScreenNavigationProp = StackNavigationProp<ScoresStackParamList>;

const SearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    searchError,
    handleSearch,
    clearSearch,
  } = useCountries();

  const [selectedCategory, setSelectedCategory] = React.useState<
    "players" | "teams" | "leagues" | "countries"
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
          onChangeText={handleSearch}
          onClear={clearSearch}
          isLoading={isSearching}
          isValid={searchTerm.length === 0 || searchTerm.length >= 3}
        />

        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          counts={{
            players: 0, // Players not implemented yet
            teams: searchResults.teams?.length || 0,
            leagues: searchResults.leagues?.length || 0,
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
      padding: 20,
      paddingBottom: 10,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    placeholder: {
      width: 40,
    },
  });

export default SearchScreen;
