import { BookSummary } from './book';

export interface BookClub {
  id: string;
  name: string;
  tagline: string; // e.g. "Slow burn · Atmospheric"
  description: string;
  coverUrl: string;
  currentBook: BookSummary | null;
  readingBook?: BookSummary | null;
  memberCount: number;
  isJoined: boolean;
  isPrivate?: boolean;
  isTemporary?: boolean; // ~2 month clubs
  endsAt?: string | null; // ISO string, only if isTemporary
}
