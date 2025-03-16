
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import AdminCreateButton from "@/components/AdminCreateButton";
import { MenuItem, CartItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";

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
      
      <MenuSection onAddToCart={handleAddToCart} />
      
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
