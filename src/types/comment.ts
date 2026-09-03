import { User } from './user';

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'invested'
  | 'yearning';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string; // ISO string
}

export interface CirclePost {
  id: string;
  clubId: string;
  author: User;
  emotion: EmotionType;
  content: string;
  bookTitle?: string;
  chapterOrPageRef?: string;
  likes: number;
  commentCount: number;
  createdAt: string;
  isLiked: boolean;
}
