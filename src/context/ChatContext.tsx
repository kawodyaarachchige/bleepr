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
interface TypingUser {
  id: string
  name: string
  timestamp: number
}
interface ChatContextType {
  messages: Message[]
  sendMessage: (text: string, image?: File) => Promise<void>
  uploadProgress: number
  setUserTyping: (isTyping: boolean) => void
  typingUsers: TypingUser[]
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
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const { currentUser } = useAuth()
  useEffect(() => {
    if (!currentUser) return
    const typingRef = ref(database, 'typing')
    onValue(typingRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const now = Date.now()
        const activeTypers = Object.entries(data)
            .map(([id, value]: [string, any]) => ({
              id,
              name: value.name,
              timestamp: value.timestamp,
            }))
            .filter(
                (user) =>
                    user.id !== currentUser.uid && now - user.timestamp < 10000, // Remove typing indicator after 10 seconds
            )
        setTypingUsers(activeTypers)
      } else {
        setTypingUsers([])
      }
    })
    return () => off(typingRef)
  }, [currentUser])
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
    return () => off(messagesRef)
  }, [currentUser])
  const setUserTyping = async (isTyping: boolean) => {
    if (!currentUser) return
    const typingRef = ref(database, `typing/${currentUser.uid}`)
    if (isTyping) {
      await set(typingRef, {
        name: currentUser.email?.split('@')[0] || 'Anonymous',
        timestamp: Date.now(),
      })
    } else {
      await set(typingRef, null)
    }
  }
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
    await setUserTyping(false)
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
    setUserTyping,
    typingUsers,
  }
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
