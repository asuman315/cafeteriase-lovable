
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart, 
  Share2,
  Star,
  Info,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from "@/components/ui/hover-card";
import ProductCard from "@/components/ProductCard";
import { toast } from "@/hooks/use-toast";
import { type Product } from "@/types";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Update cart count and check favorite status
  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartItemCount(count);
    };
    
    // Check favorite status
    const checkFavoriteStatus = () => {
      if (!id) return;
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((fav: Product) => fav.id === id));
    };
    
    // Initial updates
    updateCartCount();
    checkFavoriteStatus();
    
    // Listen for storage events
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('storage', checkFavoriteStatus);
    
    // Custom events
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('storage', checkFavoriteStatus);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [id]);
  
  // Handle cart click (for NavBar)
  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Cart functionality is now implemented! Check your cart.",
    });
  };
  
  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
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
        currency: data.currency || 'USD'
      } as Product;
    },
  });
  
  // Fetch related products
  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      
      const { data, error } = await supabase
        .from('cafe_products')
        .select('*')
        .eq('category', product.category)
        .neq('id', id)
        .limit(4);
        
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.images && Array.isArray(item.images) && item.images[0] ? item.images[0] : '/placeholder.svg',
        images: Array.isArray(item.images) ? item.images : ['/placeholder.svg'],
        category: item.category || 'Coffee',
        featured: item.featured || false,
        currency: item.currency || 'USD'
      })) as Product[];
    },
    enabled: !!product?.category,
  });
  
  // Strip HTML tags from a string
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  // Mock reviews data
  const reviews = [
    { id: 1, author: "Emma S.", rating: 5, text: "Absolutely delicious! One of my favorite treats from Cafeteriase." },
    { id: 2, author: "James L.", rating: 4, text: "Great flavor and presentation. I order this at least once a week." },
    { id: 3, author: "Sophia R.", rating: 5, text: "Perfect blend of flavors. Highly recommend trying this!" },
    { id: 4, author: "Michael T.", rating: 4, text: "Consistently good quality. The staff is also very friendly." }
  ];
  
  // Format currency
  const formatPrice = (price: number, currency: string) => {
    const currencySymbol = currency === "USD" ? "$" : 
                           currency === "EUR" ? "€" : 
                           currency === "GBP" ? "£" : "$";
                           
    return `${currencySymbol}${price.toFixed(2)}`;
  };
  
  // Handle quantity changes
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Get existing cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 0) + quantity;
    } else {
      // Add new item to cart
      cartItems.push({
        ...product,
        quantity: quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch custom event
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Simulate adding to cart
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      setIsAdding(false);
      setCartItemCount(prev => prev + quantity);
    }, 800);
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = () => {
    if (!product) return;
    
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
  
  // Nutrition facts - these would come from the database in a real app
  const nutritionFacts = {
    calories: "380",
    fat: "14g",
    carbs: "52g",
    protein: "12g",
    sugar: "24g"
  };
  
  // Allergens - these would come from the database in a real app
  const allergens = ["Milk", "Wheat", "Eggs"];
  
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafePurple-dark/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafePurple"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link to="/products">Return to Products</Link>
        </Button>
      </div>
    );
  }
  
  // Prepare the description (convert HTML to plain text)
  const plainDescription = stripHtml(product.description);
  
  return (
    <div className="min-h-screen bg-white">
      <NavBar onCartClick={handleCartClick} cartItemCount={cartItemCount} />
      
      {/* Header Section */}
      <header className="bg-cafePurple-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Product Details</h1>
          <p className="text-sm md:text-base opacity-80">Explore our delicious offerings</p>
        </div>
      </header>
      
      {/* Breadcrumb navigation */}
      <nav className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-cafePurple transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-cafePurple transition-colors">Products</Link>
          <span>/</span>
          <span className="font-medium text-foreground">{product.name}</span>
        </div>
      </nav>
      
      {/* Hero Section - Product Introduction */}
      <section className="bg-gradient-to-b from-cafePurple/5 to-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Product Image Gallery */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] shadow-lg mb-4">
                <motion.img 
                  src={product.images?.[activeImageIndex] || product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden h-20 w-20 flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === index 
                          ? "border-cafePurple" 
                          : "border-transparent hover:border-cafePurple/50"
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4.5 ? "text-yellow-400" : "text-gray-300"}`}
                        fill={star <= 4.5 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(32 reviews)</span>
                </div>
                <p className="text-2xl font-semibold mt-4 text-cafePurple">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {plainDescription}
                </p>
                
                <div className="flex items-center space-x-2 mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.category === "Coffee" ? "bg-amber-100 text-amber-800" :
                    product.category === "Breakfast" ? "bg-green-100 text-green-800" :
                    product.category === "Lunch" ? "bg-blue-100 text-blue-800" :
                    product.category === "Desserts" ? "bg-pink-100 text-pink-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {product.category}
                  </span>
                  
                  {product.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-4">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-white hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-center font-medium min-w-[40px]">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-white hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-cafePurple hover:bg-cafePurple-dark text-white py-6 rounded-full"
                  >
                    <ShoppingCart className={`mr-2 h-5 w-5 ${isAdding ? 'animate-bounce' : ''}`} />
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className={`rounded-full p-3 border-gray-300 hover:bg-gray-100 ${
                        isFavorite ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white' : 'hover:text-cafePurple'
                      }`}
                      aria-label="Add to favorites"
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="rounded-full p-3 border-gray-300 hover:bg-gray-100 hover:text-cafePurple"
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Nutrition & Ingredients */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Nutrition & Ingredients</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                  {Object.entries(nutritionFacts).map(([key, value]) => (
                    <div key={key} className="text-center p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize">{key}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {allergens.map(allergen => (
                    <HoverCard key={allergen}>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm cursor-help">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {allergen}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Contains {allergen}</h4>
                          <p className="text-xs text-muted-foreground">
                            This product contains {allergen.toLowerCase()}, which may cause allergic reactions in some people.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Preparation & Serving */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Preparation & Serving</h2>
                <p className="text-gray-700 mb-4">
                  Our {product.name} is prepared fresh daily using locally-sourced ingredients whenever possible. Each item is crafted with care by our skilled baristas and chefs.
                </p>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      For the best experience, consume within 30 minutes of serving. Our products are best enjoyed fresh and at the recommended temperature.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-16 bg-cafePurple/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map(review => (
              <motion.div 
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.author}</h3>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill={star <= review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 weeks ago</span>
                </div>
                <p className="text-gray-700 text-sm mt-3">{review.text}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="rounded-full px-8 border-cafePurple text-cafePurple hover:bg-cafePurple hover:text-white"
            >
              View All Reviews
            </Button>
          </div>
        </div>
      </section>
      
      {/* Related Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">You Might Also Like</h2>
          
          {relatedLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafePurple"></div>
            </div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-center text-gray-500">No related products found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
