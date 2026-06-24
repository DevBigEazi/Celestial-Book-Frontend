export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  booksRead: number;
  following: number;
  followers: number;
  favoriteGenres: string[];
}
