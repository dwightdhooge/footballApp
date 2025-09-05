import React from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Fixture } from "@/core/types/api";
import { useTheme } from "@/core/context/ThemeContext";
import { useFavorites } from "@/core/context/FavoritesContext";
import { useCupData } from "@/core/hooks/useCupData";
import { Ionicons } from "@expo/vector-icons";
import { SeasonDropdown } from "@/components/common/SeasonDropdown";
import { RoundDropdown } from "@/components/common/RoundDropdown";
import { MatchesList } from "@/components/match/MatchesList";
import { PlaceholderState } from "@/components/utility/PlaceholderState";
import { FavoriteButton } from "@/components/common/FavoriteButton";

export default function CupDetailScreen() {
  const { id, name, logo, countryName, seasons } = useLocalSearchParams<{
    id: string;
    name?: string;
    logo?: string;
    countryName?: string;
    seasons?: string;
  }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isItemFavorite, toggleFavoriteItem } = useFavorites();

  const styles = getStyles(theme);

  // Parse seasons from URL params if provided
  const parsedSeasons = seasons ? JSON.parse(seasons) : [];

  // Create a cup object for the hook
  const cupItem = {
    league: {
      id: parseInt(id),
      name: name || "Cup",
      logo: logo || "",
      type: "Cup" as const,
    },
    country: {
      name: countryName || "Country",
      code: "",
      flag: "",
    },
    seasons: parsedSeasons,
  };

  const isCupFavorite = isItemFavorite(cupItem, "cup");

  // Hook for all data logic
  const {
    selectedSeason,
    setSelectedSeason,
    availableSeasons,
    rounds,
    currentRound,
    selectedRound,
    setSelectedRound,
    fixtures,
    isLoadingRounds,
    isLoadingFixtures,
    roundsError,
    fixturesError,
    refetchRounds,
    refetchFixtures,
  } = useCupData(parseInt(id), parsedSeasons);

  const handleSeasonChange = (season: any) => {
    setSelectedSeason(season);
    setSelectedRound(null);
  };

  const handleRoundChange = (round: string) => {
    setSelectedRound(round);
  };

  const handleMatchPress = (fixture: Fixture) => {
    const completeFixture = fixtures.find(
      (f) => f.fixture.id === fixture.fixture.id
    );
    router.push({
      pathname: `/match/[id]`,
      params: {
        id: fixture.fixture.id.toString(),
        fixture: JSON.stringify(completeFixture || fixture),
        leagueId: id,
        season: selectedSeason?.year?.toString(),
      },
    });
  };

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.cupNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: cupItem.league.name,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <FavoriteButton
              item={cupItem}
              type="cup"
              size={24}
              style={styles.favoriteButton}
            />
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.dropdownsContainer}>
          <View style={styles.seasonDropdown}>
            <SeasonDropdown
              seasons={availableSeasons}
              selectedSeason={selectedSeason}
              onSeasonChange={handleSeasonChange}
              disabled={false}
              placeholder={t("leagueDetail.selectSeason")}
              showCurrent={true}
              size="medium"
              coverageType="fixtures"
            />
          </View>

          {selectedSeason && (
            <RoundDropdown
              rounds={rounds}
              selectedRound={selectedRound}
              onRoundChange={handleRoundChange}
              currentRound={currentRound}
              disabled={isLoadingRounds}
              placeholder={t("leagueDetail.selectRound")}
              size="medium"
              showCurrent={true}
            />
          )}
        </View>

        <MatchesList
          fixtures={fixtures}
          onMatchPress={handleMatchPress}
          isLoading={isLoadingFixtures}
          error={fixturesError}
          onRetry={refetchFixtures}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    dropdownsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    seasonDropdown: {
      marginBottom: theme.spacing.md,
    },
    roundDropdown: {
      marginBottom: 0,
    },
    matchesContainer: {
      flex: 1,
    },
  });
