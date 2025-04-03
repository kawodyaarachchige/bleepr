import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export const ChatRoom: React.FC = () => {
  const {
    currentUser,
    logout
  } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return <div className="flex flex-col w-full h-full bg-gray-50">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-800">Chat Room</h1>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          <LogOutIcon className="w-4 h-4 mr-1" />
          Logout
        </button>
      </header>
      <div className="flex flex-col flex-1 overflow-hidden">
        <MessageList />
        <MessageInput />
      </div>
    </div>;
};