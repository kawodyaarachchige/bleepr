import React from 'react';
import { useAuth } from '../../context/AuthContext';
interface MessageProps {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}
export const Message: React.FC<MessageProps> = ({
  text,
  senderId,
  senderName,
  timestamp
}) => {
  const {
    currentUser
  } = useAuth();
  const isCurrentUser = currentUser?.uid === senderId;
  // Format timestamp
  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${isCurrentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        {!isCurrentUser && <div className="text-xs font-semibold mb-1">{senderName}</div>}
        <p className="text-sm">{text}</p>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>;
};