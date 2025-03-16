
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/pages/Products";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
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
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
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
  
  return (
    <motion.div
      className="menu-card h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-3 right-3 bg-cafePurple text-white p-1.5 rounded-full">
            <Star className="h-4 w-4" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <Button 
              className="w-full bg-white text-cafePurple hover:bg-white/90"
              size="sm"
            >
              Quick View
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
    </motion.div>
  );
};

export default ProductCard;
