export interface RecommendationResult {
  bookId: string;
  reason: string;       // "Why this book" blurb
}

export interface ReaderPersona {
  name: string;         // e.g. "The Midnight Explorer"
  description: string;  // 2–3 sentences about this reader type
}

export interface AILoadingState {
  isLoading: boolean;
  error: string | null;
}
