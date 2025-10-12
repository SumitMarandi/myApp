import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../theme/theme';
const theme = themes.light;

const { width } = Dimensions.get('window');
const POST_SIZE = (width - theme.spacing.md * 2 - theme.spacing.xs * 2) / 3;

interface UserPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  posts: number;
  contacts: number;
  // followers: number;
  // following: number;
  isVerified: boolean;
}

const MOCK_PROFILE: UserProfile = {
  username: 'your_username',
  displayName: 'Your Display Name',
  bio: '🎨 Designer • 📱 App Developer • ☕ Coffee Lover, Living life one pixel at a time ✨',
  avatar: 'https://sm.marandi.in/sumitmarandi.jpeg?text=YOU',
  posts: 42,
  contacts: 128,
  // followers: 1250,
  // following: 386,
  isVerified: true,
};

const MOCK_POSTS: UserPost[] = Array.from({ length: 12 }, (_, index) => ({
  id: `post-${index + 1}`,
  image: `https://via.placeholder.com/${POST_SIZE}x${POST_SIZE}/${['FF5A5F', '007AFF', '42B883', 'F39C12', 'E74C3C', '9B59B6'][index % 6]
    }/FFFFFF?text=${index + 1}`,
  likes: Math.floor(Math.random() * 200) + 50,
  comments: Math.floor(Math.random() * 50) + 5,
}));



interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderPost = ({ item }: { item: UserPost }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <Ionicons name="heart" size={16} color={theme.colors.text.white} />
            <Text style={styles.postStatText}>{formatNumber(item.likes)}</Text>
          </View>
          <View style={styles.postStat}>
            <Ionicons name="chatbubble" size={14} color={theme.colors.text.white} />
            <Text style={styles.postStatText}>{formatNumber(item.comments)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: MOCK_PROFILE.avatar }} style={styles.avatar} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(MOCK_PROFILE.posts)}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(MOCK_PROFILE.contacts)}</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>

          {/* <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(MOCK_PROFILE.followers)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(MOCK_PROFILE.following)}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View> */}

        </View>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>{MOCK_PROFILE.displayName}</Text>
          {MOCK_PROFILE.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
          )}
        </View>
        <Text style={styles.bio}>{MOCK_PROFILE.bio}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation?.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation?.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>@{MOCK_PROFILE.username}</Text>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeader />

        <View style={styles.postsSection}>
          <View style={styles.postsHeader}>
            <Text style={styles.sectionTitle}>Posts</Text>
            <TouchableOpacity>
              <Ionicons name="grid-outline" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_POSTS}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.postRow}
            style={styles.postGrid}
          />
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: theme.spacing.md,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  profileDetails: {
    marginBottom: theme.spacing.md,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  displayName: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  editButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  // Posts Section
  postsSection: {
    flex: 1,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  postGrid: {
    paddingHorizontal: theme.spacing.md,
  },
  postRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  postItem: {
    width: POST_SIZE,
    height: POST_SIZE,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  postStatText: {
    ...theme.typography.caption,
    color: theme.colors.text.white,
    marginLeft: 4,
    fontWeight: '600',
  },

});

export default ProfileScreen;