import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { ChatRoom } from './components/Chat/ChatRoom';
const ChatApp: React.FC = () => {
  const {
    currentUser
  } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  return <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      {currentUser ? <ChatProvider>
          <div className="w-full h-screen max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg md:h-[600px]">
            <ChatRoom />
          </div>
        </ChatProvider> : <div className="w-full max-w-md">
          {showLogin ? <Login onToggleForm={() => setShowLogin(false)} /> : <SignUp onToggleForm={() => setShowLogin(true)} />}
        </div>}
    </div>;
};
export function App() {
  return <AuthProvider>
      <ChatApp />
    </AuthProvider>;
}