import { User } from './user';

export interface QuizResult {
  genres: string[];
  mood: string;
  personality: string;
  tropes: string[];
  readingHabit: string;
}

export interface Storage {
  '@cb/onboarded': 'true' | 'false';
  '@cb/quiz_result': QuizResult;
  '@cb/user': User;
  '@cb/library': string[];
  '@cb/saved': string[];
  '@cb/theme': 'light' | 'dark' | 'system';
  '@cb/joined_clubs': string[];
  '@cb/joined_communities': string[];
}
