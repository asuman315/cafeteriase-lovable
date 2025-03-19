
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (product: Product) => boolean;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Initialize favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };

    loadFavorites();

    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', loadFavorites);
    window.addEventListener('favoritesUpdated', loadFavorites);

    return () => {
      window.removeEventListener('storage', loadFavorites);
      window.removeEventListener('favoritesUpdated', loadFavorites);
    };
  }, []);

  // Add item to favorites
  const addToFavorites = (product: Product) => {
    setFavorites(prevFavorites => {
      // Check if already in favorites
      if (prevFavorites.some(item => item.id === product.id)) {
        return prevFavorites;
      }

      const newFavorites = [...prevFavorites, product];
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      // Dispatch custom event
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      return newFavorites;
    });
  };

  // Remove item from favorites
  const removeFromFavorites = (productId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      // Dispatch custom event
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      return newFavorites;
    });
  };

  // Toggle favorite status
  const toggleFavorite = (product: Product) => {
    const isFav = favorites.some(item => item.id === product.id);
    
    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
    
    return !isFav;
  };

  // Check if product is in favorites
  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
