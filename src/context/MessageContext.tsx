"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (type: 'success' | 'error' | 'info', text: string) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    const newMessage = { id, type, text };
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, removeMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
} 