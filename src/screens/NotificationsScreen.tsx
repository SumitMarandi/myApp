import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_like' | 'story_reply' | 'tag';
  user: {
    id: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  timestamp: Date;
  isRead: boolean;
  postImage?: string;
  message?: string;
  actionText?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      id: 'alex_photo',
      username: 'alex_photo',
      avatar: 'https://via.placeholder.com/50x50/FF5A5F/FFFFFF?text=A',
      isVerified: true,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isRead: false,
    postImage: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=Post',
    actionText: 'liked your photo.',
  },
  {
    id: '2',
    type: 'comment',
    user: {
      id: 'maria_design',
      username: 'maria.design',
      avatar: 'https://via.placeholder.com/50x50/42B883/FFFFFF?text=M',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isRead: false,
    postImage: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=Post',
    message: 'Amazing work! 🔥',
    actionText: 'commented:',
  },
  {
    id: '3',
    type: 'follow',
    user: {
      id: 'john_dev',
      username: 'john_dev',
      avatar: 'https://via.placeholder.com/50x50/F39C12/FFFFFF?text=J',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: true,
    actionText: 'started following you.',
  },
  {
    id: '4',
    type: 'story_like',
    user: {
      id: 'sarah_ui',
      username: 'sarah_ui',
      avatar: 'https://via.placeholder.com/50x50/E74C3C/FFFFFF?text=S',
      isVerified: true,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: true,
    actionText: 'liked your story.',
  },
  {
    id: '5',
    type: 'mention',
    user: {
      id: 'david_lee',
      username: 'david_lee',
      avatar: 'https://via.placeholder.com/50x50/9B59B6/FFFFFF?text=D',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    isRead: true,
    postImage: 'https://via.placeholder.com/50x50/42B883/FFFFFF?text=Post',
    actionText: 'mentioned you in a comment.',
  },
  {
    id: '6',
    type: 'tag',
    user: {
      id: 'lisa_photo',
      username: 'lisa_photo',
      avatar: 'https://via.placeholder.com/50x50/FF6B9D/FFFFFF?text=L',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    isRead: true,
    postImage: 'https://via.placeholder.com/50x50/FF6B9D/FFFFFF?text=Post',
    actionText: 'tagged you in a photo.',
  },
  {
    id: '7',
    type: 'story_reply',
    user: {
      id: 'mike_code',
      username: 'mike_code',
      avatar: 'https://via.placeholder.com/50x50/17A2B8/FFFFFF?text=M',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    isRead: true,
    message: 'Great content! 👍',
    actionText: 'replied to your story:',
  },
  {
    id: '8',
    type: 'like',
    user: {
      id: 'emma_art',
      username: 'emma_art',
      avatar: 'https://via.placeholder.com/50x50/6F42C1/FFFFFF?text=E',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true,
    postImage: 'https://via.placeholder.com/50x50/6F42C1/FFFFFF?text=Post',
    actionText: 'and 12 others liked your photo.',
  },
];

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onUserPress: (userId: string) => void;
  onFollowBack: (userId: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onUserPress,
  onFollowBack,
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
      case 'story_like':
        return { name: 'heart', color: theme.colors.accent };
      case 'comment':
      case 'story_reply':
        return { name: 'chatbubble', color: theme.colors.primary };
      case 'follow':
        return { name: 'person-add', color: theme.colors.success };
      case 'mention':
        return { name: 'at', color: theme.colors.warning };
      case 'tag':
        return { name: 'pricetag', color: theme.colors.primary };
      default:
        return { name: 'notifications', color: theme.colors.text.muted };
    }
  };

  const icon = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !notification.isRead && styles.unreadNotification]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.notificationContent}>
        <TouchableOpacity
          onPress={() => onUserPress(notification.user.id)}
          style={styles.avatarContainer}
        >
          <Image source={{ uri: notification.user.avatar }} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
            <Ionicons name={icon.name as any} size={12} color={theme.colors.text.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.textContent}>
          <Text style={styles.notificationText}>
            <TouchableOpacity onPress={() => onUserPress(notification.user.id)}>
              <Text style={styles.username}>
                {notification.user.username}
                {notification.user.isVerified && (
                  <Text> <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} /></Text>
                )}
              </Text>
            </TouchableOpacity>
            <Text style={styles.actionText}> {notification.actionText}</Text>
          </Text>

          {notification.message && (
            <Text style={styles.messageText}>"{notification.message}"</Text>
          )}

          <Text style={styles.timestamp}>{formatTimeAgo(notification.timestamp)}</Text>
        </View>

        <View style={styles.rightContent}>
          {notification.postImage ? (
            <Image source={{ uri: notification.postImage }} style={styles.postThumbnail} />
          ) : notification.type === 'follow' ? (
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => onFollowBack(notification.user.id)}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const NotificationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read when pressed
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'mention':
      case 'tag':
        // Navigate to post detail
        Alert.alert('Navigate', `Would navigate to post detail`);
        break;
      case 'follow':
        // Navigate to user profile
        Alert.alert('Navigate', `Would navigate to ${notification.user.username}'s profile`);
        break;
      case 'story_like':
      case 'story_reply':
        // Navigate to stories
        Alert.alert('Navigate', `Would navigate to stories`);
        break;
    }
  };

  const handleUserPress = (userId: string) => {
    Alert.alert('Navigate', `Would navigate to user profile: ${userId}`);
  };

  const handleFollowBack = (userId: string) => {
    Alert.alert('Follow', `Following back ${userId}`);
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
      onUserPress={handleUserPress}
      onFollowBack={handleFollowBack}
    />
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>myNotifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        style={styles.notificationsList}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    flex: 1,
  },
  markAllButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  markAllText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  unreadBanner: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  unreadBannerText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: theme.colors.surface,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  textContent: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  notificationText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  username: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  actionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.sm,
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  followButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  unreadDot: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginLeft: theme.spacing.md + 44 + theme.spacing.md, // Align with text
  },
});

export default NotificationsScreen;