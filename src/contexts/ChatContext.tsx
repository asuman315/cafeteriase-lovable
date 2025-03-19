
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContextType, ChatMessage, MessageRole } from '@/types/chatbot';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! I\'m your customer support assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = async (role: MessageRole, content: string, products: Product[] = []) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      products,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // If this is a user message, generate a response
    if (role === 'user') {
      setIsLoading(true);
      
      try {
        // Search for products related to user's query
        const relatedProducts = await searchProducts(content);
        
        // Generate bot response based on user message
        let botResponse = await generateBotResponse(content, relatedProducts);
        
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuidv4(),
            role: 'assistant',
            content: botResponse,
            timestamp: new Date(),
            products: relatedProducts.length > 0 ? relatedProducts : undefined,
          },
        ]);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuidv4(),
            role: 'assistant',
            content: 'I apologize, but I encountered an error. Please try again or contact our support team.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Search for products based on user query
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      // Check if the query likely contains a product search
      const productTerms = [
        'coffee', 'tea', 'drink', 'food', 'breakfast', 'lunch', 'dinner', 
        'dessert', 'pastry', 'cake', 'want', 'buy', 'purchase', 'order',
        'show me', 'looking for', 'interested in'
      ];
      
      const containsProductSearch = productTerms.some(term => 
        query.toLowerCase().includes(term)
      );
      
      if (!containsProductSearch) {
        return [];
      }
      
      // Extract potential category from query
      const categories = ['Coffee', 'Breakfast', 'Lunch', 'Desserts'];
      let category = null;
      
      for (const cat of categories) {
        if (query.toLowerCase().includes(cat.toLowerCase())) {
          category = cat;
          break;
        }
      }
      
      // Query Supabase for products
      let productQuery = supabase.from('cafe_products').select('*');
      
      if (category) {
        productQuery = productQuery.eq('category', category);
      }
      
      const { data, error } = await productQuery;
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      // Map Supabase data to our Product interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.images && Array.isArray(item.images) && item.images[0] 
          ? item.images[0] 
          : '/placeholder.svg',
        category: item.category || 'Coffee',
      })) as Product[];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  // Generate bot response based on user message and available products
  const generateBotResponse = async (
    userMessage: string, 
    products: Product[]
  ): Promise<string> => {
    // Convert message to lowercase for easier comparison
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings)/i)) {
      return "Hello! I'm your customer support assistant. How can I help you today?";
    }
    
    // Check for product interest
    if (products.length > 0) {
      return `I found some items that might interest you. Would you like to know more about any of these?`;
    }
    
    // Check for specific product inquiries
    if (message.includes('coffee') || message.includes('drink')) {
      return "We have a variety of coffee options and beverages. Would you like to see our coffee menu?";
    }
    
    if (message.includes('food') || message.includes('eat') || message.includes('breakfast') || message.includes('lunch')) {
      return "We offer a range of breakfast and lunch options. Would you like to see our food menu?";
    }
    
    if (message.includes('dessert') || message.includes('sweet') || message.includes('cake') || message.includes('pastry')) {
      return "We have delicious desserts and pastries. Would you like to see our dessert options?";
    }
    
    // Handle purchase intentions
    if (message.includes('buy') || message.includes('purchase') || message.includes('order')) {
      return "I'd be happy to help you place an order. Could you tell me which specific items you're interested in?";
    }
    
    // Handle questions about location or hours
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      return "We're located at 123 Cafe Street, Downtown. Is there anything else you'd like to know?";
    }
    
    if (message.includes('hour') || message.includes('open') || message.includes('close') || message.includes('time')) {
      return "We're open daily from 7 AM to 8 PM. Our kitchen serves breakfast until 11 AM and lunch from 11 AM to 3 PM.";
    }
    
    // Handle questions about menu
    if (message.includes('menu')) {
      return "We offer a variety of coffee drinks, breakfast options, lunch meals, and desserts. Would you like to see specific items from our menu?";
    }
    
    // Default responses for other types of queries
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! Whether you have questions about our menu, location, hours, or placing an order, I'm happy to assist you.";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Feel free to ask if you need anything else.";
    }
    
    // Escalation to human support
    if (message.includes('speak to human') || message.includes('real person') || message.includes('agent')) {
      return "I understand you'd like to speak with a human agent. Please call our customer support at (555) 123-4567 during business hours, or email us at support@cafebeans.com.";
    }
    
    // Default catch-all response
    return "I'm not sure I understand. Could you please provide more details about what you're looking for?";
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
