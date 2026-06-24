import { User } from './user';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string; // ISO string
}
