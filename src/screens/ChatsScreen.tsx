import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ChatSkeleton } from '../components/SkeletonLoader';

interface Chat {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
  isTyping?: boolean;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    username: 'Alex Thompson',
    avatar: 'https://via.placeholder.com/50x50/FF5A5F/FFFFFF?text=A',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2m',
    isOnline: true,
    unreadCount: 2,
    isTyping: false,
  },
  {
    id: '2',
    username: 'Maria Garcia',
    avatar: 'https://via.placeholder.com/50x50/42B883/FFFFFF?text=M',
    lastMessage: 'Can you send me the design files?',
    timestamp: '15m',
    isOnline: true,
    unreadCount: 0,
    isTyping: true,
  },
  {
    id: '3',
    username: 'John Smith',
    avatar: 'https://via.placeholder.com/50x50/F39C12/FFFFFF?text=J',
    lastMessage: 'Thanks for the help!',
    timestamp: '1h',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: '4',
    username: 'Sarah Wilson',
    avatar: 'https://via.placeholder.com/50x50/E74C3C/FFFFFF?text=S',
    lastMessage: 'See you tomorrow 👋',
    timestamp: '3h',
    isOnline: false,
    unreadCount: 1,
  },
  {
    id: '5',
    username: 'David Lee',
    avatar: 'https://via.placeholder.com/50x50/9B59B6/FFFFFF?text=D',
    lastMessage: 'Great work on the project!',
    timestamp: '1d',
    isOnline: true,
    unreadCount: 0,
  },
];

const ChatItem: React.FC<{ chat: Chat; onPress: () => void }> = ({ chat, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <Image source={{ uri: chat.avatar }} style={styles.avatar} />
      {chat.isOnline && <View style={styles.onlineIndicator} />}
    </View>
    
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.username} numberOfLines={1}>
          {chat.username}
        </Text>
        <Text style={styles.timestamp}>{chat.timestamp}</Text>
      </View>
      
      <View style={styles.messageRow}>
        <Text style={[styles.lastMessage, chat.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
          {chat.isTyping ? (
            <Text style={styles.typingText}>typing...</Text>
          ) : (
            chat.lastMessage
          )}
        </Text>
        {chat.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="videocam-outline" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const ChatsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chatId: string) => {
    // Navigate to individual chat screen
    if (navigation) {
      navigation.navigate('Conversation', { chatId });
    }
  };

  const renderChat = ({ item }: { item: Chat }) => (
    <ChatItem chat={item} onPress={() => handleChatPress(item.id)} />
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.muted} />
      <Text style={styles.emptyText}>No chats yet</Text>
      <Text style={styles.emptySubtext}>Start a conversation with your friends</Text>
    </View>
  );

  const ListFooterComponent = () => (
    isLoading ? (
      <View>
        <ChatSkeleton />
        <ChatSkeleton />
        <ChatSkeleton />
      </View>
    ) : null
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>myChats</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.muted}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderChat}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        style={styles.chatList}
      />

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color={theme.colors.text.white} />
      </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: theme.colors.success,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  chatContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    flex: 1,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  typingText: {
    fontStyle: 'italic',
    color: theme.colors.primary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  unreadCount: {
    ...theme.typography.caption,
    color: theme.colors.text.white,
    fontWeight: '600',
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});

export default ChatsScreen;