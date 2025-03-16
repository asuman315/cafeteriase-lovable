
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import ProductHeroSection from "@/components/ProductHeroSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { Coffee, Utensils, Cake, FilterX } from "lucide-react";
import AdminCreateButton from "@/components/AdminCreateButton";
import { toast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import ShoppingCart from "@/components/ShoppingCart";

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Update cart count when component mounts or cart changes
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartItemCount(count);
    };
    
    // Initial update
    updateCartCount();
    
    // Listen for storage events to update cart count
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Handle cart click for NavBar
  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // Get products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cafe_products')
          .select('*');

        if (error) {
          throw error;
        }

        // Map Supabase data to our Product interface
        return data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          // Use the first image in the array or a placeholder
          image: item.images && Array.isArray(item.images) && item.images[0] ? item.images[0] : '/placeholder.svg',
          images: Array.isArray(item.images) ? item.images : ['/placeholder.svg'],
          category: item.category || 'Coffee',
          featured: item.featured || false,
          currency: item.currency || 'USD'
        })) as Product[];
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Could not load products. Please try again later.",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeFilter ? product.category === activeFilter : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen">
      <NavBar onCartClick={handleCartClick} cartItemCount={cartItemCount} />
      
      {/* Header Section */}
      <header className="bg-cafePurple-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Our Products</h1>
          <p className="text-sm md:text-base opacity-80">Discover our premium offerings</p>
        </div>
      </header>
      
      <ProductHeroSection />
      
      <section className="container mx-auto px-4 py-16" id="products">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our selection of premium coffee, delicious food, and sweet treats. 
            All items are crafted with love and the finest ingredients.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center items-center mb-6">
            <Button 
              variant={activeFilter === null ? "default" : "outline"}
              onClick={() => setActiveFilter(null)}
              className="flex items-center"
            >
              <FilterX className="mr-2 h-4 w-4" />
              All Items
            </Button>
            <Button 
              variant={activeFilter === "Coffee" ? "default" : "outline"}
              onClick={() => setActiveFilter("Coffee")}
              className="flex items-center"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Coffee
            </Button>
            <Button 
              variant={activeFilter === "Breakfast" ? "default" : "outline"}
              onClick={() => setActiveFilter("Breakfast")}
              className="flex items-center"
            >
              <Utensils className="mr-2 h-4 w-4" />
              Breakfast
            </Button>
            <Button 
              variant={activeFilter === "Lunch" ? "default" : "outline"}
              onClick={() => setActiveFilter("Lunch")}
              className="flex items-center"
            >
              <Utensils className="mr-2 h-4 w-4" />
              Lunch
            </Button>
            <Button 
              variant={activeFilter === "Desserts" ? "default" : "outline"}
              onClick={() => setActiveFilter("Desserts")}
              className="flex items-center"
            >
              <Cake className="mr-2 h-4 w-4" />
              Desserts
            </Button>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cafePurple focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafePurple"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Something went wrong while loading products.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilter 
                ? `No ${activeFilter} products match your search.` 
                : "No products match your search criteria."}
            </p>
            <Button onClick={() => {
              setActiveFilter(null);
              setSearchQuery("");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
      
      {featuredProducts.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Items</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular and recommended products, specially selected for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <TeamSection />
      <ContactSection />
      <Footer />
      <AdminCreateButton />
      
      {/* Shopping Cart Drawer */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Products;
