import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import CountryCard from "@/components/CountryCard";
import { useTheme } from "@/context/ThemeContext";

interface SuggestedSectionProps {
  suggestedCountries: Country[];
  onCountryPress: (country: Country) => void;
  onHeartPress: (country: Country) => void;
  isFavorite: (countryCode: string) => boolean;
}

const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  suggestedCountries,
  onCountryPress,
  onHeartPress,
  isFavorite,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("homescreen.suggestedCountries")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {suggestedCountries.map((country) => (
          <View key={country.code} style={styles.cardContainer}>
            <CountryCard
              name={country.name}
              code={country.code}
              flag={country.flag}
              isFavorite={isFavorite(country.code)}
              onPress={() => onCountryPress(country)}
              onHeartPress={() => onHeartPress(country)}
              size="small"
              showHeart={true}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    cardContainer: {
      marginRight: theme.spacing.md,
    },
  });

export default SuggestedSection;
