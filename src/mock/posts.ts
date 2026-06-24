import { Post } from '../types/community';
import { mockUsers } from './users';

export const mockPosts: Post[] = [
  {
    id: 'post-001',
    communityId: 'community-001', // Fantasy Fellowship
    author: mockUsers[0], // Jane Doe
    bookId: 'book-001', // The Hobbit
    content: 'Just finished re-reading The Hobbit! J.R.R. Tolkien has this magical way of describing the Shire that always makes me feel at home. Bilbos journey is truly timeless. Who else loves the riddles in the dark scene?',
    likes: 34,
    commentCount: 2,
    createdAt: '2026-06-25T12:00:00Z',
    isLiked: true,
  },
  {
    id: 'post-002',
    communityId: 'community-002', // Sci-Fi Explorers
    author: mockUsers[1], // John Smith
    bookId: 'book-002', // Dune
    content: 'Dunes ecological themes are so fascinating. Frank Herbert managed to predict so many of our current conversations about resource scarcity and climate. Re-reading it before the next movie comes out!',
    likes: 45,
    commentCount: 1,
    createdAt: '2026-06-26T08:30:00Z',
    isLiked: false,
  },
  {
    id: 'post-003',
    communityId: 'community-001', // Fantasy Fellowship
    author: mockUsers[3], // Bob Brown
    bookId: 'book-010', // The Alchemist
    content: 'The concept of a "Personal Legend" in The Alchemist always resonates with me. It is a quick read, but the philosophical questions it raises stick with you for months.',
    likes: 28,
    commentCount: 1,
    createdAt: '2026-06-27T15:10:00Z',
    isLiked: false,
  },
  {
    id: 'post-004',
    communityId: 'community-004', // Biography Buffs
    author: mockUsers[2], // Alice Johnson
    bookId: 'book-008', // Educated
    content: 'Educated by Tara Westover is a masterpiece of resilience. The way she details her transition from a survivalist compound to Cambridge is breathtaking. Highly recommend if you want to understand the true power of learning.',
    likes: 52,
    commentCount: 1,
    createdAt: '2026-06-28T10:00:00Z',
    isLiked: true,
  },
  {
    id: 'post-005',
    communityId: 'community-002', // Sci-Fi Explorers
    author: mockUsers[0], // Jane Doe
    bookId: 'book-003', // 1984
    content: 'Reading 1984 in this day and age hits completely differently. The concept of doublethink is so relevant. Orwell was truly ahead of his time.',
    likes: 67,
    commentCount: 0,
    createdAt: '2026-06-28T19:30:00Z',
    isLiked: false,
  },
  {
    id: 'post-006',
    communityId: 'community-003', // Mystery Minders
    author: mockUsers[1], // John Smith
    bookId: 'book-006', // To Kill a Mockingbird
    content: 'Atticus Finch is probably one of the best-written characters in American literature. The courtroom scene is so tense and powerful, even when you know how it ends.',
    likes: 39,
    commentCount: 0,
    createdAt: '2026-06-29T07:15:00Z',
    isLiked: false,
  },
  {
    id: 'post-007',
    communityId: 'community-004', // Biography Buffs
    author: mockUsers[2], // Alice Johnson
    bookId: 'book-009', // Steve Jobs
    content: 'Walter Isaacsons biography of Steve Jobs is incredibly balanced. It doesn\'t shy away from Jobs\' difficult personality while highlighting his absolute genius in design and marketing.',
    likes: 23,
    commentCount: 0,
    createdAt: '2026-06-29T08:00:00Z',
    isLiked: false,
  },
  {
    id: 'post-008',
    communityId: 'community-001', // Fantasy Fellowship
    author: mockUsers[4], // Clara Oswald
    bookId: null,
    content: 'Hey Fellowship! What epic fantasy series should I start next? Just finished the main Tolkien books and need something with a similar scale and complex mythology. Any suggestions?',
    likes: 18,
    commentCount: 0,
    createdAt: '2026-06-29T08:15:00Z',
    isLiked: false,
  },
  {
    id: 'post-009',
    communityId: 'community-002', // Sci-Fi Explorers
    author: mockUsers[4], // Clara Oswald
    bookId: null,
    content: 'Looking for sci-fi books that explore genetic engineering or AI ethics. Prefer novels that focus more on character relationships and philosophical dilemmas than hard science.',
    likes: 12,
    commentCount: 0,
    createdAt: '2026-06-29T08:30:00Z',
    isLiked: false,
  },
  {
    id: 'post-010',
    communityId: 'community-003', // Mystery Minders
    author: mockUsers[3], // Bob Brown
    bookId: 'book-005', // Pride and Prejudice
    content: 'Ok, so Pride and Prejudice is not a mystery, but Darcy hiding his feelings and the misunderstandings feel like a romantic detective case where Elizabeth is trying to piece together the truth! Anyone else see it that way?',
    likes: 31,
    commentCount: 0,
    createdAt: '2026-06-29T08:45:00Z',
    isLiked: true,
  },
];
