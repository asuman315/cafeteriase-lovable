
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  
  return <section id="home" className="relative h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-cafePurple-dark/60 to-cafePurple/60" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl space-y-6 animate-fade-in text-center md:text-left">
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
          </div>
          
          <div className="hidden md:block w-1/2 p-4">
            <div className="relative w-full max-w-[450px] h-[400px] mx-auto animate-float rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-cafePurple/10 z-10 rounded-xl"></div>
              <img src="/lovable-uploads/3d98dbd5-f125-4671-9bc2-ad8e0d6c0577.png" alt="English breakfast with eggs, toast, mushrooms, beans and tomatoes" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 shadow-inner rounded-xl"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cafePurple-dark/60 to-transparent p-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={scrollToMenu} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="h-10 w-10" />
      </button>
    </section>;
};

export default HeroSection;
