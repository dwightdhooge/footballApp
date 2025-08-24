import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import { ScoresStackParamList } from "@/types/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCountries } from "@/hooks";
import FavoritesSection from "@/components/homescreen/FavoritesSection";
import SuggestedSection from "@/components/homescreen/SuggestedSection";
import { Ionicons } from "@expo/vector-icons";

type ScoresNavigationProp = StackNavigationProp<ScoresStackParamList>;

const Homescreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<ScoresNavigationProp>();

  const {
    favorites,
    suggestedCountries,
    toggleFavorite,
    isFavorite,
  } = useCountries();

  const handleCountryPress = (country: Country) => {
    navigation.navigate("CountryDetail", { item: country });
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchScreen");
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t("homescreen.title")}</Text>
            <Text style={styles.subtitle}>{t("homescreen.subtitle")}</Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {favorites.length > 0 && (
            <FavoritesSection
              favorites={favorites}
              onCountryPress={handleCountryPress}
            />
          )}

          <SuggestedSection
            suggestedCountries={suggestedCountries}
            onCountryPress={handleCountryPress}
            onHeartPress={toggleFavorite}
            isFavorite={isFavorite}
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
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    headerTextContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.textSecondary,
    },
    searchButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.md,
    },
  });

export default Homescreen;
