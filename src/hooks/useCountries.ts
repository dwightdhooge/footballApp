import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import { useSearch } from "@/context/SearchContext";
import { useFavorites } from "@/context/FavoritesContext";
import { SUGGESTED_COUNTRIES } from "@/utils/constants";

interface UseCountriesReturn {
  // Search related
  searchTerm: string;
  searchResults: Country[];
  isSearching: boolean;
  hasSearched: boolean;
  searchError: string | null;

  // Favorites related
  favorites: Country[];

  // Suggested countries
  suggestedCountries: Country[];

  // Actions
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  toggleFavorite: (country: Country) => void;
  isFavorite: (countryCode: string) => boolean;

  // Computed values
  shouldShowSearchResults: boolean;
  shouldShowNoResults: boolean;
  shouldShowFavorites: boolean;
  shouldShowSuggested: boolean;
}

export const useCountries = (): UseCountriesReturn => {
  const { t } = useTranslation();
  const {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    error: searchError,
    setSearchTerm,
    performSearch,
    clearSearch,
  } = useSearch();

  const {
    favoriteCountries,
    isItemFavorite,
    addFavoriteItem,
    removeFavoriteItem,
  } = useFavorites();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchTerm(query);
      if (query.trim()) {
        performSearch(query);
      } else {
        clearSearch();
      }
    },
    [setSearchTerm, performSearch, clearSearch]
  );

  const toggleFavorite = useCallback(
    async (country: Country) => {
      try {
        if (isItemFavorite(country, "country")) {
          await removeFavoriteItem(`country_${country.code}`, "country");
        } else {
          await addFavoriteItem(country, "country");
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [isItemFavorite, addFavoriteItem, removeFavoriteItem]
  );

  const isFavorite = useCallback(
    (countryCode: string) => {
      return favoriteCountries.some((country) => country.code === countryCode);
    },
    [favoriteCountries]
  );

  // Computed values for conditional rendering
  const shouldShowSearchResults =
    hasSearched && !isSearching && searchResults.length > 0;
  const shouldShowNoResults =
    hasSearched && !isSearching && searchResults.length === 0;
  const shouldShowFavorites = !hasSearched && favoriteCountries.length > 0;
  const shouldShowSuggested = !hasSearched;

  return {
    // Search related
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    searchError,

    // Favorites related
    favorites: favoriteCountries,

    // Suggested countries
    suggestedCountries: SUGGESTED_COUNTRIES,

    // Actions
    handleSearch,
    clearSearch,
    toggleFavorite,
    isFavorite,

    // Computed values
    shouldShowSearchResults,
    shouldShowNoResults,
    shouldShowFavorites,
    shouldShowSuggested,
  };
};
