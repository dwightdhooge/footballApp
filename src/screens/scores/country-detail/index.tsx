import React from "react";
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
import { LeagueItem } from "@/types/api";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCountryData } from "@/hooks";
import CountryHeader from "../../../components/CountryHeader";
import CountryInfo from "../../../components/CountryInfo";
import LeaguesSection from "../../../components/LeaguesSection";

type CountryDetailRouteProp = RouteProp<ScoresStackParamList, "CountryDetail">;
type CountryDetailNavigationProp = StackNavigationProp<ScoresStackParamList>;

const CountryDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CountryDetailNavigationProp>();
  const route = useRoute<CountryDetailRouteProp>();
  const { item: country } = route.params;

  // 🎯 Eén hook voor alle data logica!
  const {
    leagues,
    cups,
    isLoading,
    isRefreshing,
    error,
    refresh,
    clearError,
  } = useCountryData(country.code);

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

  // Show error alert if there's an error
  React.useEffect(() => {
    if (error) {
      Alert.alert("Fout", `Kon competities niet laden: ${error}`);
      clearError();
    }
  }, [error, clearError]);

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
              onRefresh={refresh}
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
