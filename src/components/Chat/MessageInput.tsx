import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
      <form onSubmit={handleSubmit} className="flex items-center p-4 bg-black-800 border-t border-gray-700">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-gray-200 bg-gray-700 border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 "
        />
        <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
  );
};