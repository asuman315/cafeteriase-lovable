
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

// Utility function to convert rich text to plain text and truncate
const stripRichText = (text: string | null, maxLength = 80) => {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>/g, '');
  return stripped.length > maxLength 
    ? stripped.substring(0, maxLength) + '...' 
    : stripped;
};

const MenuSection = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('cafe_products')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map(item => item.category || "Other"))
          );

          // Map Supabase data to MenuItem objects
          const items: MenuItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: stripRichText(item.description || ""),
            price: Number(item.price),
            image: item.images && item.images[0] ? item.images[0] : '/placeholder.svg',
            category: item.category || "Other",
            featured: item.featured || false
          }));

          setMenuItems(items);
          setCategories(uniqueCategories);
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter items by active category
  const filteredItems = activeCategory 
    ? menuItems.filter(item => item.category === activeCategory)
    : menuItems;

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      featured: item.featured,
      currency: "USD"
    });
    
    toast(`Added ${item.name} to cart`);
  };

  return (
    <section id="menu" className="py-24 bg-cafeGray-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted menu featuring premium coffee and delicious food
            made with the finest ingredients.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafePurple"></div>
          </div>
        ) : (
          <>
            <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 md:justify-center md:mx-0 md:px-0">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory === category ? "default" : "outline"}
                    className={
                      activeCategory === category
                        ? "bg-cafePurple hover:bg-cafePurple-dark"
                        : "hover:text-cafePurple"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="menu-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {item.featured && (
                      <div className="absolute top-2 right-2 bg-cafePurple text-white p-1 rounded-full">
                        <Star className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-xl">{item.name}</h3>
                      <span className="text-cafePurple font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-cafePurple hover:bg-cafePurple-dark"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
