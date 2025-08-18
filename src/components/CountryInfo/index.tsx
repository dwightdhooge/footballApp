import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Country } from "../../types/api";
import FlagSvg from "../FlagSvg";

interface CountryInfoProps {
  country: Country;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ country }) => {
  const { theme } = useTheme();

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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  flag: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  countryCode: {
    fontSize: 16,
  },
});

export default CountryInfo;
