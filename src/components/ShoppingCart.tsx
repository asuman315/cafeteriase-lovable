
import { useState, useEffect } from "react";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart = ({ isOpen, onClose }: ShoppingCartProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  // Format price based on currency
  const formatPrice = (price: number, currency = "USD") => {
    const currencySymbol = currency === "USD" ? "$" : 
                           currency === "EUR" ? "€" : 
                           currency === "GBP" ? "£" : "$";
                           
    return `${currencySymbol}${price.toFixed(2)}`;
  };

  // Handle checkout
  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Proceeding to checkout with your items",
      className: "bg-green-50 border-green-200 text-green-800",
    });
    // This would typically navigate to a checkout page
    // For now, we'll just close the cart
    handleClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity",
        isClosing ? "opacity-0" : "opacity-100",
        isOpen ? "block" : "hidden"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300",
          isClosing ? "translate-x-full" : "translate-x-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">
                  Add items from our menu to get started
                </p>
                <Button 
                  className="bg-cafePurple hover:bg-cafePurple-dark"
                  onClick={handleClose}
                  asChild
                >
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">{formatPrice(item.price * item.quantity, item.currency)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.description && typeof item.description === 'string' ? 
                        item.description.replace(/<[^>]*>/g, '') : ''}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-sm text-gray-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between text-base font-medium mb-4">
                <p>Subtotal</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <Button className="w-full bg-cafePurple hover:bg-cafePurple-dark" onClick={handleCheckout}>
                Checkout
              </Button>
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  className="text-sm text-gray-500"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="link"
                  className="text-sm text-cafePurple"
                  onClick={handleClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
