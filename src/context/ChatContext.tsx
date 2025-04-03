import React, { useEffect, useState, createContext, useContext } from 'react'
import {
  ref,
  push,
  set,
  onValue,
  off,
  serverTimestamp,
} from 'firebase/database'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { database, storage } from '../services/firebase'
import { useAuth } from './AuthContext'
interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: number
  imageUrl?: string
}
interface ChatContextType {
  messages: Message[]
  sendMessage: (text: string, image?: File) => Promise<void>
  uploadProgress: number
}
const ChatContext = createContext<ChatContextType | null>(null)
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
export const ChatProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const { currentUser } = useAuth()
  useEffect(() => {
    if (!currentUser) return
    const messagesRef = ref(database, 'messages')
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messagesList = Object.entries(data).map(
            ([id, value]: [string, any]) => ({
              id,
              text: value.text,
              senderId: value.senderId,
              senderName: value.senderName,
              timestamp: value.timestamp,
              imageUrl: value.imageUrl,
            }),
        )
        messagesList.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(messagesList)
      } else {
        setMessages([])
      }
    })
    return () => {
      off(messagesRef)
    }
  }, [currentUser])
  const sendMessage = async (text: string, image?: File) => {
    if (!currentUser || (!text.trim() && !image)) return
    let imageUrl = ''
    if (image) {
      const imageRef = storageRef(storage, `images/${Date.now()}-${image.name}`)
      const uploadTask = uploadBytesResumable(imageRef, image)
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              setUploadProgress(progress)
            },
            (error) => {
              reject(error)
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
              resolve()
            },
        )
      })
    }
    const messagesRef = ref(database, 'messages')
    const newMessageRef = push(messagesRef)
    await set(newMessageRef, {
      text: text.trim(),
      senderId: currentUser.uid,
      senderName: currentUser.email?.split('@')[0] || 'Anonymous',
      timestamp: serverTimestamp(),
      ...(imageUrl && {
        imageUrl,
      }),
    })
    setUploadProgress(0)
  }
  const value = {
    messages,
    sendMessage,
    uploadProgress,
  }
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
