import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { useChat } from '../../context/ChatContext';
import {TypingIndicator} from "@/components/Chat/TypingIndicator.tsx";

export const MessageList: React.FC = () => {
  const { messages,typingUsers } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, typingUsers])

  return (
      <div className="flex-1 p-4 overflow-y-auto bg-black-900">
        {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="mb-2 text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
        ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                  <Message
                      key={message.id}
                      id={message.id}
                      text={message.text}
                      senderId={message.senderId}
                      senderName={message.senderName}
                      timestamp={message.timestamp}
                      imageUrl={message.imageUrl}
                  />
              ))}
              {typingUsers.map((user) => (
                  <TypingIndicator key={user.id} name={user.name} />
              ))}
            </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
  );
};