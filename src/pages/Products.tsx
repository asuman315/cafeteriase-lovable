
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import ProductHeroSection from "@/components/ProductHeroSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { Coffee, Utensils, Cake, FilterX, Search, ArrowUpDown } from "lucide-react";
import AdminCreateButton from "@/components/AdminCreateButton";
import { toast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import ShoppingCart from "@/components/ShoppingCart";
import ProductsPagination from "@/components/ProductsPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Items per page for pagination
const ITEMS_PER_PAGE = 6;

// Sorting options
type SortOption = {
  label: string;
  value: string;
  sort: (a: Product, b: Product) => number;
};

const sortOptions: SortOption[] = [
  {
    label: "Newest",
    value: "newest",
    sort: (a, b) => 0, // Default order from the database
  },
  {
    label: "Price: Low to High",
    value: "price-asc",
    sort: (a, b) => a.price - b.price,
  },
  {
    label: "Price: High to Low",
    value: "price-desc",
    sort: (a, b) => b.price - a.price,
  },
  {
    label: "Name A-Z",
    value: "name-asc",
    sort: (a, b) => a.name.localeCompare(b.name),
  },
  {
    label: "Name Z-A",
    value: "name-desc",
    sort: (a, b) => b.name.localeCompare(a.name),
  },
];

// Filter form interface
interface FilterValues {
  minPrice: string;
  maxPrice: string;
}

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSortOption, setActiveSortOption] = useState<string>("newest");

  // Filter form
  const filterForm = useForm<FilterValues>({
    defaultValues: {
      minPrice: "",
      maxPrice: "",
    },
  });

  const { watch } = filterForm;
  const minPrice = watch("minPrice");
  const maxPrice = watch("maxPrice");
  
  // Debounce search query to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Reset page when category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Reset page when price filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice]);

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

  // Filter products by category, search query, and price range
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeFilter ? product.category === activeFilter : true;
    
    const matchesSearch = 
      product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    
    // Price filtering
    const productPrice = product.price;
    const minPriceFilter = minPrice ? parseFloat(minPrice) : null;
    const maxPriceFilter = maxPrice ? parseFloat(maxPrice) : null;
    
    const matchesMinPrice = minPriceFilter !== null ? productPrice >= minPriceFilter : true;
    const matchesMaxPrice = maxPriceFilter !== null ? productPrice <= maxPriceFilter : true;
    
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort(
    sortOptions.find(option => option.value === activeSortOption)?.sort || sortOptions[0].sort
  );

  // Paginate sorted products
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to products section
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setActiveSortOption(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    filterForm.reset({
      minPrice: "",
      maxPrice: "",
    });
    setActiveSortOption("newest");
    setCurrentPage(1);
  };

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
          
          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Sort Dropdown */}
            <div>
              <Select
                value={activeSortOption}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Price Range Filters */}
            <div className="flex items-center gap-2">
              <Form {...filterForm}>
                <div className="flex gap-2 items-center">
                  <FormField
                    control={filterForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min $"
                            {...field}
                            min="0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">-</span>
                  <FormField
                    control={filterForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max $"
                            {...field}
                            min="0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    <FilterX className="h-4 w-4" />
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          
          {/* Filter Indicators */}
          {(activeFilter || debouncedSearchQuery || minPrice || maxPrice) && (
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {activeFilter && (
                <div className="bg-muted text-sm rounded-full px-3 py-1 flex items-center">
                  <span>{activeFilter}</span>
                </div>
              )}
              {debouncedSearchQuery && (
                <div className="bg-muted text-sm rounded-full px-3 py-1 flex items-center">
                  <span>"{debouncedSearchQuery}"</span>
                </div>
              )}
              {(minPrice || maxPrice) && (
                <div className="bg-muted text-sm rounded-full px-3 py-1 flex items-center">
                  <span>
                    Price: {minPrice ? `$${minPrice}` : "$0"} - {maxPrice ? `$${maxPrice}` : "Any"}
                  </span>
                </div>
              )}
            </div>
          )}
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
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <ProductsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            
            {/* Results summary */}
            <div className="text-center text-sm text-muted-foreground mt-2">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {filteredProducts.length < products.length && (
                <> (filtered from {products.length})</>
              )}
            </div>
          </>
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
