import { User } from './user';

export interface Community {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  memberCount: number;
  genre: string;
  isJoined: boolean;
}

export interface Post {
  id: string;
  communityId: string;
  author: User;
  bookId: string | null;
  content: string;
  likes: number;
  commentCount: number;
  createdAt: string; // ISO string
  isLiked: boolean;
}
