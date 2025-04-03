import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const {
    sendMessage
  } = useChat();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  return <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200">
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <SendIcon className="w-5 h-5" />
      </button>
    </form>;
};