
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import AdminCreateButton from "@/components/AdminCreateButton";
import { MenuItem, CartItem, MenuCategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Sample menu data
const menuCategories: MenuCategory[] = [
  {
    id: 1,
    name: "Breakfast",
    items: [
      {
        id: 101,
        name: "Avocado Toast",
        description: "Smashed avocado on artisan sourdough with cherry tomatoes and microgreens",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=500&auto=format&fit=crop",
        category: "Breakfast",
        featured: true
      },
      {
        id: 102,
        name: "Eggs Benedict",
        description: "Poached eggs on English muffin with hollandaise sauce and your choice of protein",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=500&auto=format&fit=crop",
        category: "Breakfast",
        featured: false
      },
      {
        id: 103,
        name: "Berry Parfait",
        description: "Greek yogurt with fresh berries, house granola, and local honey",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
        category: "Breakfast",
        featured: false
      }
    ]
  },
  {
    id: 2,
    name: "Coffee",
    items: [
      {
        id: 201,
        name: "Cappuccino",
        description: "Double espresso with steamed milk foam",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500&auto=format&fit=crop",
        category: "Coffee",
        featured: true
      },
      {
        id: 202,
        name: "Pour Over",
        description: "Hand-poured single origin coffee with complex notes",
        price: 5.49,
        image: "https://images.unsplash.com/photo-1497935586047-9395ee065474?q=80&w=500&auto=format&fit=crop",
        category: "Coffee",
        featured: false
      },
      {
        id: 203,
        name: "Caramel Macchiato",
        description: "Espresso with vanilla, caramel and steamed milk",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1587080413959-06b859fb107d?q=80&w=500&auto=format&fit=crop",
        category: "Coffee",
        featured: false
      }
    ]
  },
  {
    id: 3,
    name: "Lunch",
    items: [
      {
        id: 301,
        name: "Quinoa Bowl",
        description: "Organic quinoa with roasted vegetables, avocado, and tahini dressing",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
        category: "Lunch",
        featured: true
      },
      {
        id: 302,
        name: "Chicken Sandwich",
        description: "Grilled chicken with avocado, bacon, and herb aioli on artisan bread",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1603046891744-76e7d732555c?q=80&w=500&auto=format&fit=crop",
        category: "Lunch",
        featured: false
      },
      {
        id: 303,
        name: "Seasonal Soup",
        description: "House-made soup with local seasonal ingredients",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500&auto=format&fit=crop",
        category: "Lunch",
        featured: false
      }
    ]
  },
  {
    id: 4,
    name: "Desserts",
    items: [
      {
        id: 401,
        name: "Tiramisu",
        description: "Classic Italian dessert with espresso, mascarpone, and cocoa",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format&fit=crop",
        category: "Desserts",
        featured: true
      },
      {
        id: 402,
        name: "Chocolate Cake",
        description: "Rich chocolate cake with ganache and fresh berries",
        price: 8.49,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop",
        category: "Desserts",
        featured: false
      },
      {
        id: 403,
        name: "Macarons",
        description: "Assorted French macarons in seasonal flavors",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=500&auto=format&fit=crop",
        category: "Desserts",
        featured: false
      }
    ]
  }
];

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingHero, setLoadingHero] = useState(true);

  useEffect(() => {
    // Simulate loading hero image
    const heroImage = new Image();
    heroImage.src = "/cafe-hero.jpg";
    heroImage.onload = () => setLoadingHero(false);
    
    // Fallback in case image doesn't load
    const timer = setTimeout(() => {
      setLoadingHero(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen">
      {loadingHero ? (
        <div className="fixed inset-0 bg-cafePurple flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="inline-block h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading Cafeteriase Experience...</p>
          </div>
        </div>
      ) : null}
      
      <NavBar
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <HeroSection />
      
      <MenuSection
        categories={menuCategories}
        onAddToCart={handleAddToCart}
      />
      
      <AboutSection />
      
      <ContactSection />
      
      <Footer />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      <AdminCreateButton />
    </div>
  );
};

export default Index;
