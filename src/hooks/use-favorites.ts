
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export function useFavorites() {
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
    const isFavorite = favorites.some(item => item.id === product.id);
    
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
    
    return !isFavorite;
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

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}
