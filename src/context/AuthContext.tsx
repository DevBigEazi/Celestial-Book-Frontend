import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, QuizResult } from '../types';

export interface AuthContextValue {
  user: User | null;
  onboarded: boolean;
  quizResult: QuizResult | null;
  library: string[];
  saved: string[];
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (quizResult: QuizResult) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  toggleSaveBook: (bookId: string) => Promise<void>;
  toggleLibraryBook: (bookId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [library, setLibrary] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    async function loadAuthState() {
      try {
        const [storedUser, storedOnboarded, storedQuiz, storedLib, storedSav] = await Promise.all([
          AsyncStorage.getItem('@cb/user'),
          AsyncStorage.getItem('@cb/onboarded'),
          AsyncStorage.getItem('@cb/quiz_result'),
          AsyncStorage.getItem('@cb/library'),
          AsyncStorage.getItem('@cb/saved'),
        ]);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setOnboarded(storedOnboarded === 'true');
        if (storedQuiz) {
          setQuizResult(JSON.parse(storedQuiz));
        }
        if (storedLib) {
          setLibrary(JSON.parse(storedLib));
        }
        if (storedSav) {
          setSaved(JSON.parse(storedSav));
        }
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
        id: 'user-001',
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
      setLibrary([]);
      setSaved([]);
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
        AsyncStorage.removeItem('@cb/reader_persona'),
      ]);
      setUser(null);
      setOnboarded(false);
      setQuizResult(null);
      setLibrary([]);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (quiz: QuizResult) => {
    setLoading(true);
    try {
      await Promise.all([
        AsyncStorage.setItem('@cb/onboarded', 'true'),
        AsyncStorage.setItem('@cb/quiz_result', JSON.stringify(quiz)),
      ]);
      setOnboarded(true);
      setQuizResult(quiz);
    } finally {
      setLoading(false);
    }
  };

  const resetOnboarding = async () => {
    setLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem('@cb/onboarded'),
        AsyncStorage.removeItem('@cb/quiz_result'),
        AsyncStorage.removeItem('@cb/reader_persona'),
      ]);
      setOnboarded(false);
      setQuizResult(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveBook = async (bookId: string) => {
    try {
      let nextSaved: string[];
      if (saved.includes(bookId)) {
        nextSaved = saved.filter((id) => id !== bookId);
      } else {
        nextSaved = [...saved, bookId];
      }
      await AsyncStorage.setItem('@cb/saved', JSON.stringify(nextSaved));
      setSaved(nextSaved);
    } catch (e) {
      console.warn('Failed to toggle save state', e);
    }
  };

  const toggleLibraryBook = async (bookId: string) => {
    try {
      let nextLibrary: string[];
      if (library.includes(bookId)) {
        nextLibrary = library.filter((id) => id !== bookId);
      } else {
        nextLibrary = [...library, bookId];
      }
      await AsyncStorage.setItem('@cb/library', JSON.stringify(nextLibrary));
      setLibrary(nextLibrary);
    } catch (e) {
      console.warn('Failed to toggle library state', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        onboarded,
        quizResult,
        library,
        saved,
        loading,
        login,
        register,
        logout,
        completeOnboarding,
        resetOnboarding,
        toggleSaveBook,
        toggleLibraryBook,
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
