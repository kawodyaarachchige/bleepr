import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { useChat } from '../../context/ChatContext';
export const MessageList: React.FC = () => {
  const {
    messages
  } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom whenever messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  return <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="mb-2 text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div> : messages.map(message => <Message key={message.id} id={message.id} text={message.text} senderId={message.senderId} senderName={message.senderName} timestamp={message.timestamp} />)}
      <div ref={endOfMessagesRef} />
    </div>;
};