import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { PostSkeleton, StorySkeleton } from '../components/SkeletonLoader';

interface Post {
  id: string;
  username: string;
  avatar: string;
  image?: string; // Made optional for text-only posts
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    username: 'alex_photo',
    avatar: 'https://picsum.photos/100/100?random=1',
    image: 'https://fastly.picsum.photos/id/444/400/400.jpg?hmac=f2rSUPeVxSw12QU0uWwrZTFUWNo9DXtOXXQoTFefoKU',
    caption: 'Amazing sunset today! 🌅 #photography #nature',
    likes: 124,
    comments: 23,
    timestamp: '2h',
    isLiked: false,
  },
  {
    id: '2',
    username: 'maria.design',
    avatar: 'https://picsum.photos/100/100?random=2',
    image: 'https://picsum.photos/400/400?random=2',
    caption: 'Working on some new UI concepts ✨ #design #ui #mobile',
    likes: 89,
    comments: 12,
    timestamp: '4h',
    isLiked: true,
  },
  {
    id: '3',
    username: 'john_dev',
    avatar: 'https://picsum.photos/100/100?random=3',
    image: 'https://picsum.photos/400/400?random=3',
    caption: 'New development setup complete! 💻 #coding #developer #productivity',
    likes: 67,
    comments: 8,
    timestamp: '6h',
    isLiked: false,
  },
  {
    id: '4',
    username: 'sarah_fitness',
    avatar: 'https://picsum.photos/100/100?random=4',
    image: 'https://picsum.photos/400/400?random=4',
    caption: 'Just crushed my 5K personal record! 🏃‍♀️💪 Sometimes you surprise yourself with what you can achieve. #running #fitness #PersonalRecord #motivation',
    likes: 156,
    comments: 34,
    timestamp: '8h',
    isLiked: true,
  },
  {
    id: '5',
    username: 'coffee_lover_mike',
    avatar: 'https://picsum.photos/100/100?random=5',
    image: 'https://picsum.photos/400/400?random=5',
    caption: 'Monday mood = need more coffee ☕️ Anyone else feeling like they need an IV drip of caffeine today? #MondayMood #Coffee #Relatable',
    likes: 298,
    comments: 67,
    timestamp: '12h',
    isLiked: false,
  },
  {
    id: '6',
    username: 'travel_with_emma',
    avatar: 'https://picsum.photos/100/100?random=6',
    image: 'https://picsum.photos/400/400?random=6',
    caption: 'Plot twist: Working remotely from Bali for the next month! 🏝️✈️ Sometimes the best office has a view of the ocean. Who says you can\'t mix business with paradise? #digitalnomad #workremote #bali #blessed',
    likes: 445,
    comments: 89,
    timestamp: '1d',
    isLiked: true,
  },
  {
    id: '7',
    username: 'tech_guru_sam',
    avatar: 'https://picsum.photos/100/100?random=7',
    image: 'https://picsum.photos/400/400?random=7',
    caption: 'Hot take: AI won\'t replace developers, but developers who use AI will replace those who don\'t 🤖💭 The future is about collaboration, not competition. #AI #programming #TechTalk #FutureOfWork',
    likes: 789,
    comments: 156,
    timestamp: '1d',
    isLiked: false,
  },
  {
    id: '8',
    username: 'foodie_jenny',
    avatar: 'https://picsum.photos/100/100?random=8',
    image: 'https://picsum.photos/400/400?random=8',
    caption: 'Spent 3 hours making homemade pizza from scratch 🍕👨‍🍳 Was it worth it? Absolutely. Will I order delivery next time? Also absolutely. #cooking #pizza #HomeCooking #reallife',
    likes: 234,
    comments: 45,
    timestamp: '2d',
    isLiked: true,
  },
  {
    id: '9',
    username: 'minimalist_joe',
    avatar: 'https://picsum.photos/100/100?random=9',
    image: 'https://picsum.photos/400/400?random=9',
    caption: 'Decluttered my entire apartment this weekend. Turns out I had 47 charging cables and only 3 devices 📱🔌 Marie Kondo would be proud... or concerned. #minimalism #declutter #organization',
    likes: 167,
    comments: 28,
    timestamp: '2d',
    isLiked: false,
  },
  {
    id: '10',
    username: 'bookworm_lisa',
    avatar: 'https://picsum.photos/100/100?random=10',
    image: 'https://picsum.photos/400/400?random=10',
    caption: 'Currently reading 5 books simultaneously because apparently I have commitment issues 📚😅 Anyone else a serial book starter? #reading #books #BookLover #relatable',
    likes: 312,
    comments: 78,
    timestamp: '3d',
    isLiked: true,
  },
  {
    id: '11',
    username: 'philosopher_mike',
    avatar: 'https://picsum.photos/100/100?random=11',
    caption: '🤔 Deep thought of the day: If you try to fail and succeed, which one did you do? Also, why do we call it "rush hour" when nobody\'s moving? These are the questions that keep me up at night. #philosophy #thoughts #showerthoughts #life',
    likes: 89,
    comments: 42,
    timestamp: '4h',
    isLiked: false,
  },
  {
    id: '12',
    username: 'motivational_sarah',
    avatar: 'https://picsum.photos/100/100?random=12',
    caption: '✨ Monday Motivation: You are exactly where you need to be. Every challenge is shaping you into who you\'re meant to become. Trust the process, embrace the journey, and remember - your current chapter is not your final story. 💪 #MondayMotivation #growth #mindset #inspiration #trusttheprocess',
    likes: 156,
    comments: 28,
    timestamp: '6h',
    isLiked: true,
  },
  {
    id: '13',
    username: 'random_thoughts_joe',
    avatar: 'https://picsum.photos/100/100?random=13',
    caption: 'Hot take: Cereal is soup. Pineapple belongs on pizza. Toilet paper goes OVER, not under. The dress was blue and black. And yes, I will die on all these hills. 🏔️ What\'s your weirdest opinion that you\'ll defend to the end? #hottakes #opinions #cerealisasoup',
    likes: 234,
    comments: 89,
    timestamp: '8h',
    isLiked: false,
  },
  {
    id: '14',
    username: 'grateful_grace',
    avatar: 'https://picsum.photos/100/100?random=14',
    caption: '🙏 Today I\'m grateful for: morning coffee that actually tastes good, the stranger who held the elevator, my dog who thinks I\'m the most important person in the universe, and the fact that it\'s finally Friday. What are you grateful for today? #gratitude #blessed #friday #smalljoys #thankful',
    likes: 167,
    comments: 45,
    timestamp: '12h',
    isLiked: true,
  },
  {
    id: '15',
    username: 'comedy_central_dan',
    avatar: 'https://picsum.photos/100/100?random=15',
    caption: '😂 Update: I tried to be an adult today. I went grocery shopping with a list, bought healthy food, and even remembered to bring my reusable bags. Then I got home and realized I forgot to buy the ONE thing I actually went there for. Adulting is hard, y\'all. #adulting #fail #groceryshopping #relatable #comedy',
    likes: 298,
    comments: 67,
    timestamp: '1d',
    isLiked: true,
  },
];

