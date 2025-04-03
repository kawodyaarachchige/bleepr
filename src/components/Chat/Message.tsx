import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface MessageProps {
    id: string
    text: string
    senderId: string
    senderName: string
    timestamp: number
    imageUrl?: string
}
export const Message: React.FC<MessageProps> = ({
                                                    text,
                                                    senderId,
                                                    senderName,
                                                    timestamp,
                                                    imageUrl,
                                                }) => {
    const { currentUser } = useAuth()
    const isCurrentUser = currentUser?.uid === senderId
    const formatTime = (timestamp: number) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div
            className={`flex  ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-xs md:max-w-md lg:max-w-lg  ${
                    isCurrentUser 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'}
                         rounded-lg overflow-hidden`}
            >
                {!isCurrentUser && (
                    <div className="px-4 pt-2 text-xs font-semibold text-cyan-400">{senderName}</div>
                )}
                {imageUrl && (
                    <div className="max-w-xs">
                        <img
                            src={imageUrl}
                            alt="Shared image"
                            className="w-full h-auto rounded-lg"
                            loading="lazy"
                        />
                    </div>
                )}
                {text && <p className="px-4 py-2 text-sm">{text}</p>}
                <div
                    className={`px-4 pb-2 text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'}`}
                >
                    {formatTime(timestamp)}
                </div>
            </div>
        </div>
    )
}
