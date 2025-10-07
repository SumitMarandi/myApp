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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { PostSkeleton, StorySkeleton } from '../components/SkeletonLoader';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnreadStory: boolean;
}

interface Post {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

const MOCK_STORIES: Story[] = [
  { id: '1', username: 'Your Story', avatar: 'https://via.placeholder.com/70x70/007AFF/FFFFFF?text=+', hasUnreadStory: false },
  { id: '2', username: 'alex_photo', avatar: 'https://via.placeholder.com/70x70/FF5A5F/FFFFFF?text=A', hasUnreadStory: true },
  { id: '3', username: 'maria.design', avatar: 'https://via.placeholder.com/70x70/42B883/FFFFFF?text=M', hasUnreadStory: true },
  { id: '4', username: 'john_dev', avatar: 'https://via.placeholder.com/70x70/F39C12/FFFFFF?text=J', hasUnreadStory: false },
  { id: '5', username: 'sarah_ui', avatar: 'https://via.placeholder.com/70x70/E74C3C/FFFFFF?text=S', hasUnreadStory: true },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    username: 'alex_photo',
    avatar: 'https://via.placeholder.com/40x40/FF5A5F/FFFFFF?text=A',
    image: 'https://via.placeholder.com/350x350/007AFF/FFFFFF?text=Beautiful+Sunset',
    caption: 'Amazing sunset today! 🌅 #photography #nature',
    likes: 124,
    comments: 23,
    timestamp: '2h',
    isLiked: false,
  },
  {
    id: '2',
    username: 'maria.design',
    avatar: 'https://via.placeholder.com/40x40/42B883/FFFFFF?text=M',
    image: 'https://via.placeholder.com/350x350/42B883/FFFFFF?text=UI+Design+Work',
    caption: 'Working on some new UI concepts ✨ #design #ui #mobile',
    likes: 89,
    comments: 12,
    timestamp: '4h',
    isLiked: true,
  },
  {
    id: '3',
    username: 'john_dev',
    avatar: 'https://via.placeholder.com/40x40/F39C12/FFFFFF?text=J',
    image: 'https://via.placeholder.com/350x350/F39C12/FFFFFF?text=Code+Setup',
    caption: 'New development setup complete! 💻 #coding #developer #productivity',
    likes: 67,
    comments: 8,
    timestamp: '6h',
    isLiked: false,
  },
];

const StoryItem: React.FC<{ story: Story }> = ({ story }) => (
  <TouchableOpacity style={styles.storyContainer}>
    <View style={[styles.storyImageContainer, story.hasUnreadStory && styles.unreadStory]}>
      <Image source={{ uri: story.avatar }} style={styles.storyImage} />
    </View>
    <Text style={styles.storyUsername} numberOfLines={1}>
      {story.username}
    </Text>
  </TouchableOpacity>
);

const PostCard: React.FC<{ post: Post; onLikePress: (postId: string) => void }> = ({ post, onLikePress }) => (
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

    {/* Image */}
    <Image source={{ uri: post.image }} style={styles.postImage} />

    {/* Actions */}
    <View style={styles.postActions}>
      <TouchableOpacity onPress={() => onLikePress(post.id)} style={styles.actionButton}>
        <Ionicons
          name={post.isLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={post.isLiked ? theme.colors.accent : theme.colors.text.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="chatbubble-outline" size={22} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="paper-plane-outline" size={22} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity>
        <Ionicons name="bookmark-outline" size={22} color={theme.colors.text.primary} />
      </TouchableOpacity>
    </View>

    {/* Likes and Caption */}
    <View style={styles.postContent}>
      <Text style={styles.likes}>{post.likes} likes</Text>
      <Text style={styles.caption}>
        <Text style={styles.captionUsername}>{post.username} </Text>
        {post.caption}
      </Text>
      <TouchableOpacity>
        <Text style={styles.viewComments}>View all {post.comments} comments</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FeedScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    ({ item }: { item: Post }) => <PostCard post={item} onLikePress={handleLikePress} />,
    [handleLikePress]
  );

  const ListHeaderComponent = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
      {MOCK_STORIES.map(story => (
        <StoryItem key={story.id} story={story} />
      ))}
    </ScrollView>
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
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} onPress={() => navigation.navigate('Notifications')} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        style={styles.feed}
      />
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
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  storiesContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 70,
  },
  storyImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 2,
  },
  unreadStory: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  storyUsername: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
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
});

export default FeedScreen;