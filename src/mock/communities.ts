import { Community } from '../types/community';

export const mockCommunities: Community[] = [
  {
    id: 'community-001',
    name: 'Fantasy Fellowship',
    description: 'A community for those who love to wander in worlds that never were. Discussions on epic magic systems, map design, and character archetypes.',
    coverUrl: 'https://covers.openlibrary.org/b/id/14925766-L.jpg', // Reuse Tolkien cover or other relevant image
    memberCount: 1450,
    genre: 'Fantasy',
    isJoined: true,
  },
  {
    id: 'community-002',
    name: 'Sci-Fi Explorers',
    description: 'Venturing into the far reaches of the galaxy, high technology, and speculative futures. Deep dives into space operas and hard sci-fi.',
    coverUrl: 'https://covers.openlibrary.org/b/id/10118337-L.jpg', // Reuse Dune cover
    memberCount: 920,
    genre: 'Sci-Fi',
    isJoined: false,
  },
  {
    id: 'community-003',
    name: 'Mystery Minders',
    description: 'Put on your detective hats. We discuss whodunits, noir thrillers, and psychological mysteries. Try to solve the case before the final chapter!',
    coverUrl: 'https://covers.openlibrary.org/b/id/8300803-L.jpg', // Reuse Mockingbird cover
    memberCount: 650,
    genre: 'Mystery',
    isJoined: false,
  },
  {
    id: 'community-004',
    name: 'Biography Buffs',
    description: 'Real people, real stories. A group dedicated to discovering the struggles, triumphs, and life lessons of historical and contemporary figures.',
    coverUrl: 'https://covers.openlibrary.org/b/id/8794825-L.jpg', // Reuse Educated cover
    memberCount: 430,
    genre: 'Biography',
    isJoined: true,
  },
];
