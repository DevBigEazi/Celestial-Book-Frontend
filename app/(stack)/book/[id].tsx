import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Linking, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/hooks/useAuth';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Avatar } from '../../../src/components/ui/Avatar';
import { mockBooks } from '../../../src/mock/books';
import { mockUsers } from '../../../src/mock/users';
import { getBookQuickTake } from '../../../src/services/ai';
import { ReaderPersona } from '../../../src/types';
import { Spacing, Radius, Shadow } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

type DetailTab = 'description' | 'reviews' | 'readers';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export default function BookDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { library, toggleLibraryBook } = useAuth();

  const book = mockBooks.find((b) => b.id === id);

  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const [quickTake, setQuickTake] = useState<string | null>(null);
  const [quickTakeLoading, setQuickTakeLoading] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      userName: 'John Smith',
      userAvatar: 'https://i.pravatar.cc/150?u=johnsmith',
      rating: 5,
      comment: 'An absolute masterpiece. It shaped how I view the genre. Highly recommended!',
      date: '2026-06-15'
    },
    {
      id: 'rev-2',
      userName: 'Alice Johnson',
      userAvatar: 'https://i.pravatar.cc/150?u=alicej',
      rating: 4,
      comment: 'Superb writing and incredible depth. A bit slow at parts, but the payoff is worth it.',
      date: '2026-06-20'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (!book) return;

    async function loadQuickTake() {
      setQuickTakeLoading(true);
      try {
        const cacheKey = `@cb/quicktake_${book!.id}`;
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          setQuickTake(cached);
        } else {
          // Fetch reader persona from cache
          const personaStr = await AsyncStorage.getItem('@cb/reader_persona');
          let persona: ReaderPersona = { name: 'The Cozy Reader', description: 'Enjoys comfortable, warm stories.' };
          if (personaStr) {
            persona = JSON.parse(personaStr);
          }
          
          const result = await getBookQuickTake(book!.title, book!.description, persona);
          await AsyncStorage.setItem(cacheKey, result);
          setQuickTake(result);
        }
      } catch (e) {
        console.error('Failed to load Quick Take:', e);
      } finally {
        setQuickTakeLoading(false);
      }
    }
    loadQuickTake();
  }, [book]);

  if (!book) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>Book not found</Typography>
        <Button variant="primary" label="Go Back" onPress={() => router.back()} style={styles.backBtn} />
      </ScreenWrapper>
    );
  }

  const handleBuyBook = () => {
    if (book.purchaseUrl) {
      Linking.openURL(book.purchaseUrl);
    }
  };

  const handleLibraryToggle = async () => {
    await toggleLibraryBook(book.id);
  };

  const handleAddReview = () => {
    if (!newComment.trim()) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: 'Jane Doe',
      userAvatar: 'https://i.pravatar.cc/150?u=janedoe',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);
    setNewComment('');
  };

  const isInLibrary = library.includes(book.id);

  return (
    <View style={styles.outerContainer}>
      <ScreenWrapper scrollEnabled={true} style={styles.container}>
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backIcon}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
              {book.title}
            </Typography>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
              {book.coverUrl ? (
                <Image source={{ uri: book.coverUrl }} style={styles.coverImage} contentFit="contain" transition={200} />
              ) : (
                <Typography variant="display">📖</Typography>
              )}
            </View>
            <Typography variant="title" color={colors.textPrimary} align="center" style={styles.title}>
              {book.title}
            </Typography>
            <Typography variant="subtitle" color={colors.textSecondary} align="center">
              {book.author}
            </Typography>

            <View style={styles.genresList}>
              {book.genres.map((genre) => (
                <Badge key={genre} label={genre} variant="secondary" />
              ))}
            </View>

            {/* Stats Bar */}
            <View style={[styles.statsRow, { borderColor: colors.border }]}>
              <View style={styles.stat}>
                <Typography variant="label" color={colors.textPrimary}>★ {book.rating}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>Rating</Typography>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.stat}>
                <Typography variant="label" color={colors.textPrimary}>{book.pageCount}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>Pages</Typography>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
              <View style={styles.stat}>
                <Typography variant="label" color={colors.textPrimary}>{book.publishedYear}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>Year</Typography>
              </View>
            </View>
          </View>

          {/* AI Quick Take Widget */}
          <View style={styles.section}>
            <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
              ✨ AI Quick Take
            </Typography>
            {quickTakeLoading ? (
              <Card style={styles.quickTakeCard} variant="outlined">
                <ActivityIndicator size="small" color={colors.accent} style={styles.spinner} />
                <Typography variant="caption" color={colors.textSecondary} align="center">
                  Generating quick takeaways from Claude...
                </Typography>
              </Card>
            ) : quickTake ? (
              <Card style={[styles.quickTakeCard, { borderColor: colors.accent, borderWidth: 1 }]} variant="elevated">
                <Typography variant="body" color={colors.textPrimary} style={styles.quickTakeSummary}>
                  {quickTake}
                </Typography>
              </Card>
            ) : (
              <Card style={styles.quickTakeCard} variant="outlined">
                <Typography variant="caption" color={colors.textMuted} align="center">
                  AI Quick Take is unavailable.
                </Typography>
              </Card>
            )}
          </View>

          {/* Tabs Controller */}
          <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
            {(['description', 'reviews', 'readers'] as DetailTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabItem,
                    isActive && { borderBottomColor: colors.accent, borderBottomWidth: 2 }
                  ]}
                >
                  <Typography
                    variant="label"
                    color={isActive ? colors.textAccent : colors.textSecondary}
                    style={styles.tabLabel}
                  >
                    {label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>

          {/* Tab Contents */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'description' && (
              <Typography variant="body" color={colors.textPrimary} style={styles.description}>
                {book.description}
              </Typography>
            )}

            {activeTab === 'reviews' && (
              <View>
                {/* Form to submit review */}
                <Card style={styles.reviewFormCard} variant="outlined">
                  <Typography variant="label" color={colors.textPrimary} style={styles.reviewFormTitle}>
                    Add Your Review
                  </Typography>
                  
                  {/* Star selectors */}
                  <View style={styles.starSelectRow}>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <Pressable key={stars} onPress={() => setNewRating(stars)} style={styles.starBtn}>
                        <Ionicons
                          name={stars <= newRating ? 'star' : 'star-outline'}
                          size={20}
                          color={colors.warning}
                        />
                      </Pressable>
                    ))}
                  </View>

                  <TextInput
                    placeholder="What did you think of this book?"
                    placeholderTextColor={colors.textMuted}
                    value={newComment}
                    onChangeText={setNewComment}
                    style={[styles.reviewInput, { color: colors.textPrimary, borderColor: colors.border }]}
                    multiline
                    numberOfLines={2}
                  />
                  
                  <Button
                    variant="primary"
                    size="sm"
                    label="Submit Review"
                    onPress={handleAddReview}
                    disabled={!newComment.trim()}
                  />
                </Card>

                {/* Reviews List */}
                {reviews.map((rev) => (
                  <Card key={rev.id} style={styles.reviewCard} variant="outlined">
                    <View style={styles.reviewHeader}>
                      <Avatar url={rev.userAvatar} name={rev.userName} size="sm" />
                      <View style={styles.reviewAuthor}>
                        <Typography variant="label" color={colors.textPrimary}>
                          {rev.userName}
                        </Typography>
                        <Typography variant="caption" color={colors.textMuted}>
                          {rev.date}
                        </Typography>
                      </View>
                      <View style={styles.reviewStars}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Ionicons key={i} name="star" size={14} color={colors.warning} />
                        ))}
                      </View>
                    </View>
                    <Typography variant="body" color={colors.textPrimary} style={styles.reviewComment}>
                      {rev.comment}
                    </Typography>
                  </Card>
                ))}
              </View>
            )}

            {activeTab === 'readers' && (
              <View style={styles.readersList}>
                <Typography variant="caption" color={colors.textSecondary} style={styles.readersHeading}>
                  Other members currently reading this book:
                </Typography>
                {mockUsers.slice(1, 4).map((reader) => (
                  <View key={reader.id} style={[styles.readerRow, { borderBottomColor: colors.border }]}>
                    <Avatar url={reader.avatarUrl} name={reader.name} size="sm" />
                    <View style={styles.readerDetails}>
                      <Typography variant="body" color={colors.textPrimary} style={styles.readerName}>
                        {reader.name}
                      </Typography>
                      <Typography variant="caption" color={colors.textSecondary}>
                        {reader.bio}
                      </Typography>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScreenWrapper>

      {/* Sticky Buy/Save bottom bar */}
      <View style={[styles.stickyFooter, { backgroundColor: colors.bgPrimary, borderTopColor: colors.border }]}>
        <Button
          variant={isInLibrary ? 'outline' : 'primary'}
          label={isInLibrary ? 'Remove Library' : 'Add to Library'}
          onPress={handleLibraryToggle}
          style={styles.footerBtn}
        />
        <Button
          variant="secondary"
          label="Buy Book"
          onPress={handleBuyBook}
          style={styles.footerBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['4'],
    paddingBottom: 120, // Allow scrolling above the sticky footer
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  backBtn: {
    marginTop: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['5'],
  },
  backIcon: {
    marginRight: Spacing['3'],
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  coverContainer: {
    width: 140,
    height: 200,
    borderRadius: Radius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['5'],
    ...Shadow.md,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Spacing['1'],
  },
  genresList: {
    flexDirection: 'row',
    gap: Spacing['2'],
    marginVertical: Spacing['3'],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: Spacing['4'],
    paddingVertical: Spacing['3'],
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  stat: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  section: {
    marginBottom: Spacing['6'],
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing['3'],
  },
  quickTakeCard: {
    padding: Spacing['4'],
    borderRadius: Radius.md,
  },
  quickTakeSummary: {
    lineHeight: 20,
    marginBottom: Spacing['3'],
  },
  spinner: {
    marginBottom: Spacing['2'],
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: Spacing['4'],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing['3'],
  },
  tabLabel: {
    fontWeight: 'bold',
  },
  tabContentContainer: {
    minHeight: 150,
  },
  description: {
    lineHeight: 22,
  },
  // Reviews Styles
  reviewFormCard: {
    padding: Spacing['4'],
    marginBottom: Spacing['5'],
  },
  reviewFormTitle: {
    fontWeight: '600',
    marginBottom: Spacing['2'],
  },
  starSelectRow: {
    flexDirection: 'row',
    gap: Spacing['1'],
    marginBottom: Spacing['3'],
  },
  starBtn: {
    padding: Spacing['1'],
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    fontSize: 14,
    height: 70,
    textAlignVertical: 'top',
    marginBottom: Spacing['4'],
  },
  reviewCard: {
    padding: Spacing['4'],
    marginBottom: Spacing['3'],
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2'],
  },
  reviewAuthor: {
    marginLeft: Spacing['3'],
    flex: 1,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewComment: {
    lineHeight: 18,
  },
  // Readers Styles
  readersHeading: {
    marginBottom: Spacing['4'],
  },
  readersList: {
    gap: Spacing['1'],
  },
  readerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing['3'],
    borderBottomWidth: 1,
  },
  readerDetails: {
    marginLeft: Spacing['3'],
    flex: 1,
  },
  readerName: {
    fontWeight: '600',
  },
  // Sticky bottom footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing['4'],
    padding: Spacing['5'],
    borderTopWidth: 1,
    ...Shadow.lg,
  },
  footerBtn: {
    flex: 1,
  },
});
