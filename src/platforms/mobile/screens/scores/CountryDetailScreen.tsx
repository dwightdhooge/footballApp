import React, { useLayoutEffect } from "react";
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
import { useTranslation } from "react-i18next";
import { LeagueItem } from "@/types/api";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCountryData } from "@/hooks/useCountryData";
import { FlagSvg } from "@/components/country/FlagSvg";
import { LeaguesSection } from "@/components/country/LeaguesSection";
import {
  DetailHeaderTitle,
  DetailHeaderButton,
} from "@/components/common/DetailHeader";

type CountryDetailRouteProp = RouteProp<ScoresStackParamList, "CountryDetail">;
type CountryDetailNavigationProp = StackNavigationProp<ScoresStackParamList>;

export const CountryDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<CountryDetailNavigationProp>();
  const route = useRoute<CountryDetailRouteProp>();
  const { item: country } = route.params;

  const styles = getStyles(theme);

  // Set up header with country info and favorite button
  useLayoutEffect(() => {
    const logo = <FlagSvg url={country.flag} size={24} />;

    navigation.setOptions({
      headerTitle: () => <DetailHeaderTitle logo={logo} title={country.name} />,
      headerRight: () => (
        <DetailHeaderButton
          item={country}
          type="country"
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation, country, styles.headerButton]);

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
      Alert.alert(
        t("common.error"),
        t("countryDetail.errorLoadingCompetitions", { error })
      );
      clearError();
    }
  }, [error, clearError, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            onLeaguePress={handleLeaguePress}
            isLoading={isLoading}
            size="small"
          />

          <LeaguesSection
            title={t("countryDetail.cups")}
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
    headerTitle: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerCountryName: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
    },
    headerButton: {
      paddingHorizontal: theme.spacing.md,
    },
  });
