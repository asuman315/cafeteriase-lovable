
import { motion } from "framer-motion";
import { ShoppingBag, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProductHeroSection = () => {
  return (
    <section className="py-16 bg-cafePurple-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cafePurple-dark via-cafePurple to-purple-700 opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Our Premium Products
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Handcrafted with love, our menu features the finest ingredients to deliver exceptional taste and quality.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              className="bg-white text-cafePurple hover:bg-white/90 px-8"
              asChild
            >
              <Link to="/checkout">Order Now</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white bg-transparent hover:bg-white/10"
              asChild
            >
              <a href="#products">Browse Menu</a>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4 hover:bg-white/20 transition-all duration-300">
            <div className="bg-white/20 rounded-full p-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quick Ordering</h3>
              <p className="text-white/70">Simple checkout process for faster delivery and pickup.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4 hover:bg-white/20 transition-all duration-300">
            <div className="bg-white/20 rounded-full p-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-white/70">Only the finest ingredients sourced from trusted suppliers.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4 hover:bg-white/20 transition-all duration-300">
            <div className="bg-white/20 rounded-full p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-white/70">Get your orders delivered promptly to your doorstep.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductHeroSection;
