
import { motion } from "framer-motion";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if product is in favorites when component mounts
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: Product) => fav.id === product.id));
  }, [product.id]);
  
  // Get currency symbol based on product currency
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "UGX":
        return "USh";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      default:
        return "$";
    }
  };
  
  // Format price based on currency
  const formatPrice = (price: number, currency: string) => {
    return `${getCurrencySymbol(currency)} ${price.toFixed(currency === "UGX" ? 0 : 2)}`;
  };
  
  // Strip HTML tags from description and truncate text
  const stripRichText = (text: string | null, maxLength = 80) => {
    if (!text) return "";
    const stripped = text.replace(/<[^>]*>/g, '');
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength) + '...' 
      : stripped;
  };
  
  // Handle adding product to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    
    // Get existing cart items or initialize empty array
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex((item: Product) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if already in cart
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
      // Add new item to cart with quantity 1
      cartItems.push({
        ...product,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Simulate adding to cart with a timeout
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      setIsAddingToCart(false);
    }, 600);
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get existing favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: Product) => fav.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
        className: "bg-orange-50 border-orange-200 text-orange-800",
      });
    } else {
      // Add to favorites
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
        className: "bg-purple-50 border-purple-200 text-purple-800",
      });
    }
  };
  
  return (
    <motion.div
      className="menu-card h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.featured && (
              <div className="bg-cafePurple text-white p-1.5 rounded-full">
                <Star className="h-4 w-4" />
              </div>
            )}
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <Button 
                className="w-full bg-white text-cafePurple hover:bg-white/90"
                size="sm"
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-xl line-clamp-1">{product.name}</h3>
            <span className="text-cafePurple font-semibold">{formatPrice(product.price, product.currency)}</span>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
            {stripRichText(product.description)}
          </p>
          
          <Button 
            className="w-full bg-cafePurple hover:bg-cafePurple-dark group"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className={`mr-2 h-4 w-4 ${isAddingToCart ? 'animate-bounce' : 'group-hover:animate-bounce'}`} /> 
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
