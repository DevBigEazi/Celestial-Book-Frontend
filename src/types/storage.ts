import { User } from './user';
import { ReaderPersona } from './ai';

export interface MoodSpectrum {
  pacing: number; // -2 (Slow Burn) to 2 (Fast Plot)
  tone: number; // -2 (Tender) to 2 (Brutal)
  ending: number; // -2 (Bittersweet) to 2 (Triumphant)
  scope: number; // -2 (Intimate Room) to 2 (Whole Empire)
  pov: number; // -2 (First Person) to 2 (Third Person)
}

export interface QuizResult {
  deepQuestions?: Record<string, boolean>;
  moodSliders?: MoodSpectrum;
  whereShouldStoryTakeYou?: string;
  currentResidingBook?: string;
  genres: string[];
  tropes: string[];
  // Legacy compatibility fields
  mood?: string;
  personality?: string;
  readingHabit?: string;
}

export type TBRStatus = 'want_to_read' | 'currently_reading' | 'finished';

export interface UserBookEntry {
  bookId: string;
  status: TBRStatus;
  addedAt: string;
  isOwned: boolean;
  ownedSource?: 'google_play' | 'amazon' | 'physical';
}

export interface Storage {
  '@cb/onboarded': 'true' | 'false';
  '@cb/quiz_result': QuizResult;
  '@cb/reader_persona': ReaderPersona;
  '@cb/user': User;
  '@cb/library': string[];
  '@cb/saved': string[];
  '@cb/tbr_entries': UserBookEntry[];
  '@cb/theme': 'light' | 'dark' | 'system';
  '@cb/theme_mode': 'light' | 'dark' | 'system';
  '@cb/sky_theme': string;
  '@cb/accent_color': 'gold' | 'blue';
  '@cb/typography': string;
  '@cb/joined_clubs': string[];
  '@cb/joined_communities': string[];
}
