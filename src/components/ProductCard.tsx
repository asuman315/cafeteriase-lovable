
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/pages/Products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
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
          <span className="text-cafePurple font-semibold">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <Button 
          className="w-full bg-cafePurple hover:bg-cafePurple-dark group"
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-bounce" /> 
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
