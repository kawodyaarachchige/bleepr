import React, { useEffect, useState, createContext, useContext } from 'react';
import { ref, push, set, onValue, off, serverTimestamp } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from './AuthContext';
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}
interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
}
const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    currentUser
  } = useAuth();
  useEffect(() => {
    if (!currentUser) return;
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          text: value.text,
          senderId: value.senderId,
          senderName: value.senderName,
          timestamp: value.timestamp
        }));
        // Sort messages by timestamp
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });
    return () => {
      off(messagesRef);
    };
  }, [currentUser]);
  const sendMessage = (text: string) => {
    if (!currentUser || !text.trim()) return;
    const messagesRef = ref(database, 'messages');
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      text: text.trim(),
      senderId: currentUser.uid,
      senderName: currentUser.email?.split('@')[0] || 'Anonymous',
      timestamp: serverTimestamp()
    });
  };
  const value = {
    messages,
    sendMessage
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};