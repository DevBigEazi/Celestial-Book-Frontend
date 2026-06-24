import { Comment } from '../types/comment';
import { mockUsers } from './users';

export const mockComments: Comment[] = [
  {
    id: 'comment-001',
    postId: 'post-001',
    author: mockUsers[1], // John Smith
    content: 'Completely agree! The world-building in this book is second to none.',
    likes: 12,
    createdAt: '2026-06-25T14:30:00Z',
  },
  {
    id: 'comment-002',
    postId: 'post-001',
    author: mockUsers[2], // Alice Johnson
    content: 'I found it a bit slow at the start, but it definitely picks up in the second half.',
    likes: 4,
    createdAt: '2026-06-25T15:10:00Z',
  },
  {
    id: 'comment-003',
    postId: 'post-002',
    author: mockUsers[0], // Jane Doe
    content: 'Wow, I need to read this next. The themes sound so relevant!',
    likes: 8,
    createdAt: '2026-06-26T09:45:00Z',
  },
  {
    id: 'comment-004',
    postId: 'post-003',
    author: mockUsers[3], // Bob Brown
    content: 'The romance subplot was actually my favorite part, so sweet!',
    likes: 15,
    createdAt: '2026-06-27T18:22:00Z',
  },
  {
    id: 'comment-005',
    postId: 'post-004',
    author: mockUsers[4], // Clara Oswald
    content: 'Such an inspiring read, it really changed my perspective on daily habits.',
    likes: 19,
    createdAt: '2026-06-28T11:05:00Z',
  },
];
