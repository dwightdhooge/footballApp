import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Country } from "@/types/api";
import { LeagueItem } from "@/types/api";
import { TeamSearchResult } from "@/services/api/teams";
import { fetchCountries } from "@/services/api/countries";
import { searchTeams } from "@/services/api/teams";
import { searchLeagues } from "@/services/api/leagues";
import { debounce, isValidSearch } from "@/utils/helpers";

interface SearchResults {
  teams: TeamSearchResult[];
  leagues: LeagueItem[];
  countries: Country[];
}

interface SearchContextType {
  searchTerm: string;
  searchResults: SearchResults;
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
  const [searchResults, setSearchResults] = useState<SearchResults>({
    teams: [],
    leagues: [],
    countries: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(
    async (term: string) => {
      if (!isValidSearch(term)) {
        setSearchResults({ teams: [], leagues: [], countries: [] });
        setHasSearched(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);
      setHasSearched(true);

      try {
        // Perform all searches in parallel
        const [
          teamsResults,
          leaguesResults,
          countriesResults,
        ] = await Promise.allSettled([
          searchTeams(term),
          searchLeagues(term),
          fetchCountries(term),
        ]);

        const newResults: SearchResults = {
          teams: teamsResults.status === "fulfilled" ? teamsResults.value : [],
          leagues:
            leaguesResults.status === "fulfilled" ? leaguesResults.value : [],
          countries:
            countriesResults.status === "fulfilled"
              ? countriesResults.value
              : [],
        };

        setSearchResults(newResults);
      } catch (err) {
        console.error("Search error:", err);
        setError(t("search.searchError"));
        setSearchResults({ teams: [], leagues: [], countries: [] });
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
    setSearchResults({ teams: [], leagues: [], countries: [] });
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
