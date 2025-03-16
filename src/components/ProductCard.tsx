
import { motion } from "framer-motion";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favoriteStatus = product.isFavorite !== undefined ? product.isFavorite : isFavorite(product.id);
  
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
    
    // Add to cart using our hook
    addToCart(product);
    
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
    
    const newStatus = toggleFavorite(product);
    
    toast({
      title: newStatus ? "Added to favorites" : "Removed from favorites",
      description: `${product.name} has been ${newStatus ? "added to" : "removed from"} your favorites.`,
      className: newStatus ? "bg-purple-50 border-purple-200 text-purple-800" : "bg-orange-50 border-orange-200 text-orange-800",
    });
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
              className={`p-1.5 rounded-full ${favoriteStatus ? 'bg-red-500 text-white' : 'bg-white text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${favoriteStatus ? 'fill-current' : ''}`} />
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
