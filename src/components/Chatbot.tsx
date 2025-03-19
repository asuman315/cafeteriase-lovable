
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from './ui/button';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { messages, addMessage, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMounted(true);
    
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      addMessage('assistant', 'Hello! I\'m your Cafeteriase virtual assistant. How can I help you today?');
    }
    
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-cafePurple text-white">
              <h2 className="text-lg font-semibold">Cafeteriase Assistant</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-cafePurple-dark rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-cafePurple">
                  <div className="animate-bounce h-2 w-2 bg-cafePurple rounded-full"></div>
                  <div className="animate-bounce delay-100 h-2 w-2 bg-cafePurple rounded-full"></div>
                  <div className="animate-bounce delay-200 h-2 w-2 bg-cafePurple rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <ChatInput onSendMessage={(content) => addMessage('user', content)} isLoading={isLoading} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
