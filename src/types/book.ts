export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  rating: number; // 0–5, one decimal
  reviewCount: number;
  genres: string[];
  pageCount: number;
  publishedYear: number;
  purchaseUrl: string;
  isInLibrary: boolean;
  isSaved: boolean;
}

export type BookSummary = Pick<
  Book,
  "id" | "title" | "author" | "coverUrl" | "rating" | "genres"
>;
