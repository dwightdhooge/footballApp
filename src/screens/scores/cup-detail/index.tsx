import React, { useLayoutEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LeagueItem, Fixture } from "../../../types/api";
import { ScoresStackParamList } from "../../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useCupData } from "@/hooks";
import { DetailHeaderTitle, DetailHeaderButton } from "@/components";
import CachedImage from "@/components/common/CachedImage";

// Components
import SeasonDropdown from "../../../components/league/SeasonDropdown";
import RoundDropdown from "../../../components/cup/RoundDropdown";
import MatchesList from "../../../components/match/MatchesList";

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

  // Set up header with cup info and favorite button
  useLayoutEffect(() => {
    const logo = (
      <CachedImage
        url={cup.league.logo}
        size={24}
        fallbackText="Cup"
        borderRadius={4}
        resizeMode="contain"
        ttl={30 * 24 * 60 * 60 * 1000} // 30 days for cup logos
        style={styles.headerCupLogo}
      />
    );

    navigation.setOptions({
      headerTitle: () => (
        <DetailHeaderTitle
          logo={logo}
          title={cup.league.name}
          subtitle={cup.country.name}
        />
      ),
      headerRight: () => (
        <DetailHeaderButton item={cup} type="cup" style={styles.headerButton} />
      ),
    });
  }, [navigation, cup, styles.headerButton, styles.headerCupLogo]);

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
    headerCupLogo: {
      marginRight: theme.spacing.sm,
    },
    headerButton: {
      paddingHorizontal: theme.spacing.md,
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

export default CupDetailScreen;
