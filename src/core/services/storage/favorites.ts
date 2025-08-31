import AsyncStorage from "@react-native-async-storage/async-storage";
import { Country, League, Team, Player } from "@/core/types/api";

const FAVORITES_KEY = "favorites";

// Generic favorite item type
export type FavoriteItem = Country | League | Team | Player;
export type FavoriteType = "country" | "leagues" | "cup" | "team" | "player";

// Enhanced storage interface
interface StoredFavorite {
  id: string;
  type: FavoriteType;
  data: FavoriteItem;
  addedAt: string;
}

// Legacy support for existing country favorites
export const saveFavorites = async (favorites: Country[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
    throw error;
  }
};

export const loadFavorites = async (): Promise<Country[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

export const addFavorite = async (country: Country): Promise<void> => {
  try {
    const favorites = await loadFavorites();
    const isAlreadyFavorite = favorites.some(
      (fav) => fav.code === country.code
    );

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, country];
      await saveFavorites(updatedFavorites);
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (countryCode: string): Promise<void> => {
  try {
    const favorites = await loadFavorites();
    const updatedFavorites = favorites.filter(
      (fav) => fav.code !== countryCode
    );
    await saveFavorites(updatedFavorites);
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export const isFavorite = async (countryCode: string): Promise<boolean> => {
  try {
    const favorites = await loadFavorites();
    return favorites.some((fav) => fav.code === countryCode);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

// New generic favorites storage functions
export const saveGenericFavorites = async (
  favorites: StoredFavorite[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem("generic_favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving generic favorites:", error);
    throw error;
  }
};

export const loadGenericFavorites = async (): Promise<StoredFavorite[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem("generic_favorites");
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  } catch (error) {
    console.error("Error loading generic favorites:", error);
    return [];
  }
};

export const addGenericFavorite = async (
  item: FavoriteItem,
  type: FavoriteType
): Promise<void> => {
  try {
    const favorites = await loadGenericFavorites();
    const itemId = getItemId(item, type);
    const isAlreadyFavorite = favorites.some((fav) => fav.id === itemId);

    if (!isAlreadyFavorite) {
      const newFavorite: StoredFavorite = {
        id: itemId,
        type,
        data: item,
        addedAt: new Date().toISOString(),
      };
      const updatedFavorites = [...favorites, newFavorite];
      await saveGenericFavorites(updatedFavorites);
    }
  } catch (error) {
    console.error("Error adding generic favorite:", error);
    throw error;
  }
};

export const removeGenericFavorite = async (
  itemId: string,
  type: FavoriteType
): Promise<void> => {
  try {
    const favorites = await loadGenericFavorites();
    const updatedFavorites = favorites.filter(
      (fav) => !(fav.id === itemId && fav.type === type)
    );
    await saveGenericFavorites(updatedFavorites);
  } catch (error) {
    console.error("Error removing generic favorite:", error);
    throw error;
  }
};

export const isGenericFavorite = async (
  item: FavoriteItem,
  type: FavoriteType
): Promise<boolean> => {
  try {
    const favorites = await loadGenericFavorites();
    const itemId = getItemId(item, type);
    return favorites.some((fav) => fav.id === itemId && fav.type === type);
  } catch (error) {
    console.error("Error checking generic favorite status:", error);
    return false;
  }
};

export const getFavoritesByType = async (
  type: FavoriteType
): Promise<FavoriteItem[]> => {
  try {
    const favorites = await loadGenericFavorites();
    return favorites.filter((fav) => fav.type === type).map((fav) => fav.data);
  } catch (error) {
    console.error("Error getting favorites by type:", error);
    return [];
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
