
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemoveItem: (id: number) => void;
}

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity",
        isClosing ? "opacity-0" : "opacity-100"
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
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-cafeGray mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">
                  Add items from our menu to get started
                </p>
                <Button 
                  className="bg-cafePurple hover:bg-cafePurple-dark"
                  onClick={handleClose}
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
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
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-sm text-gray-500"
                          onClick={() => onRemoveItem(item.id)}
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

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between text-base font-medium mb-4">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <Button className="w-full bg-cafePurple hover:bg-cafePurple-dark">
                Checkout
              </Button>
              <p className="mt-2 text-center text-sm text-gray-500">
                or{" "}
                <button
                  className="font-medium text-cafePurple hover:text-cafePurple-dark"
                  onClick={handleClose}
                >
                  Continue Shopping
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
