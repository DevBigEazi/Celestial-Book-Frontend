export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  rating: number; // 0–5, one decimal
  reviewCount: number;
  genres: string[];
  tropes: string[];
  atmosphere: string; // e.g. "Magical", "Slow Burn · Atmospheric", "Mysterious · Lonely"
  pageCount: number;
  publishedYear: number;
  purchaseUrl: string;
  googlePlayUrl?: string;
  amazonUrl?: string;
  isNicheOrIndie?: boolean;
  whyBlurb?: string;
  isInLibrary: boolean;
  isSaved: boolean;
}

export type BookSummary = Pick<
  Book,
  'id' | 'title' | 'author' | 'coverUrl' | 'rating' | 'genres'
> & {
  tropes?: string[];
  atmosphere?: string;
};
