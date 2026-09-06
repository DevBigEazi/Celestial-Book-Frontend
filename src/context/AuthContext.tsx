import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, QuizResult, ReaderPersona, TBRStatus } from '../types';

export interface AuthContextValue {
  user: User | null;
  onboarded: boolean;
  quizResult: QuizResult | null;
  readerPersona: ReaderPersona | null;
  library: string[];
  saved: string[];
  tbrStatuses: Record<string, TBRStatus>;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (quizResult: QuizResult, persona?: ReaderPersona) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  toggleSaveBook: (bookId: string) => Promise<void>;
  toggleLibraryBook: (bookId: string) => Promise<void>;
  updateBookStatus: (bookId: string, status: TBRStatus) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  cancelAccount: () => Promise<void>;
}

const DEFAULT_SAVED = ['book-001', 'book-002', 'book-003', 'book-005', 'book-006', 'book-008'];
const DEFAULT_LIBRARY = ['book-001', 'book-002', 'book-005', 'book-007', 'book-008'];
const DEFAULT_TBR_STATUSES: Record<string, TBRStatus> = {
  'book-001': 'currently_reading',
  'book-002': 'want_to_read',
  'book-003': 'want_to_read',
  'book-005': 'finished',
  'book-006': 'want_to_read',
  'book-008': 'currently_reading',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [readerPersona, setReaderPersona] = useState<ReaderPersona | null>(null);
  const [library, setLibrary] = useState<string[]>(DEFAULT_LIBRARY);
  const [saved, setSaved] = useState<string[]>(DEFAULT_SAVED);
  const [tbrStatuses, setTbrStatuses] = useState<Record<string, TBRStatus>>(DEFAULT_TBR_STATUSES);
  const [loading, setLoading] = useState<boolean>(true);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    async function loadAuthState() {
      try {
        const [storedUser, storedOnboarded, storedQuiz, storedPersona, storedLib, storedSav, storedStatuses] =
          await Promise.all([
            AsyncStorage.getItem('@cb/user'),
            AsyncStorage.getItem('@cb/onboarded'),
            AsyncStorage.getItem('@cb/quiz_result'),
            AsyncStorage.getItem('@cb/reader_persona'),
            AsyncStorage.getItem('@cb/library'),
            AsyncStorage.getItem('@cb/saved'),
            AsyncStorage.getItem('@cb/tbr_statuses'),
          ]);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setOnboarded(storedOnboarded === 'true');
        if (storedQuiz) {
          setQuizResult(JSON.parse(storedQuiz));
        }
        if (storedPersona) {
          setReaderPersona(JSON.parse(storedPersona));
        }
        if (storedLib) {
          setLibrary(JSON.parse(storedLib));
        } else {
          setLibrary(DEFAULT_LIBRARY);
        }
        if (storedSav) {
          setSaved(JSON.parse(storedSav));
        } else {
          setSaved(DEFAULT_SAVED);
        }
        if (storedStatuses) {
          setTbrStatuses(JSON.parse(storedStatuses));
        } else {
          setTbrStatuses(DEFAULT_TBR_STATUSES);
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
        AsyncStorage.removeItem('@cb/tbr_statuses'),
      ]);
      setUser(null);
      setOnboarded(false);
      setQuizResult(null);
      setLibrary([]);
      setSaved([]);
      setTbrStatuses({});
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (quiz: QuizResult, persona?: ReaderPersona) => {
    setLoading(true);
    try {
      const effectivePersona: ReaderPersona = persona || {
        tagline: `${quiz.genres[0] || 'Atmospheric'} · ${quiz.tropes[0] || 'Slow Burn'}`,
        name: 'The Midnight Romancer',
        description:
          'You seek stories that linger in the dark like candlelight. Emotional depth and slow-burning tension speak louder to you than mere speed.',
        genres: quiz.genres,
        tropes: quiz.tropes,
      };

      await Promise.all([
        AsyncStorage.setItem('@cb/onboarded', 'true'),
        AsyncStorage.setItem('@cb/quiz_result', JSON.stringify(quiz)),
        AsyncStorage.setItem('@cb/reader_persona', JSON.stringify(effectivePersona)),
      ]);
      setOnboarded(true);
      setQuizResult(quiz);
      setReaderPersona(effectivePersona);
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
      setReaderPersona(null);
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

  const updateBookStatus = async (bookId: string, status: TBRStatus) => {
    try {
      const nextStatuses = { ...tbrStatuses, [bookId]: status };
      if (!saved.includes(bookId)) {
        const nextSaved = [...saved, bookId];
        await AsyncStorage.setItem('@cb/saved', JSON.stringify(nextSaved));
        setSaved(nextSaved);
      }
      await AsyncStorage.setItem('@cb/tbr_statuses', JSON.stringify(nextStatuses));
      setTbrStatuses(nextStatuses);
    } catch (e) {
      console.warn('Failed to update book status', e);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updatedUser: User = user
        ? { ...user, ...updates }
        : {
            id: 'user-001',
            name: updates.name || 'Stargazer',
            username: updates.username || 'stargazer',
            avatarUrl: updates.avatarUrl || 'https://i.pravatar.cc/150?u=stargazer',
            bio: updates.bio || 'Wanderer of celestial stories.',
            booksRead: 5,
            following: 10,
            followers: 12,
            favoriteGenres: ['Fantasy', 'Romance'],
            ...updates,
          };
      await AsyncStorage.setItem('@cb/user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (e) {
      console.warn('Failed to update profile', e);
    }
  };

  const cancelAccount = async () => {
    setLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem('@cb/user'),
        AsyncStorage.removeItem('@cb/onboarded'),
        AsyncStorage.removeItem('@cb/quiz_result'),
        AsyncStorage.removeItem('@cb/reader_persona'),
        AsyncStorage.removeItem('@cb/library'),
        AsyncStorage.removeItem('@cb/saved'),
        AsyncStorage.removeItem('@cb/joined_clubs'),
        AsyncStorage.removeItem('@cb/joined_communities'),
        AsyncStorage.removeItem('@cb/tbr_statuses'),
      ]);
      setUser(null);
      setOnboarded(false);
      setQuizResult(null);
      setReaderPersona(null);
      setLibrary([]);
      setSaved([]);
      setTbrStatuses({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        onboarded,
        quizResult,
        readerPersona,
        library,
        saved,
        tbrStatuses,
        loading,
        login,
        register,
        logout,
        completeOnboarding,
        resetOnboarding,
        toggleSaveBook,
        toggleLibraryBook,
        updateBookStatus,
        updateProfile,
        cancelAccount,
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
