import { Book, QuizResult, ReaderPersona, RecommendationResult } from '../types';
import { mockBooks } from '../mock';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

// Clean markdown code blocks from a JSON response
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

interface AnthropicResponse {
  content?: {
    type?: string;
    text?: string;
  }[];
}

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key is not set.');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  
  if (
    data &&
    Array.isArray(data.content) &&
    data.content.length > 0 &&
    data.content[0] &&
    typeof data.content[0].text === 'string'
  ) {
    return data.content[0].text;
  }
  
  throw new Error('Unexpected Anthropic API response format');
}

/**
 * 1. Personalized recommendations
 * Discover screen
 * Quiz result + saved book IDs -> Ranked book IDs + reason per book
 */
export async function getRecommendations(
  quizResult: QuizResult,
  savedBookIds: string[]
): Promise<RecommendationResult[]> {
  try {
    // Select relevant fields from mockBooks to avoid sending huge payload
    const availableBooksForPrompt = mockBooks.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      genres: b.genres,
      description: b.description
    }));

    const prompt = `Respond only with a valid JSON array. No explanation, no markdown.
Shape: [ { "bookId": "string", "reason": "string" } ]

We have these available books in our catalog:
${JSON.stringify(availableBooksForPrompt, null, 2)}

The user has the following reading preferences from their onboarding quiz:
- Favorite Genres: ${JSON.stringify(quizResult.genres)}
- Desired Mood: ${quizResult.mood}
- Reading Personality: ${quizResult.personality}
- Favorite Tropes: ${JSON.stringify(quizResult.tropes)}
- Reading Habits: ${quizResult.readingHabit}

The user has already saved or read these book IDs (if possible, prioritize other books, but you can still include them if they are a perfect fit):
${JSON.stringify(savedBookIds)}

Select the top 3-5 books that best match the user's preferences. For each selected book, provide a personalized one-sentence reason explaining why it fits their quiz preferences and mood.
Make sure the "bookId" matches exactly one of the IDs in the catalog.`;

    const responseText = await callClaude(prompt);
    const cleanedText = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed)) {
      throw new Error('Recommendations response is not an array');
    }

    const validated: RecommendationResult[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item.bookId === 'string' &&
        typeof item.reason === 'string' &&
        mockBooks.some(b => b.id === item.bookId)
      ) {
        validated.push({
          bookId: item.bookId,
          reason: item.reason
        });
      }
    }

    if (validated.length === 0) {
      throw new Error('No valid recommendations returned from Claude');
    }

    return validated;
  } catch (error) {
    console.warn('getRecommendations failed, using fallback:', error);
    
    // Fallback logic: Filter out saved books if possible, and recommend up to 3 books
    const nonSavedBooks = mockBooks.filter(b => !savedBookIds.includes(b.id));
    const selectionList = nonSavedBooks.length >= 3 ? nonSavedBooks : mockBooks;
    
    // Choose books that have some overlap with quizResult.genres
    const recommended = selectionList
      .map(book => {
        const matchingGenres = book.genres.filter(g => quizResult.genres.includes(g));
        return { book, matchCount: matchingGenres.length };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3)
      .map(item => ({
        bookId: item.book.id,
        reason: `Based on your preference for ${quizResult.genres.join(', ') || 'good storytelling'}, we highly recommend this ${item.book.genres[0]} book.`
      }));

    return recommended;
  }
}

/**
 * 2. "Why this book" blurb
 * Swipe card
 * Reader persona + book metadata -> One-sentence personalized reason string
 */
export async function getWhyThisBook(
  userPersona: ReaderPersona,
  book: Book
): Promise<string> {
  try {
    const prompt = `Given the reader persona:
Name: ${userPersona.name}
Description: ${userPersona.description}

And the book:
Title: ${book.title}
Author: ${book.author}
Genres: ${book.genres.join(', ')}
Description: ${book.description}

Generate a single, compelling, personalized sentence (under 25 words) explaining why this book is a perfect fit for this specific reader persona.
Do not wrap in quotes or code fences. Respond with ONLY the sentence.`;

    const responseText = await callClaude(prompt);
    return responseText.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.warn('getWhyThisBook failed, using fallback:', error);
    return `Because you are a ${userPersona.name}, the compelling themes and storytelling in ${book.title} are sure to resonate with you.`;
  }
}

/**
 * 3. Reader persona generation
 * Profile screen
 * Quiz result -> Persona name + description
 */
