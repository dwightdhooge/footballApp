import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Country } from "../../../types/api";
import FlagSvg from "../FlagSvg";
import { Ionicons } from "@expo/vector-icons";

interface CountryInfoProps {
  country: Country;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ country }) => {
  const { theme } = useTheme();
  const {
    isItemFavorite,
    addFavoriteItem,
    removeFavoriteItem,
  } = useFavorites();

  const handleHeartPress = async () => {
    try {
      if (isItemFavorite(country, "country")) {
        await removeFavoriteItem(`country_${country.code}`, "country");
      } else {
        await addFavoriteItem(country, "country");
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

      <TouchableOpacity
        style={styles.heartButton}
        onPress={handleHeartPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isItemFavorite(country, "country") ? "heart" : "heart-outline"}
          size={24}
          color={
            isItemFavorite(country, "country")
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
  heartButton: {
    padding: 8,
  },
});

export default CountryInfo;