// Mock comments data
const MOCK_COMMENTS: { [postId: string]: Comment[] } = {
  '1': [
    {
      id: 'c1',
      username: 'sunset_lover',
      avatar: 'https://i.pravatar.cc/150?img=20',
      text: 'Absolutely gorgeous! 😍',
      timestamp: '1h ago',
      likes: 12,
    },
    {
      id: 'c2',
      username: 'beach_vibes',
      avatar: 'https://i.pravatar.cc/150?img=21',
      text: 'Where is this? I need to visit!',
      timestamp: '45m ago',
      likes: 8,
    },
  ],
  '2': [
    {
      id: 'c4',
      username: 'pasta_fan',
      avatar: 'https://i.pravatar.cc/150?img=23',
      text: 'This looks delicious! Recipe please? 🍝',
      timestamp: '3h ago',
      likes: 15,
    },
    {
      id: 'c5',
      username: 'italian_chef',
      avatar: 'https://i.pravatar.cc/150?img=24',
      text: 'Bellissimo! Authentic Italian style 👌',
      timestamp: '2h ago',
      likes: 9,
    },
  ],
  '3': [
    {
      id: 'c6',
      username: 'ai_researcher',
      avatar: 'https://i.pravatar.cc/150?img=25',
      text: 'Which book did you read? Always looking for good AI reads!',
      timestamp: '5h ago',
      likes: 18,
    },
  ],
};

