import { CirclePost } from "../types/comment";
import { Post } from "../types/community";
import { mockUsers } from "./users";

export const mockPosts: Post[] = [
  {
    id: "post-001",
    communityId: "community-001",
    author: mockUsers[0],
    bookId: "book-001",
    content:
      "The sheer atmospheric wonder of the Night Circus took my breath away. Marco and Celia communicating solely through magical tents... the yearning is unbearable!",
    likes: 84,
    commentCount: 12,
    createdAt: "2026-06-25T12:00:00Z",
    isLiked: true,
  },
  {
    id: "post-002",
    communityId: "community-002",
    author: mockUsers[1],
    bookId: "book-002",
    content:
      'Piranesi is the kind of book that rewrites the quiet corners of your mind. "The Beauty of the House is immeasurable; its Kindness infinite." Still crying over the tides.',
    likes: 67,
    commentCount: 8,
    createdAt: "2026-06-26T08:30:00Z",
    isLiked: false,
  },
  {
    id: "post-003",
    communityId: "community-001",
    author: mockUsers[3],
    bookId: "book-003",
    content:
      "Babel broke me in ways I was not prepared for. The silver-working metaphors for translation and exploitation are chillingly brilliant. Chapter 24 ruined my sleep.",
    likes: 92,
    commentCount: 15,
    createdAt: "2026-06-27T15:10:00Z",
    isLiked: true,
  },
  {
    id: "post-004",
    communityId: "community-004",
    author: mockUsers[2],
    bookId: "book-006",
    content:
      "The Secret History rereads get darker every autumn. Julian Morrow’s influence on the Greek students is pure charismatic manipulation. Who was your favorite moral disaster?",
    likes: 58,
    commentCount: 7,
    createdAt: "2026-06-28T10:00:00Z",
    isLiked: true,
  },
];

export const mockCirclePosts: CirclePost[] = [
  {
    id: "circle-post-001",
    clubId: "club-001", // Midnight Romantics
    author: mockUsers[0], // Jane
    emotion: "yearning",
    topicTag: "Favorite Quotes",
    bookTitle: "The Night Circus",
    chapterOrPageRef: "Chapter: The Wishing Tree",
    content:
      "The moment Celia walks through the candlelit ice garden and realizes Marco built every frozen blossom for her... I could not breathe. That is the peak of slow burn.",
    likes: 42,
    commentCount: 9,
    createdAt: "2026-07-02T20:15:00Z",
    isLiked: true,
  },
  {
    id: "circle-post-002",
    clubId: "club-001", // Midnight Romantics
    author: mockUsers[2], // Alice
    emotion: "surprised",
    topicTag: "Plot Twists",
    bookTitle: "The Night Circus",
    chapterOrPageRef: "Part IV: Turning Points",
    content:
      "Did anyone else suspect Hector’s true intentions before Bailey stumbled into the tent of clocks? The foreshadowing with the black and white scarves was immaculate.",
    likes: 29,
    commentCount: 6,
    createdAt: "2026-07-03T14:40:00Z",
    isLiked: false,
  },
  {
    id: "circle-post-003",
    clubId: "club-002", // Ink & Oak
    author: mockUsers[1], // John
    emotion: "invested",
    topicTag: "Character Motives",
    bookTitle: "Babel",
    chapterOrPageRef: "Act III: The Tower",
    content:
      "Robin Swift’s character arc is a masterclass in moral gravity. Watching him choose his principles over comfort, knowing the catastrophic cost, left me shattered.",
    likes: 64,
    commentCount: 14,
    createdAt: "2026-07-04T09:10:00Z",
    isLiked: true,
  },
  {
    id: "circle-post-004",
    clubId: "club-002", // Ink & Oak
    author: mockUsers[3], // Bob
    emotion: "angry",
    topicTag: "Theories",
    bookTitle: "Babel",
    chapterOrPageRef: "Chapter 28",
    content:
      "Professor Lovell might be one of the most despicably cold parental figures in recent literature. The betrayal felt like a physical blow.",
    likes: 51,
    commentCount: 11,
    createdAt: "2026-07-04T18:25:00Z",
    isLiked: false,
  },
  {
    id: "circle-post-005",
    clubId: "club-003", // Gothic Tides
    author: mockUsers[4], // Clara
    emotion: "happy",
    topicTag: "Character Motives",
    bookTitle: "Piranesi",
    chapterOrPageRef: "Halls of the North",
    content:
      "Piranesi taking tender care of the albatross and collecting dried seaweed for the birds fills me with such quiet peace. The purest soul in modern fiction.",
    likes: 38,
    commentCount: 5,
    createdAt: "2026-07-05T11:00:00Z",
    isLiked: true,
  },
  {
    id: "circle-post-006",
    clubId: "club-003", // Gothic Tides
    author: mockUsers[0], // Jane
    emotion: "sad",
    topicTag: "Theories",
    bookTitle: "Piranesi",
    chapterOrPageRef: "The Sixteenth Person",
    content:
      "The journals slowly revealing his past identity while he tries so desperately to protect his beloved House... my heart ached so deeply.",
    likes: 47,
    commentCount: 8,
    createdAt: "2026-07-05T22:30:00Z",
    isLiked: false,
  },
  {
    id: "circle-post-007",
    clubId: "club-004", // Starless Sanctuary
    author: mockUsers[1], // John
    emotion: "invested",
    topicTag: "World-building",
    bookTitle: "The Starless Sea",
    chapterOrPageRef: "The Sweet Sorrows",
    content:
      "The sheer romance of finding a story written about yourself in an unmarked library book decades before you were born. Completely spellbound.",
    likes: 56,
    commentCount: 12,
    createdAt: "2026-07-06T14:15:00Z",
    isLiked: true,
  },
  {
    id: "circle-post-008",
    clubId: "club-004", // Starless Sanctuary
    author: mockUsers[3], // Bob
    emotion: "yearning",
    topicTag: "Favorite Quotes",
    bookTitle: "The Starless Sea",
    chapterOrPageRef: "The Harbor of Primordial Stories",
    content:
      "Dorian and Zachary drinking smoky tea while keys turn in doors that only lead inward. Morgenstern writes atmosphere like a composer.",
    likes: 39,
    commentCount: 7,
    createdAt: "2026-07-06T20:45:00Z",
    isLiked: false,
  },
];
