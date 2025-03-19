
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContextType, ChatMessage, Product } from '@/types/chatbot';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Create context with default values
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to add a new message to the chat
  const addMessage = (role: 'user' | 'assistant' | 'system', content: string, products?: Product[]) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      products,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // If it's a user message, generate a response
    if (role === 'user') {
      setIsLoading(true);
      
      // Simulate AI thinking time (1-3 seconds)
      setTimeout(() => {
        // Generate a simple response for the cafe demo
        const responses = [
          "I'd be happy to help you with our menu options!",
          "Our coffee is sourced from ethically managed farms.",
          "Would you like to know about our seasonal specials?",
          "I can help you place an order or answer any questions about our items.",
          "Our most popular item is the Vanilla Latte with our homemade syrup.",
        ];
        
        // Get a random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // If user asked about products, fetch and include some products
        let productMatches: Product[] = [];
        const productKeywords = ["coffee", "latte", "espresso", "cake", "pastry", "food", "drink", "menu"];
        
        if (productKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
          // Add product recommendations
          addProductRecommendations(content);
        } else {
          // Just add the text response
          addMessage('assistant', randomResponse);
        }
        
        setIsLoading(false);
      }, Math.random() * 2000 + 1000);
    }
  };

  // Function to add product recommendations based on user query
  const addProductRecommendations = async (query: string) => {
    try {
      const { data: products } = await supabase
        .from('cafe_products')
        .select('*')
        .limit(3);
      
      if (products && products.length > 0) {
        const formattedProducts = products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price,
          image: p.images && p.images[0] ? p.images[0] : '/placeholder.svg', 
          category: p.category || 'Other'
        }));
        
        addMessage(
          'assistant', 
          `Here are some items you might like based on your request:`, 
          formattedProducts
        );
      } else {
        addMessage('assistant', "I couldn't find any products matching your request. Can I help you with something else?");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      addMessage('assistant', "I'm having trouble finding products right now. Please try again later.");
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
