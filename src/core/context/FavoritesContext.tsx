import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Country, League, Team, Player } from "@/core/types/api";
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  loadGenericFavorites,
  addGenericFavorite,
  removeGenericFavorite,
  getFavoritesByType,
  FavoriteItem,
  FavoriteType,
} from "@/services/storage/favorites";

interface FavoritesContextType {
  // Legacy support for existing country favorites
  favorites: Country[];
  isFavorite: (countryCode: string) => boolean;
  toggleFavorite: (country: Country) => Promise<void>;
  loadFavoritesFromStorage: () => Promise<void>;

  // New generic favorites support
  favoriteCountries: Country[];
  favoriteLeagues: League[];
  favoriteCups: League[];
  favoriteTeams: Team[];
  favoritePlayers: Player[];

  // Generic methods
  addFavoriteItem: (item: FavoriteItem, type: FavoriteType) => Promise<void>;
  removeFavoriteItem: (itemId: string, type: FavoriteType) => Promise<void>;
  isItemFavorite: (item: FavoriteItem, type: FavoriteType) => boolean;
  loadGenericFavoritesFromStorage: () => Promise<void>;

  // Generic toggle method
  toggleFavoriteItem: (item: FavoriteItem, type: FavoriteType) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Country[]>([]);

  // New state for generic favorites
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [favoriteLeagues, setFavoriteLeagues] = useState<League[]>([]);
  const [favoriteCups, setFavoriteCups] = useState<League[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);

  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await loadFavorites();
      setFavorites(storedFavorites);

      // Migrate old country favorites to new generic system
      for (const country of storedFavorites) {
        try {
          await addGenericFavorite(country, "country");
        } catch (error) {
          // Item might already exist, ignore error
          console.log("Country already in generic favorites:", country.code);
        }
      }

      // Reload generic favorites after migration
      await loadGenericFavoritesFromStorage();
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const loadGenericFavoritesFromStorage = async () => {
    try {
      const [countries, leagues, cups, teams, players] = await Promise.all([
        getFavoritesByType("country"),
        getFavoritesByType("leagues"),
        getFavoritesByType("cup"),
        getFavoritesByType("team"),
        getFavoritesByType("player"),
      ]);

      setFavoriteCountries(countries as Country[]);
      setFavoriteLeagues(leagues as League[]);
      setFavoriteCups(cups as League[]);
      setFavoriteTeams(teams as Team[]);
      setFavoritePlayers(players as Player[]);
    } catch (error) {
      console.error("Error loading generic favorites:", error);
    }
  };

  const isFavorite = (countryCode: string): boolean => {
    return favoriteCountries.some((fav) => fav.code === countryCode);
  };

  const toggleFavorite = async (country: Country) => {
    try {
      if (isFavorite(country.code)) {
        // Remove from both old and new systems
        await removeFavorite(country.code);
        const itemId = `country_${country.code}`;
        await removeGenericFavorite(itemId, "country");
        setFavorites((prev) => prev.filter((fav) => fav.code !== country.code));
        setFavoriteCountries((prev) =>
          prev.filter((fav) => fav.code !== country.code)
        );
      } else {
        // Add to both old and new systems
        await addFavorite(country);
        await addGenericFavorite(country, "country");
        setFavorites((prev) => [...prev, country]);
        setFavoriteCountries((prev) => [...prev, country]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // New generic favorite methods
  const addFavoriteItem = async (item: FavoriteItem, type: FavoriteType) => {
    try {
      await addGenericFavorite(item, type);
      await loadGenericFavoritesFromStorage();
    } catch (error) {
      console.error("Error adding favorite item:", error);
      throw error;
    }
  };

  const removeFavoriteItem = async (itemId: string, type: FavoriteType) => {
    try {
      await removeGenericFavorite(itemId, type);
      await loadGenericFavoritesFromStorage();
    } catch (error) {
      console.error("Error removing favorite item:", error);
      throw error;
    }
  };

  const isItemFavorite = (item: FavoriteItem, type: FavoriteType): boolean => {
    switch (type) {
      case "country":
        return favoriteCountries.some(
          (fav) => fav.code === (item as Country).code
        );
      case "leagues":
        return favoriteLeagues.some(
          (fav) => fav.league.id === (item as League).league.id
        );
      case "cup":
        return favoriteCups.some(
          (fav) => fav.league.id === (item as League).league.id
        );
      case "team":
        return favoriteTeams.some((fav) => fav.id === (item as Team).id);
      case "player":
        return favoritePlayers.some((fav) => fav.id === (item as Player).id);
      default:
        return false;
    }
  };

  // Generic toggle method for any favorite type
  const toggleFavoriteItem = async (item: FavoriteItem, type: FavoriteType) => {
    try {
      if (isItemFavorite(item, type)) {
        const itemId = getItemId(item, type);
        await removeFavoriteItem(itemId, type);
      } else {
        await addFavoriteItem(item, type);
      }
    } catch (error) {
      console.error("Error toggling favorite item:", error);
      throw error;
    }
  };

  // Helper function to generate unique IDs for different item types
  const getItemId = (item: FavoriteItem, type: FavoriteType): string => {
    switch (type) {
      case "country":
        return `country_${(item as Country).code}`;
      case "leagues":
        return `leagues_${(item as League).league.id}`;
      case "cup":
        return `cup_${(item as League).league.id}`;
      case "team":
        return `team_${(item as Team).id}`;
      case "player":
        return `player_${(item as Player).id}`;
      default:
        return `unknown_${Date.now()}`;
    }
  };

  useEffect(() => {
    const initializeFavorites = async () => {
      await loadFavoritesFromStorage();
    };

    initializeFavorites();
  }, []);

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    loadFavoritesFromStorage,
    favoriteCountries,
    favoriteLeagues,
    favoriteCups,
    favoriteTeams,
    favoritePlayers,
    addFavoriteItem,
    removeFavoriteItem,
    isItemFavorite,
    loadGenericFavoritesFromStorage,
    toggleFavoriteItem,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
