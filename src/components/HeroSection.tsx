import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Coffee, Cake, UtensilsCrossed } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";

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
    <section id="home" className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-cafePurple-dark">
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {images.map((image, index) => (
            index === currentImageIndex && (
              <motion.div
                key={image}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cafePurple-dark/50 via-cafePurple/40 to-cafePurple/60 z-10" />
                <img
                  src={image}
                  alt="Hero background"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="max-w-xl space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-white/80 font-medium text-xl mb-2">Welcome to Cafeteriase</h2>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Order Modern<br />Meals & Drinks
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/90 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Experience the perfect blend of flavor and ambiance, delivered to you.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                className="bg-white text-cafePurple hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-lg 
                          transition-all duration-300 hover:scale-105 hover:shadow-xl"
                asChild
              >
                <Link to="/products">Start Ordering</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white/70 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full
                          backdrop-blur-sm transition-all duration-300"
                onClick={scrollToMenu}
              >
                Explore Menu
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hidden md:grid grid-cols-2 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <motion.div 
                  className="glass-card h-36 w-36 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer
                            backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <Coffee className="w-10 h-10 mb-2 text-white/90" />
                  <span className="font-medium">Premium Coffee</span>
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white/90 backdrop-blur-md border-white/20">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Artisan Coffee</h4>
                    <p className="text-sm text-muted-foreground">
                      Expertly crafted by our skilled baristas using ethically sourced beans.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <motion.div 
              className="glass-card h-36 w-36 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer
                        backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300
                        translate-y-12"
              whileHover={{ y: 42, scale: 1.05 }}
            >
              <UtensilsCrossed className="w-10 h-10 mb-2 text-white/90" />
              <span className="font-medium">Gourmet Food</span>
            </motion.div>
            
            <motion.div 
              className="glass-card h-36 w-36 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer
                        backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300
                        translate-y-[-12px]"
              whileHover={{ y: -17, scale: 1.05 }}
            >
              <Cake className="w-10 h-10 mb-2 text-white/90" />
              <span className="font-medium">Sweet Treats</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <motion.button 
        onClick={scrollToMenu} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white
                  transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <ChevronDown className="h-8 w-8" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
