import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { LeagueItem } from "../../../types/api";
import FlagSvg from "../../country/FlagSvg";
import { Ionicons } from "@expo/vector-icons";

interface CupInfoProps {
  cup: LeagueItem;
}

const CupInfo: React.FC<CupInfoProps> = ({ cup }) => {
  const { theme } = useTheme();
  const {
    isItemFavorite,
    addFavoriteItem,
    removeFavoriteItem,
  } = useFavorites();

  const handleHeartPress = async () => {
    try {
      if (isItemFavorite(cup, "competition")) {
        await removeFavoriteItem(`competition_${cup.league.id}`, "competition");
      } else {
        await addFavoriteItem(cup, "competition");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

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

      <TouchableOpacity
        style={styles.heartButton}
        onPress={handleHeartPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isItemFavorite(cup, "competition") ? "heart" : "heart-outline"}
          size={24}
          color={
            isItemFavorite(cup, "competition")
              ? theme.colors.error
              : theme.colors.textSecondary
          }
        />
      </TouchableOpacity>
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
  heartButton: {
    padding: 8,
  },
});

export default CupInfo;
