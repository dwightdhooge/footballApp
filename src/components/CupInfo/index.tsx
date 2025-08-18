import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { LeagueItem } from "../../types/api";
import FlagSvg from "../FlagSvg";

interface CupInfoProps {
  cup: LeagueItem;
}

const CupInfo: React.FC<CupInfoProps> = ({ cup }) => {
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
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: cup.league.logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.cupName, { color: theme.colors.text }]}>
          {cup.league.name}
        </Text>
        <View style={styles.countryContainer}>
          <FlagSvg url={cup.country.flag} size={16} />
          <Text
            style={[styles.countryName, { color: theme.colors.textSecondary }]}
          >
            {cup.country.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 48,
    height: 48,
  },
  infoContainer: {
    flex: 1,
  },
  cupName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryName: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default CupInfo;
