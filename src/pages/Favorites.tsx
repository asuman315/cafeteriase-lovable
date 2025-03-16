
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, HeartOff } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { totalItems: cartItemCount } = useCart();

  // Handle cart click for NavBar
  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Check your cart items!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onCartClick={handleCartClick} cartItemCount={cartItemCount} />
      
      {/* Header Section */}
      <header className="bg-cafePurple-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
          <p className="text-sm md:text-base opacity-80">Your collection of favorite items</p>
        </div>
      </header>
      
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Favorite Items</h2>
          {favorites.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearFavorites}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <HeartOff className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        
        {favorites.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any products to your favorites list.
            </p>
            <Button asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product, index) => (
              <motion.div 
                key={product.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute right-2 top-2 z-10 bg-white text-red-500 hover:bg-white hover:text-red-600 rounded-full p-2"
                  size="icon"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
                <ProductCard product={{...product, isFavorite: true}} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default Favorites;
