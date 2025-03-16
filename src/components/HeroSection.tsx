
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cafePurple-dark/60 to-cafePurple/60" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Exceptional Coffee,<br />Extraordinary Food
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Experience the perfect blend of flavor and ambiance at Cafeteriase.
            Order now and taste the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToMenu}
              className="bg-white text-cafePurple hover:bg-gray-100 px-8 py-6 text-lg"
            >
              Explore Menu
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Order Now
            </Button>
          </div>
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
