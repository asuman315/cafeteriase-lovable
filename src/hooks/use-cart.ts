
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setCartItems(parsedCart);
        updateTotals(parsedCart);
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

  // Add item to cart
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
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

  return {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
}
