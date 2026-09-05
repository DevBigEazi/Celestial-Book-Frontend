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
  // Emotional Reactions — Circle Posts (Midnight Romantics, Ink & Oak, etc.)
  {
    id: 'comment-circle-001',
    postId: 'circle-post-001',
    author: mockUsers[1], // John Smith
    content: 'The ice garden chapter ruined all other romances for me forever. The sensory detail was breathtaking.',
    likes: 18,
    createdAt: '2026-07-02T21:00:00Z',
  },
  {
    id: 'comment-circle-002',
    postId: 'circle-post-001',
    author: mockUsers[3], // Bob Brown
    content: 'And when the clock strikes midnight and the bonfire glows... pure celestial atmosphere. Peak slow burn.',
    likes: 11,
    createdAt: '2026-07-02T22:15:00Z',
  },
  {
    id: 'comment-circle-003',
    postId: 'circle-post-002',
    author: mockUsers[0], // Jane Doe
    content: 'I had actual chills! The subtle foreshadowing with the scarves in earlier chapters was a masterstroke.',
    likes: 9,
    createdAt: '2026-07-03T16:05:00Z',
  },
  {
    id: 'comment-circle-004',
    postId: 'circle-post-003',
    author: mockUsers[4], // Clara Oswald
    content: 'I had to close the book and sit in silence for twenty minutes after Robin made that choice. Devastating.',
    likes: 24,
    createdAt: '2026-07-04T10:30:00Z',
  },
  {
    id: 'comment-circle-005',
    postId: 'circle-post-003',
    author: mockUsers[2], // Alice Johnson
    content: 'The linguistic silver-working system made the moral weight feel so physically real.',
    likes: 15,
    createdAt: '2026-07-04T11:45:00Z',
  },
  {
    id: 'comment-circle-006',
    postId: 'circle-post-004',
    author: mockUsers[1], // John Smith
    content: 'Parisa’s ruthlessness was terrifying, but honestly... from her perspective, could she have chosen anything else?',
    likes: 14,
    createdAt: '2026-07-05T08:12:00Z',
  },
  {
    id: 'comment-circle-007',
    postId: 'circle-post-005',
    author: mockUsers[0], // Jane Doe
    content: 'Lucy wanting to listen to phonograph records with Arthur is pure joy. My comfort read forever.',
    likes: 22,
    createdAt: '2026-07-05T19:30:00Z',
  },
  {
    id: 'comment-circle-008',
    postId: 'circle-post-006',
    author: mockUsers[2], // Alice Johnson
    content: '“I could recognize him by touch alone, by smell; I would know him blind...” Crying real tears at 2 AM.',
    likes: 31,
    createdAt: '2026-07-06T02:40:00Z',
  },
];
