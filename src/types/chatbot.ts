
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (role: MessageRole, content: string, products?: Product[]) => void;
  isLoading: boolean;
};
