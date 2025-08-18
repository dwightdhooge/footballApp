import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Country, LeagueItem } from "@/types/api";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import CountryHeader from "../../../components/CountryHeader";
import CountryInfo from "../../../components/CountryInfo";
import LeaguesSection from "../../../components/LeaguesSection";
import { fetchLeaguesForCountry } from "@/services/api/leagues";

type CountryDetailRouteProp = RouteProp<ScoresStackParamList, "CountryDetail">;
type CountryDetailNavigationProp = StackNavigationProp<ScoresStackParamList>;

const CountryDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CountryDetailNavigationProp>();
  const route = useRoute<CountryDetailRouteProp>();
  const { item: country } = route.params;

  const [leagues, setLeagues] = useState<LeagueItem[]>([]);
  const [cups, setCups] = useState<LeagueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaguesData();
  }, [country.code]);

  const loadLeaguesData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const leaguesData = await fetchLeaguesForCountry(country.code);

      // Separate leagues and cups
      const leaguesList = leaguesData.filter(
        (item) => item.league.type === "League"
      );
      const cupsList = leaguesData.filter((item) => item.league.type === "Cup");

      setLeagues(leaguesList);
      setCups(cupsList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Onbekende fout opgetreden";
      setError(errorMessage);
      Alert.alert("Fout", `Kon competities niet laden: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLeaguesData();
    setIsRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLeaguePress = (league: LeagueItem) => {
    if (league.league.type === "League") {
      navigation.navigate("LeagueDetail", { item: league });
    } else {
      navigation.navigate("CupDetail", { item: league });
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CountryHeader country={country} onBack={handleBack} />
        <CountryInfo country={country} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <LeaguesSection
            title="Leagues"
            leagues={leagues}
            onLeaguePress={handleLeaguePress}
            isLoading={isLoading}
            size="small"
          />

          <LeaguesSection
            title="Cups"
            leagues={cups}
            onLeaguePress={handleLeaguePress}
            isLoading={isLoading}
            size="small"
          />
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
      paddingBottom: theme.spacing.xl,
    },
  });

export default CountryDetailScreen;
