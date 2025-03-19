
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Chatbot from '@/components/Chatbot';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-cafePurple text-white p-4 rounded-full shadow-lg hover:bg-cafePurple-dark transition-colors z-40"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotButton;
