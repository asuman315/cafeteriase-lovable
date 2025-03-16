
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuCategory, MenuItem } from "@/types";
import { Plus } from "lucide-react";

interface MenuSectionProps {
  categories: MenuCategory[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuSection = ({ categories, onAddToCart }: MenuSectionProps) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);

  return (
    <section id="menu" className="py-24 bg-cafeGray-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted menu featuring premium coffee and delicious food
            made with the finest ingredients.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 md:justify-center md:mx-0 md:px-0">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={
                  activeCategory === category.id
                    ? "bg-cafePurple hover:bg-cafePurple-dark"
                    : "hover:text-cafePurple"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .find((cat) => cat.id === activeCategory)
            ?.items.map((item) => (
              <div
                key={item.id}
                className="menu-card animate-fade-in"
                style={{ animationDelay: `${item.id * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-xl">{item.name}</h3>
                    <span className="text-cafePurple font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Button
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-cafePurple hover:bg-cafePurple-dark"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
