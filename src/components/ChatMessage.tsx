
import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/types/chatbot';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-cafePurple text-white' : 'bg-gray-200 text-gray-700'}`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <div>
          <div className={`px-4 py-2 rounded-lg ${isUser ? 'bg-cafePurple text-white' : 'bg-gray-100 text-gray-800'}`}>
            <p className="text-sm">{message.content}</p>
          </div>
          
          {/* Show products if present */}
          {message.products && message.products.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mt-2">
              {message.products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center p-2">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded overflow-hidden">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formattedTime}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
