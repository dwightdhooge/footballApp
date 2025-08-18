import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Country } from '@/types/api';
import { loadFavorites, addFavorite, removeFavorite } from '@/services/storage/favorites';

interface FavoritesContextType {
  favorites: Country[];
  isFavorite: (countryCode: string) => boolean;
  toggleFavorite: (country: Country) => Promise<void>;
  loadFavoritesFromStorage: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Country[]>([]);

  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await loadFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const isFavorite = (countryCode: string): boolean => {
    return favorites.some(fav => fav.code === countryCode);
  };

  const toggleFavorite = async (country: Country) => {
    try {
      if (isFavorite(country.code)) {
        await removeFavorite(country.code);
        setFavorites(prev => prev.filter(fav => fav.code !== country.code));
      } else {
        await addFavorite(country);
        setFavorites(prev => [...prev, country]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    loadFavoritesFromStorage,
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
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 