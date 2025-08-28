import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Country } from "../../../types/api";
import FlagSvg from "../FlagSvg";

interface CountryInfoProps {
  country: Country;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ country }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <FlagSvg
        url={country.flag}
        size={48}
        onError={(error) => {
          console.warn(`Failed to load flag for ${country.name}:`, error);
        }}
        style={styles.flag}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.countryName, { color: theme.colors.text }]}>
          {country.name}
        </Text>
        <Text
          style={[styles.countryCode, { color: theme.colors.textSecondary }]}
        >
          {country.code}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
    },
    flag: {
      marginRight: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    countryName: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      marginBottom: theme.spacing.xs,
    },
    countryCode: {
      fontSize: theme.typography.body.fontSize,
    },
  });

export default CountryInfo;