export async function getReaderPersona(quizResult: QuizResult): Promise<ReaderPersona> {
  try {
    const prompt = `Respond only with a valid JSON object. No explanation, no markdown.
Shape: { "name": "string", "description": "string" }

Given these quiz answers:
- Favorite Genres: ${JSON.stringify(quizResult.genres)}
- Desired Mood: ${quizResult.mood}
- Reading Personality: ${quizResult.personality}
- Favorite Tropes: ${JSON.stringify(quizResult.tropes)}
- Reading Habits: ${quizResult.readingHabit}

Generate a creative, catchy reader persona name (e.g., "The Cozy Escapist", "The Midnight Explorer", "The Lore Architect") and a 2-3 sentence description characterizing this reader's tastes and behaviors.`;

    const responseText = await callClaude(prompt);
    const cleanedText = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleanedText);

    if (
      parsed &&
      typeof parsed.name === 'string' &&
      typeof parsed.description === 'string'
    ) {
      return {
        name: parsed.name,
        description: parsed.description
      };
    }

    throw new Error('Invalid ReaderPersona shape received from Claude');
  } catch (error) {
    console.warn('getReaderPersona failed, using fallback:', error);
    
    // Determine fallback based on favorite genres
    const genre = quizResult.genres[0] || 'Fiction';
    let name = 'The Curious Seeker';
    let description = 'You appreciate deep storytelling and enjoy exploring different genres and perspectives. You read to broaden your horizons and find connection.';

    if (genre === 'Fantasy') {
      name = 'The Realm Wanderer';
      description = 'You love getting lost in elaborate magical worlds and epic quests. High-stakes fantasy and deep lore keep you reading late into the night.';
    } else if (genre === 'Sci-Fi') {
      name = 'The Cosmic Dreamer';
      description = 'You are fascinated by technology, space travel, and the future. You enjoy stories that challenge your understanding of reality and explore what lies beyond.';
    } else if (genre === 'Romance') {
      name = 'The Romantic Optimist';
      description = 'You look for deep emotional connections, witty banter, and satisfying resolutions. Stories of love, growth, and relational dynamics are your absolute favorite.';
    } else if (genre === 'Mystery' || genre === 'Thriller') {
      name = 'The Shadow Detective';
      description = 'You love solving puzzles and keeping your heart racing. Twisty plots, dark secrets, and high suspense are what draw you into a book.';
    }

    return { name, description };
  }
}

/**
 * 4. Book quick take
 * Book detail screen
 * Book title + description + user persona -> 3-sentence summary in user's style
 */
export async function getBookQuickTake(
  bookTitle: string,
  bookDescription: string,
  userPersona: ReaderPersona
): Promise<string> {
  try {
    const prompt = `Given the book title: ${bookTitle}
Description: ${bookDescription}

And the user's reader persona:
Name: ${userPersona.name}
Description: ${userPersona.description}

Generate a exactly 3-sentence summary/review of this book. Write it in the tone and style of the user's reader persona (e.g. if they are cozy, make it warm; if they are analytical, make it intellectual; if they are dark thriller fans, make it suspenseful).
Do not wrap in quotes or code fences. Respond with ONLY the 3 sentences.`;

    const responseText = await callClaude(prompt);
    return responseText.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.warn('getBookQuickTake failed, using fallback:', error);
    // Generic 3-sentence summary fallback
    const sentences = bookDescription.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const firstTwo = sentences.slice(0, 2).join('. ') + '.';
    return `${bookTitle} is a captivating read. ${firstTwo} It is a highly recommended pick for any reader looking for an engaging story.`;
  }
}

/**
 * 5. Post starter suggestions
 * Circle FAB
 * Book title + community genre -> Array of 3 conversation starter strings
 */
export async function getPostStarters(
  bookTitle: string,
  communityGenre: string
): Promise<string[]> {
  try {
    const prompt = `Respond only with a valid JSON array of strings. No explanation, no markdown.
Shape: [ "question 1", "question 2", "question 3" ]

Given the book:
Title: ${bookTitle}
Community genre: ${communityGenre}

Generate exactly 3 engaging, open-ended discussion questions or post starters for a community group that is currently reading this book. The questions should focus on themes, character dynamics, or potential plot twists related to the genre.`;

    const responseText = await callClaude(prompt);
    const cleanedText = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleanedText);

    if (
      Array.isArray(parsed) &&
      parsed.length === 3 &&
      parsed.every(item => typeof item === 'string')
    ) {
      return parsed;
    }

    throw new Error('Invalid post starters format received from Claude');
  } catch (error) {
    console.warn('getPostStarters failed, using fallback:', error);
    return [
      `What are your initial thoughts on the main themes and writing style of ${bookTitle}?`,
      `How does ${bookTitle} compare to other classic works in the ${communityGenre} genre?`,
      `Which character's actions or decisions have surprised you the most so far in ${bookTitle}?`
    ];
  }
}
