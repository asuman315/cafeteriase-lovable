
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import { Link, useLocation } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useCart } from "@/hooks/use-cart";

interface NavBarProps {
  onCartClick?: () => void;
  cartItemCount?: number;
}

const NavBar = ({ onCartClick, cartItemCount: propCartItemCount }: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  
  // Use prop cartItemCount if provided, otherwise use from hook
  const cartItemCount = propCartItemCount !== undefined ? propCartItemCount : totalItems;

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

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      setIsCartOpen(true);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Favorites", href: "/favorites" },
  ];
  
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <>
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
            <Link to="/" className={cn(
              "font-bold text-2xl transition-colors duration-300",
              isScrolled ? "text-cafePurple-dark" : "text-white"
            )}>
              Cafeteriase
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="hidden md:flex space-x-6 mr-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "font-medium transition-colors",
                      isActivePath(link.href) ? "text-cafePurple font-semibold" : "",
                      isScrolled
                        ? "text-gray-700 hover:text-cafePurple"
                        : "text-white hover:text-white/80"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <Button 
                onClick={handleCartClick} 
                variant="ghost" 
                className={cn(
                  "relative",
                  isScrolled ? "" : "text-white hover:bg-white/10"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
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
                asChild
              >
                <Link to="/products">Order Now</Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center md:hidden">
              <Button 
                onClick={handleCartClick} 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "relative mr-2",
                  isScrolled ? "" : "text-white hover:bg-white/10"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
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
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-gray-700 hover:text-cafePurple font-medium text-lg py-2 transition-colors",
                    isActivePath(link.href) ? "text-cafePurple font-semibold" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-cafePurple hover:bg-cafePurple-dark text-white mt-4" asChild>
                <Link to="/products" onClick={() => setIsMenuOpen(false)}>Order Now</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Shopping Cart Drawer */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default NavBar;
