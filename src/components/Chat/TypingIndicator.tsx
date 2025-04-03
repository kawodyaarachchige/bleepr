import React from 'react'
export const TypingIndicator: React.FC<{
    name: string
}> = ({ name }) => {
    return (
        <div className="flex items-center space-x-2 px-4 py-2 animate-fade-in">
            <div className="flex space-x-1">
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                        animationDelay: '0ms',
                    }}
                />
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                        animationDelay: '150ms',
                    }}
                />
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                        animationDelay: '300ms',
                    }}
                />
            </div>
            <span className="text-sm text-gray-500">{name} is typing...</span>
        </div>
    )
}
