import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ShoppingCartComponent from "@/components/ShoppingCart";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartItemCount(count);
    };
    
    updateCartCount();
    
    window.addEventListener('storage', updateCartCount);
    
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cafe_products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        return {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          image: data.images && Array.isArray(data.images) && data.images[0] ? data.images[0] : '/placeholder.svg',
          images: Array.isArray(data.images) ? data.images : ['/placeholder.svg'],
          category: data.category || 'Coffee',
          featured: data.featured || false,
          currency: data.currency || 'USD',
        } as Product;
      } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
      }
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product
      }, quantity);
      
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafePurple"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Button asChild>
          <Link to="/products">Return to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar onCartClick={handleCartClick} cartItemCount={cartItemCount} />
      
      <main className="container mx-auto px-4 py-16 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
                <span className="px-3 py-1 bg-cafePurple/10 text-cafePurple text-sm rounded-full">
                  {product.category}
                </span>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="py-4 border-t border-b">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-cafePurple hover:bg-cafePurple-dark text-white px-8 py-6 flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                variant={isFavorite(product.id) ? "default" : "outline"} 
                className={isFavorite(product.id) 
                  ? "bg-red-500 hover:bg-red-600 text-white flex-1" 
                  : "border-gray-300 hover:border-gray-400 flex-1"
                }
                onClick={toggleFavorite}
              >
                {isFavorite(product.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <ShoppingCartComponent
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
