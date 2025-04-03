import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password).then(() => {}).catch(error => {
      throw error;
    });
  };
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password).then(() => {}).catch(error => {
      throw error;
    });
  };
  const logout = () => {
    return signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };
  return <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>;
};