const PostCard: React.FC<{ 
  post: Post; 
  onLikePress: (postId: string) => void;
  onCommentPress: (postId: string) => void;
}> = ({ post, onLikePress, onCommentPress }) => (
  <View style={styles.postCard}>
    {/* Header */}
    <View style={styles.postHeader}>
      <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
      <View style={styles.postHeaderText}>
        <Text style={styles.username}>{post.username}</Text>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.muted} />
      </TouchableOpacity>
    </View>

    {/* Image - Only render if image exists */}
    {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}

    {/* Actions for image posts only */}
    {post.image && (
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => onLikePress(post.id)} style={styles.actionButton}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.isLiked ? theme.colors.accent : theme.colors.text.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCommentPress(post.id)} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.spacer} />

        {/*
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
        */}

      </View>
    )}

    {/* Content for image posts */}
    {post.image && (
      <View style={styles.postContent}>
        <Text style={styles.likes}>{post.likes} likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.username} </Text>
          {post.caption}
        </Text>
        <TouchableOpacity onPress={() => onCommentPress(post.id)}>
          <Text style={styles.viewComments}>View all {post.comments} comments</Text>
        </TouchableOpacity>
      </View>
    )}

    {/* Content for text-only posts - different order */}
    {!post.image && (
      <View style={[styles.postContent, styles.textOnlyContent]}>
        <Text style={[styles.caption, styles.textOnlyCaption]}>
          <Text style={styles.captionUsername}>{post.username} </Text>
          {post.caption}
        </Text>

        {/* Actions for text-only posts - placed after likes */}
        <View style={[styles.postActions, styles.textOnlyActions]}>
          <TouchableOpacity onPress={() => onLikePress(post.id)} style={styles.actionButton}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={post.isLiked ? theme.colors.accent : theme.colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCommentPress(post.id)} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.spacer} />

          {/*
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          */}

        </View>
        <Text style={[styles.likes, styles.textOnlyLikes]}>{post.likes} likes</Text>
        <TouchableOpacity onPress={() => onCommentPress(post.id)}>
          <Text style={styles.viewComments}>View all {post.comments} comments</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const FeedScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleLikePress = useCallback((postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setIsCommentsModalVisible(true);
  }, []);

  const closeCommentsModal = useCallback(() => {
    setIsCommentsModalVisible(false);
    setSelectedPostId(null);
    setNewComment('');
    setIsPostingComment(false);
  }, []);

  const handleSendComment = useCallback(async () => {
    if (!newComment.trim() || !selectedPostId || isPostingComment) return;

    setIsPostingComment(true);

    try {
      const newCommentObj: Comment = {
        id: `c${Date.now()}`,
        username: 'current_user', // In a real app, this would be the logged-in user
        avatar: 'https://i.pravatar.cc/150?img=50',
        text: newComment.trim(),
        timestamp: 'now',
        likes: 0,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Add comment to the mock data
      if (!MOCK_COMMENTS[selectedPostId]) {
        MOCK_COMMENTS[selectedPostId] = [];
      }
      MOCK_COMMENTS[selectedPostId].unshift(newCommentObj);

      // Update post comment count
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === selectedPostId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );

      // Clear input
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsPostingComment(false);
    }
  }, [newComment, selectedPostId, isPostingComment]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => <PostCard post={item} onLikePress={handleLikePress} onCommentPress={handleCommentPress} />,
    [handleLikePress, handleCommentPress]
  );

  const ListFooterComponent = () => (
    isLoading ? (
      <View style={styles.loadingContainer}>
        <PostSkeleton />
        <PostSkeleton />
      </View>
    ) : null
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>myFeed</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        ListFooterComponent={ListFooterComponent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        style={styles.feed}
      />

      {/* Comments Modal */}
      <Modal
        visible={isCommentsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCommentsModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header with drag indicator */}
          <View style={styles.modalDragIndicator} />
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={closeCommentsModal}
              style={styles.modalCloseButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-down" size={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Comments</Text>
              <Text style={styles.modalSubtitle}>
                {selectedPostId ? (MOCK_COMMENTS[selectedPostId]?.length || 0) : 0} comments
              </Text>
            </View>
            <TouchableOpacity style={styles.modalOptionsButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {selectedPostId && (MOCK_COMMENTS[selectedPostId]?.length || 0) === 0 ? (
            <View style={styles.emptyCommentsContainer}>
              <Ionicons name="chatbubble-outline" size={48} color={theme.colors.text.secondary} />
              <Text style={styles.emptyCommentsText}>No comments yet</Text>
              <Text style={styles.emptyCommentsSubtext}>Be the first to share what you think!</Text>
            </View>
            ) : (
            <FlatList
              data={selectedPostId ? MOCK_COMMENTS[selectedPostId] || [] : []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <TouchableOpacity>
                    <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                  </TouchableOpacity>
                  <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUsername}>{item.username}</Text>
                        <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                      </View>
                      <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentActionButton}>
                        <Ionicons name="heart-outline" size={16} color={theme.colors.text.secondary} />
                        <Text style={styles.commentActionText}>{item.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionButton}>
                        <Text style={styles.commentActionText}>Reply</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentActionButton}>
                        <Ionicons name="ellipsis-horizontal" size={16} color={theme.colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              style={styles.commentsList}
              contentContainerStyle={styles.commentsContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
            />
          )}

          {/* Comment Input */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.commentInputContainer}
          >
            <View style={styles.commentInputRow}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=50' }} 
                style={styles.inputAvatar} 
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor={theme.colors.text.secondary}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  maxLength={500}
                  onSubmitEditing={handleSendComment}
                  blurOnSubmit={false}
                />
                {/*
                <View style={styles.inputActions}>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <Ionicons name="happy-outline" size={20} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <Ionicons name="camera-outline" size={20} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionButton}>
                    <Ionicons name="image-outline" size={20} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                */}
              </View>
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  (!newComment.trim() || isPostingComment) && styles.sendButtonDisabled
                ]}
                disabled={!newComment.trim() || isPostingComment}
                onPress={handleSendComment}
              >
                <Ionicons 
                  name={isPostingComment ? "hourglass" : "send"} 
                  size={18} 
                  color={(!newComment.trim() || isPostingComment) ? theme.colors.text.secondary : '#FFFFFF'} 
                />
              </TouchableOpacity>
            </View>
            {newComment.length > 400 && (
              <Text style={styles.characterCount}>
                {newComment.length}/500
              </Text>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    fontSize: 24,
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  username: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  postImage: {
    width: '100%',
    height: 350,
    backgroundColor: theme.colors.surface,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actionButton: {
    marginRight: theme.spacing.md,
  },
  spacer: {
    flex: 1,
  },
  postContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  likes: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  caption: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewComments: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  textOnlyContent: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  textOnlyCaption: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  textOnlyActions: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  textOnlyLikes: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalDragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  modalOptionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty state
  emptyCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyCommentsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  // Comments list
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingVertical: theme.spacing.sm,
  },
  commentSeparator: {
    height: theme.spacing.xs,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.xs / 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs / 2,
  },
  commentUsername: {
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
    fontSize: 13,
  },
  commentTimestamp: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  commentText: {
    color: theme.colors.text.primary,
    lineHeight: 18,
    fontSize: 14,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.xs,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.xs / 2,
  },
  commentActionText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginLeft: theme.spacing.xs / 2,
  },
  // Comment input
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingBottom: Platform.OS === 'ios' ? 0 : theme.spacing.sm,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  inputAvatar: {
    width: 35,
    height: 35,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  commentInput: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    color: theme.colors.text.primary,
    fontSize: 14,
    height: 35,
    paddingTop: theme.spacing.sm,
  },
  inputActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputActionButton: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 2,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: theme.colors.text.secondary,
  },
  characterCount: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
});

export default FeedScreen;