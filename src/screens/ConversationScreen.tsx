import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'text' | 'image' | 'voice' | 'video';
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  duration?: number; // for voice messages
}

interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
}

const MOCK_USER: ChatUser = {
  id: '2',
  username: 'Alex Thompson',
  avatar: 'https://via.placeholder.com/50x50/FF5A5F/FFFFFF?text=A',
  isOnline: true,
  isTyping: false,
};

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isOwn: false,
    type: 'text',
    status: 'read',
  },
  {
    id: '2',
    text: "I'm doing great! Just finished working on a new React Native project. What about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    isOwn: true,
    type: 'text',
    status: 'read',
  },
  {
    id: '3',
    text: "That sounds awesome! I'd love to see what you're building. Is it a social app?",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    isOwn: false,
    type: 'text',
    status: 'read',
  },
  {
    id: '4',
    text: 'Yes exactly! It\'s an Instagram-like social media app with stories, posts, and chat features like this one 😄',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isOwn: true,
    type: 'text',
    status: 'read',
  },
  {
    id: '5',
    text: 'https://via.placeholder.com/250x200/007AFF/FFFFFF?text=App+Screenshot',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    isOwn: true,
    type: 'image',
    status: 'read',
    mediaUrl: 'https://via.placeholder.com/250x200/007AFF/FFFFFF?text=App+Screenshot',
  },
  {
    id: '6',
    text: 'Wow! The UI looks really clean and modern. Great work! 👏',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isOwn: false,
    type: 'text',
    status: 'read',
  },
  {
    id: '7',
    text: 'Thanks! I\'m really happy with how it turned out. The design is inspired by Instagram but with some unique touches.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    isOwn: true,
    type: 'text',
    status: 'delivered',
  },
];

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAvatar }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <TouchableOpacity style={styles.imageMessage}>
            <Image source={{ uri: message.mediaUrl }} style={styles.messageImage} />
            <Text style={[styles.messageText, message.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
              {message.text}
            </Text>
          </TouchableOpacity>
        );
      case 'voice':
        return (
          <View style={styles.voiceMessage}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={16} color={message.isOwn ? theme.colors.text.white : theme.colors.primary} />
            </TouchableOpacity>
            <View style={styles.voiceWave} />
            <Text style={[styles.voiceDuration, message.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
              {message.duration}s
            </Text>
          </View>
        );
      default:
        return (
          <Text style={[styles.messageText, message.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {message.text}
          </Text>
        );
    }
  };

  return (
    <View style={[styles.messageContainer, message.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer]}>
      {!message.isOwn && showAvatar && (
        <Image source={{ uri: MOCK_USER.avatar }} style={styles.messageAvatar} />
      )}
      {!message.isOwn && !showAvatar && <View style={styles.avatarPlaceholder} />}
      
      <View style={styles.messageContent}>
        <View style={[styles.messageBubble, message.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble]}>
          {renderMessageContent()}
        </View>
        
        <View style={[styles.messageInfo, message.isOwn ? styles.ownMessageInfo : styles.otherMessageInfo]}>
          <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          {message.isOwn && (
            <Ionicons
              name={
                message.status === 'read' 
                  ? 'checkmark-done' 
                  : message.status === 'delivered' 
                    ? 'checkmark-done-outline' 
                    : 'checkmark-outline'
              }
              size={12}
              color={message.status === 'read' ? theme.colors.primary : theme.colors.text.muted}
              style={styles.messageStatus}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]);

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Image source={{ uri: MOCK_USER.avatar }} style={styles.messageAvatar} />
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>
          <Animated.Text style={[styles.typingDot, { opacity: dot1 }]}>●</Animated.Text>
          <Text> </Text>
          <Animated.Text style={[styles.typingDot, { opacity: dot2 }]}>●</Animated.Text>
          <Text> </Text>
          <Animated.Text style={[styles.typingDot, { opacity: dot3 }]}>●</Animated.Text>
        </Text>
      </View>
    </View>
  );
};

const ConversationScreen: React.FC<{ route?: any; navigation?: any }> = ({ route, navigation }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Simulate other user typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        // Add a new message from the other user
        const newMessage: Message = {
          id: Date.now().toString(),
          text: "I'd love to collaborate on a project like this sometime!",
          timestamp: new Date(),
          isOwn: false,
          type: 'text',
          status: 'sent',
        };
        setMessages(prev => [...prev, newMessage]);
      }, 3000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date(),
        isOwn: true,
        type: 'text',
        status: 'sent',
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 3000);
    }
  };

  const sendVoiceMessage = () => {
    Alert.alert('Voice Message', 'Voice recording feature would be implemented here');
  };

  const sendImageMessage = () => {
    Alert.alert('Send Image', 'Image picker would be implemented here');
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !previousMessage || previousMessage.isOwn !== item.isOwn;
    
    return <MessageBubble message={item} showAvatar={showAvatar} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.headerAvatarContainer}>
            <Image source={{ uri: MOCK_USER.avatar }} style={styles.headerAvatar} />
            {MOCK_USER.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerUsername}>{MOCK_USER.username}</Text>
            <Text style={styles.headerStatus}>
              {showTyping ? 'typing...' : MOCK_USER.isOnline ? 'online' : 'last seen recently'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam-outline" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={showTyping ? <TypingIndicator /> : null}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={sendImageMessage} style={styles.inputButton}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.text.muted} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity onPress={sendImageMessage} style={styles.attachButton}>
              <Ionicons name="attach-outline" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>
          
          {inputText.trim() ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color={theme.colors.text.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={sendVoiceMessage} style={styles.voiceButton}>
              <Ionicons name="mic-outline" size={24} color={theme.colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: theme.colors.success,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  headerText: {
    flex: 1,
  },
  headerUsername: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  headerStatus: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: theme.spacing.xs,
  },
  avatarPlaceholder: {
    width: 28,
    marginHorizontal: theme.spacing.xs,
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    maxWidth: width * 0.7,
  },
  ownMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageText: {
    ...theme.typography.body,
    lineHeight: 20,
  },
  ownMessageText: {
    color: theme.colors.text.white,
  },
  otherMessageText: {
    color: theme.colors.text.primary,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  ownMessageInfo: {
    justifyContent: 'flex-end',
  },
  otherMessageInfo: {
    justifyContent: 'flex-start',
  },
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    fontSize: 10,
  },
  messageStatus: {
    marginLeft: 4,
  },
  imageMessage: {
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  voiceWave: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.text.muted,
    borderRadius: 1,
    marginRight: theme.spacing.sm,
  },
  voiceDuration: {
    ...theme.typography.caption,
    fontSize: 10,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: theme.spacing.sm,
  },
  typingBubble: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  typingText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  typingDot: {
    fontSize: 20,
    color: theme.colors.text.muted,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 60,
  },
  inputButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    textAlignVertical: 'center',
  },
  attachButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  voiceButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default ConversationScreen;