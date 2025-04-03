import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { ChatRoom } from './components/Chat/ChatRoom';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from './components/ThemeToggle';

const ChatApp: React.FC = () => {
    const { currentUser } = useAuth();
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="min-h-screen bg-[url('https://wallpapercave.com/wp/wp9983504.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="min-h-screen w-full backdrop-blur-10 flex items-center justify-center p-4">
                <div className="container mx-auto flex items-center justify-center">
                    {currentUser ? (
                        <ChatProvider>
                            <ThemeToggle />
                            <div className="w-full h-[calc(100vh-2rem)] md:h-[800px] max-w-5xl mx-auto overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-2xl relative">
                                <ChatRoom />
                            </div>
                        </ChatProvider>
                    ) : (
                        <div className="w-full sm:w-[440px] mx-auto relative">
                            <ThemeToggle />
                            {showLogin ? (
                                <Login onToggleForm={() => setShowLogin(false)} />
                            ) : (
                                <SignUp onToggleForm={() => setShowLogin(true)} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <ChatApp />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;