import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

import { useAuth } from '../../context/AuthContext';
import {ExitIcon} from "@radix-ui/react-icons";

export const ChatRoom: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
      <div className="flex flex-col w-full h-full bg-black">
        <header className="flex items-center justify-between px-6 py-4 bg-black-800 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Bleepr 💬</h1>
              <p className="text-sm text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
          <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            <ExitIcon className="w-4 h-4 mr-2" />
            Leave 👋🏻
          </button>
        </header>
        <div className="flex flex-col flex-1 overflow-hidden">
          <MessageList />
          <MessageInput />
        </div>
      </div>
  );
};