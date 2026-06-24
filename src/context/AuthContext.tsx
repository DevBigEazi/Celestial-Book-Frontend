import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, QuizResult } from '../types';

export interface AuthContextValue {
  user: User | null;
  onboarded: boolean;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (quizResult: QuizResult) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    async function loadAuthState() {
      try {
        const [storedUser, storedOnboarded] = await Promise.all([
          AsyncStorage.getItem('@cb/user'),
          AsyncStorage.getItem('@cb/onboarded'),
        ]);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setOnboarded(storedOnboarded === 'true');
      } catch {
        // Ignored
      } finally {
        setLoading(false);
      }
    }

    loadAuthState();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      // Create a mock user based on email (or fetch from storage if exists)
      const storedUserStr = await AsyncStorage.getItem('@cb/user');
      let loggedInUser: User;

      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.email === email) {
          loggedInUser = storedUser;
        } else {
          loggedInUser = {
            id: 'user-mock',
            name: email.split('@')[0],
            username: email.split('@')[0],
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
            bio: 'A passionate reader.',
            booksRead: 5,
            following: 10,
            followers: 12,
            favoriteGenres: [],
          };
        }
      } else {
        loggedInUser = {
          id: 'user-mock',
          name: email.split('@')[0],
          username: email.split('@')[0],
          avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
          bio: 'A passionate reader.',
          booksRead: 5,
          following: 10,
          followers: 12,
          favoriteGenres: [],
        };
      }

      await AsyncStorage.setItem('@cb/user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string) => {
    setLoading(true);
    try {
      const newUser: User = {
        id: 'user-001', // Standard mock user slug
        name,
        username: email.split('@')[0],
        avatarUrl: `https://i.pravatar.cc/150?u=${email.split('@')[0]}`,
        bio: 'Avid reader. Joined the celestial book club!',
        booksRead: 0,
        following: 0,
        followers: 0,
        favoriteGenres: [],
      };

      await Promise.all([
        AsyncStorage.setItem('@cb/user', JSON.stringify(newUser)),
        AsyncStorage.setItem('@cb/library', JSON.stringify([])),
        AsyncStorage.setItem('@cb/saved', JSON.stringify([])),
        AsyncStorage.setItem('@cb/joined_clubs', JSON.stringify([])),
        AsyncStorage.setItem('@cb/joined_communities', JSON.stringify([])),
      ]);

      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem('@cb/user'),
        AsyncStorage.removeItem('@cb/onboarded'),
        AsyncStorage.removeItem('@cb/quiz_result'),
        AsyncStorage.removeItem('@cb/library'),
        AsyncStorage.removeItem('@cb/saved'),
        AsyncStorage.removeItem('@cb/joined_clubs'),
        AsyncStorage.removeItem('@cb/joined_communities'),
      ]);
      setUser(null);
      setOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (quizResult: QuizResult) => {
    setLoading(true);
    try {
      await Promise.all([
        AsyncStorage.setItem('@cb/onboarded', 'true'),
        AsyncStorage.setItem('@cb/quiz_result', JSON.stringify(quizResult)),
      ]);
      setOnboarded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        onboarded,
        loading,
        login,
        register,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
