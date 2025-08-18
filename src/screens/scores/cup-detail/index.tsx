import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LeagueItem, Fixture } from "../../../types/api";
import { ScoresStackParamList } from "../../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useCupData } from "@/hooks";

// Components
import CupHeader from "../../../components/CupHeader";
import CupInfo from "../../../components/CupInfo";
import SeasonDropdown from "../../../components/SeasonDropdown";
import RoundDropdown from "../../../components/RoundDropdown";
import MatchesList from "../../../components/MatchesList";

// Verwijderd: canShowFixtures import (nu in hook)
// import { canShowFixtures } from "../../../utils/helpers";

type CupDetailScreenNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "CupDetail"
>;

type CupDetailScreenRouteProp = RouteProp<ScoresStackParamList, "CupDetail">;

const CupDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<CupDetailScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { item: cup } = route.params;

  const styles = getStyles(theme);

  // 🎯 Eén hook voor alle data logica!
  const {
    selectedSeason,
    setSelectedSeason,
    availableSeasons, // 🎯 Nu uit de hook
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
  } = useCupData(cup.league.id, cup.seasons);

  // Verwijderd: lokaal berekende availableSeasons
  // const availableSeasons = cup.seasons?.filter(canShowFixtures).reverse() || [];

  const handleSeasonChange = (season: any) => {
    setSelectedSeason(season);
    setSelectedRound(null);
  };

  const handleRoundChange = (round: string) => {
    setSelectedRound(round);
  };

  const handleRetry = () => {
    if (selectedSeason) {
      refetchRounds();
    }
  };

  const handleMatchPress = (fixture: Fixture) => {
    const completeFixture = fixtures.find(
      (f) => f.fixture.id === fixture.fixture.id
    );
    navigation.navigate("MatchDetail", {
      item: completeFixture || fixture,
      leagueId: cup.league.id,
      season: selectedSeason?.year,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CupHeader title={cup.league.name} />
      <CupInfo cup={cup} />

      <View style={styles.content}>
        <View style={styles.dropdownsContainer}>
          <SeasonDropdown
            seasons={availableSeasons}
            selectedSeason={selectedSeason}
            onSeasonChange={handleSeasonChange}
            disabled={false}
            placeholder={t("leagueDetail.selectSeason")}
            showCurrent={true}
            size="medium"
            coverageType="fixtures"
            style={styles.seasonDropdown}
          />

          <RoundDropdown
            rounds={rounds}
            selectedRound={selectedRound}
            currentRound={currentRound}
            onRoundChange={handleRoundChange}
            disabled={isLoadingRounds || !selectedSeason}
            placeholder={t("cupDetail.selectRound")}
            showCurrent={true}
            size="medium"
            style={styles.roundDropdown}
          />
        </View>

        <View style={styles.matchesContainer}>
          <MatchesList
            fixtures={fixtures}
            isLoading={isLoadingFixtures}
            error={fixturesError}
            onMatchPress={handleMatchPress}
            onRetry={handleRetry}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    dropdownsContainer: {
      borderBottomWidth: 1,
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    seasonDropdown: {
      marginBottom: theme.spacing.sm,
    },
    roundDropdown: {
      marginBottom: 0,
    },
    matchesContainer: {
      flex: 1,
    },
  });

export default CupDetailScreen;
