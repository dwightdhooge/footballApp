import AsyncStorage from '@react-native-async-storage/async-storage';
import { Country } from '@/types/api';

const FAVORITES_KEY = 'favorites';

export const saveFavorites = async (favorites: Country[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
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
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const addFavorite = async (country: Country): Promise<void> => {
  try {
    const favorites = await loadFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.code === country.code);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, country];
      await saveFavorites(updatedFavorites);
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (countryCode: string): Promise<void> => {
  try {
    const favorites = await loadFavorites();
    const updatedFavorites = favorites.filter(fav => fav.code !== countryCode);
    await saveFavorites(updatedFavorites);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const isFavorite = async (countryCode: string): Promise<boolean> => {
  try {
    const favorites = await loadFavorites();
    return favorites.some(fav => fav.code === countryCode);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}; 