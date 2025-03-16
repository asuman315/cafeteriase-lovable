
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cafePurple-dark text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Cafeteriase</h3>
            <p className="text-white/80 mb-6 max-w-md">
              Exceptional coffee, extraordinary food. Order online for pickup or delivery
              and experience the Cafeteriase difference.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-cafeGray-light transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-cafeGray-light transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-cafeGray-light transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-cafeGray-light transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="#menu" className="text-white/80 hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-white text-cafePurple-dark hover:bg-cafeGray-light rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          <p>© {new Date().getFullYear()} Cafeteriase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
