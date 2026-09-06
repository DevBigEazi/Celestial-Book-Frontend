export interface RecommendationResult {
  bookId: string;
  reason: string; // "Why this book" blurb
}

export interface ReaderPersona {
  tagline: string; // e.g. "Romantic · Atmospheric · Slow Burn"
  name: string; // e.g. "The Midnight Explorer"
  title?: string;
  description: string; // 2–3 sentences about this reader type
  summary?: string;
  genres?: string[];
  tropes?: string[];
}

export interface AILoadingState {
  isLoading: boolean;
  error: string | null;
}
