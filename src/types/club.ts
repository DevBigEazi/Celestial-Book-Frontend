import { BookSummary } from './book';

export interface BookClub {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  currentBook: BookSummary | null;
  memberCount: number;
  isJoined: boolean;
  isTemporary: boolean; // ~2 month clubs
  endsAt: string | null; // ISO string, only if isTemporary
}
