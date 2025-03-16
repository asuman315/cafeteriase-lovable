
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdminCreateButton from "@/components/AdminCreateButton";
import ShoppingCart from "@/components/ShoppingCart";
import { useCart } from "@/hooks/use-cart";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingHero, setLoadingHero] = useState(true);
  const { totalItems } = useCart();

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
        cartItemCount={totalItems}
      />
      
      <HeroSection />
      
      <MenuSection />
      
      <AboutSection />
      
      <ContactSection />
      
      <Footer />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <AdminCreateButton />
    </div>
  );
};

export default Index;
