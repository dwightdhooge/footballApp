import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import { fetchCountries } from "@/services/api/countries";
import { debounce, isValidSearch } from "@/utils/helpers";

interface SearchContextType {
  searchTerm: string;
  searchResults: Country[];
  isSearching: boolean;
  hasSearched: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(
    async (term: string) => {
      if (!isValidSearch(term)) {
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);
      setHasSearched(true);

      try {
        const results = await fetchCountries(term);
        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
        setError(t("search.searchError"));
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [t]
  );

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      performSearch(term);
    }, 500),
    [performSearch]
  );

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const value: SearchContextType = {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    error,
    setSearchTerm: handleSetSearchTerm,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
