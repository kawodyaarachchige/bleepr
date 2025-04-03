import React, { useState, useRef } from 'react'
import { SendIcon, ImageIcon, XIcon } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
export const MessageInput: React.FC = () => {
    const [message, setMessage] = useState('')
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { sendMessage, uploadProgress } = useChat()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() || selectedImage) {
            await sendMessage(message, selectedImage || undefined)
            setMessage('')
            setSelectedImage(null)
            setPreviewUrl(null)
        }
    }
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                alert('File size must be less than 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed')
                return
            }
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const clearSelectedImage = () => {
        setSelectedImage(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }
    return (
        <div className="p-4 bg-black border-t border-indigo-600-100">
            {previewUrl && (
                <div className="relative mb-2 inline-block">
                    <img src={previewUrl} alt="Preview" className="max-h-32 rounded-md" />
                    <button
                        onClick={clearSelectedImage}
                        className="absolute top-1 right-1 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-2">
                    <div className="h-2 bg-gray-200 rounded">
                        <div
                            className="h-2 bg-indigo-600 rounded"
                            style={{
                                width: `${uploadProgress}%`,
                            }}
                        />
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={!message.trim() && !selectedImage}
                    className="px-4 py-2 text-white bg-indigo-500 rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    )
}
