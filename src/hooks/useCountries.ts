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

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

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

  // Computed values for conditional rendering
  const shouldShowSearchResults =
    hasSearched && !isSearching && searchResults.length > 0;
  const shouldShowNoResults =
    hasSearched && !isSearching && searchResults.length === 0;
  const shouldShowFavorites = !hasSearched && favorites.length > 0;
  const shouldShowSuggested = !hasSearched;

  return {
    // Search related
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    searchError,

    // Favorites related
    favorites,

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
