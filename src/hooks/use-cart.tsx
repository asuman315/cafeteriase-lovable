
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart) as CartItem[];
          setCartItems(parsedCart);
          updateTotals(parsedCart);
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
          // Reset cart if there's a parsing error
          localStorage.removeItem('cartItems');
          setCartItems([]);
          updateTotals([]);
        }
      }
    };

    loadCart();

    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  // Calculate totals
  const updateTotals = (items: CartItem[]) => {
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const price = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    setTotalItems(itemCount);
    setTotalPrice(price);
  };

  // Add item to cart - now accepting separate quantity parameter
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item with proper type casting
        newItems = [...prevItems, { ...product, quantity }];
      }

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      
      // Update totals
      updateTotals(newItems);
      
      // Dispatch custom event
      window.dispatchEvent(new Event('cartUpdated'));

      return newItems;
    });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      
      // Update totals
      updateTotals(newItems);
      
      // Dispatch custom event
      window.dispatchEvent(new Event('cartUpdated'));

      return newItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      
      // Update totals
      updateTotals(newItems);
      
      // Dispatch custom event
      window.dispatchEvent(new Event('cartUpdated'));

      return newItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    localStorage.removeItem('cartItems');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
