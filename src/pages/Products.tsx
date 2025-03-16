
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import ProductHeroSection from "@/components/ProductHeroSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch products
    const fetchProducts = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        const dummyProducts: Product[] = [
          {
            id: 1,
            name: "Signature Espresso",
            description: "Our premium signature blend with rich chocolate notes and a smooth finish.",
            price: 4.99,
            image: "/lovable-uploads/3d98dbd5-f125-4671-9bc2-ad8e0d6c0577.png",
            category: "Coffee",
            featured: true,
          },
          {
            id: 2,
            name: "Breakfast Platter",
            description: "A hearty platter with eggs, bacon, toast, and fresh fruit.",
            price: 12.99,
            image: "/lovable-uploads/350513f1-aee9-4e77-8698-635273261602.png",
            category: "Food",
            featured: true,
          },
          {
            id: 3,
            name: "Iced Caramel Latte",
            description: "Smooth espresso with caramel syrup, cold milk, and ice.",
            price: 5.49,
            image: "/lovable-uploads/c1cd1677-91bf-469f-b25f-99aa098db4a1.png",
            category: "Coffee",
            featured: false,
          },
          {
            id: 4,
            name: "Avocado Toast",
            description: "Freshly made sourdough toast topped with avocado, feta, and microgreens.",
            price: 8.99,
            image: "/lovable-uploads/350513f1-aee9-4e77-8698-635273261602.png",
            category: "Food",
            featured: false,
          },
          {
            id: 5,
            name: "Chai Tea Latte",
            description: "Spiced chai tea with steamed milk and a hint of honey.",
            price: 4.49,
            image: "/lovable-uploads/c1cd1677-91bf-469f-b25f-99aa098db4a1.png",
            category: "Tea",
            featured: true,
          },
          {
            id: 6,
            name: "Croissant Sandwich",
            description: "Buttery croissant filled with ham, cheese, and fresh greens.",
            price: 7.99,
            image: "/lovable-uploads/350513f1-aee9-4e77-8698-635273261602.png",
            category: "Pastry",
            featured: false,
          },
        ];
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
        setIsLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [categoryFilter, searchQuery, products]);

  const categories = ["all", ...new Set(products.map(product => product.category))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <ProductHeroSection />
      
      <section id="products" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Products
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover our carefully crafted selection of premium coffees, delicious food, and more.
            </motion.p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 border-none bg-accent/50 backdrop-blur-sm"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48 border-none bg-accent/50 backdrop-blur-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-morphism h-96 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-semibold mb-4">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
                  <Button onClick={() => {setSearchQuery(''); setCategoryFilter('all');}}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-center mt-16">
            <Button 
              variant="outline" 
              className="group border-cafePurple text-cafePurple hover:bg-cafePurple hover:text-white"
            >
              Load More <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </div>
      </section>
      
      <TeamSection />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Products;
