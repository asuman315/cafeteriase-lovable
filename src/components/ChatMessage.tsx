
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chatbot';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (productId: string) => {
    if (!message.products) return;
    
    const product = message.products.find(p => p.id === productId);
    if (product) {
      addToCart({
        ...product,
        featured: false,
        images: [product.image],
        currency: 'USD',
      });
      
      toast.success({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-3/4 rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-cafePurple text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        
        {message.products && message.products.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {message.products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                    {product.description.replace(/<[^>]*>/g, '')}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-cafePurple font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-cafePurple hover:bg-cafePurple-dark"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
