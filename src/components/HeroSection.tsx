
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Coffee, Cake } from "lucide-react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/lovable-uploads/3d98dbd5-f125-4671-9bc2-ad8e0d6c0577.png",
    "/lovable-uploads/350513f1-aee9-4e77-8698-635273261602.png",
    "/lovable-uploads/c1cd1677-91bf-469f-b25f-99aa098db4a1.png"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with animation */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cafePurple-dark/60 to-cafePurple/60" />
            <img
              src={image}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="max-w-xl space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Exceptional Coffee,<br />Extraordinary Food
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Experience the perfect blend of flavor and ambiance at Cafeteriase.
              Order now and taste the difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button onClick={scrollToMenu} className="bg-white text-cafePurple hover:bg-gray-100 px-8 py-6 text-lg">
                Explore Menu
              </Button>
              <Button variant="outline" className="border-white hover:bg-white/10 px-8 py-6 text-lg text-white">
                Order Now
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex gap-4 mt-10 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col gap-4">
              <div className="glass-morphism w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-white">
                <Coffee className="w-12 h-12 mb-2" />
                <span className="font-medium">Premium Coffee</span>
              </div>
              <div className="glass-morphism w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-white">
                <Cake className="w-12 h-12 mb-2" />
                <span className="font-medium">Delicious Treats</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <button 
        onClick={scrollToMenu} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
      >
        <ChevronDown className="h-10 w-10" />
      </button>
    </section>
  );
};

export default HeroSection;
