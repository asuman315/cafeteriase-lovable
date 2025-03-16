
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import { Link } from "react-router-dom";

interface NavBarProps {
  onCartClick: () => void;
  cartItemCount: number;
}

const NavBar = ({ onCartClick, cartItemCount }: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="#home" className={cn(
            "font-bold text-2xl transition-colors duration-300",
            isScrolled ? "text-cafePurple-dark" : "text-white"
          )}>
            Cafeteriase
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="hidden md:flex space-x-6 mr-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors",
                    isScrolled
                      ? "text-gray-700 hover:text-cafePurple"
                      : "text-white hover:text-white/80"
                  )}
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <Button 
              onClick={onCartClick} 
              variant="ghost" 
              className={cn(
                "relative",
                isScrolled ? "" : "text-white hover:bg-white/10"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cafePurple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <UserMenu isScrolled={isScrolled} />
            
            <Button 
              className={cn(
                "ml-4",
                isScrolled
                  ? "bg-cafePurple hover:bg-cafePurple-dark text-white"
                  : "bg-white text-cafePurple hover:bg-white/90"
              )}
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Button 
              onClick={onCartClick} 
              variant="ghost" 
              size="sm" 
              className={cn(
                "relative mr-2",
                isScrolled ? "" : "text-white hover:bg-white/10"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cafePurple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <UserMenu isScrolled={isScrolled} />
            
            <Button
              variant="ghost"
              size="sm"
              className={isScrolled ? "" : "text-white hover:bg-white/10"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-fade-in">
          <div className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-cafePurple font-medium text-lg py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="bg-cafePurple hover:bg-cafePurple-dark text-white mt-4">
              Order Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
