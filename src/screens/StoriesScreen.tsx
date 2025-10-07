import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface StoryData {
  id: string;
  username: string;
  avatar: string;
  stories: StoryItem[];
}

interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  timestamp: string;
  duration?: number;
}

const MOCK_STORY_DATA: StoryData[] = [
  {
    id: '1',
    username: 'alex_photo',
    avatar: 'https://sm.marandi.in/sumitmarandi.jpeg?text=A',
    stories: [
      {
        id: '1-1',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Story+1',
        timestamp: '2h ago',
      },
      {
        id: '1-2',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Story+2',
        timestamp: '1h ago',
      },
    ],
  },
  {
    id: '2',
    username: 'maria.design',
    avatar: 'https://sm.marandi.in/sumitmarandi.jpeg?text=M',
    stories: [
      {
        id: '2-1',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Design+Work',
        timestamp: '4h ago',
      },
    ],
  },
  {
    id: '3',
    username: 'john_dev',
    avatar: 'https://sm.marandi.in/sumitmarandi.jpeg?text=J',
    stories: [
      {
        id: '3-1',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Coding+Setup',
        timestamp: '6h ago',
      },
      {
        id: '3-2',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Project+Update',
        timestamp: '5h ago',
      },
      {
        id: '3-3',
        type: 'image',
        url: 'https://sm.marandi.in/sumitmarandi.jpeg?text=Coffee+Break',
        timestamp: '4h ago',
      },
    ],
  },
];

interface StoryProgressBarProps {
  stories: StoryItem[];
  currentIndex: number;
  progress: number;
}

const StoryProgressBar: React.FC<StoryProgressBarProps> = ({ stories, currentIndex, progress }) => (
  <View style={styles.progressContainer}>
    {stories.map((_, index) => (
      <View key={index} style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${
                index < currentIndex ? 100 : index === currentIndex ? progress : 0
              }%`,
            },
          ]}
        />
      </View>
    ))}
  </View>
);

interface StoryViewerProps {
  storyData: StoryData;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storyData, onClose, onNext, onPrevious }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = storyData.stories[currentStoryIndex];

  const handleNextStory = () => {
    if (currentStoryIndex < storyData.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onNext();
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else {
      onPrevious();
    }
  };

  return (
    <View style={styles.storyViewer}>
      <StatusBar hidden />
      
      {/* Story Content */}
      <Image source={{ uri: currentStory.url }} style={styles.storyImage} />
      
      {/* Overlay */}
      <View style={styles.storyOverlay}>
        {/* Progress Bars */}
        <StoryProgressBar
          stories={storyData.stories}
          currentIndex={currentStoryIndex}
          progress={progress}
        />
        
        {/* Header */}
        <View style={styles.storyHeader}>
          <View style={styles.storyUserInfo}>
            <Image source={{ uri: storyData.avatar }} style={styles.storyAvatar} />
            <Text style={styles.storyUsername}>{storyData.username}</Text>
            <Text style={styles.storyTimestamp}>{currentStory.timestamp}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.white} />
          </TouchableOpacity>
        </View>
        
        {/* Touch areas for navigation */}
        <TouchableOpacity
          style={styles.leftTouchArea}
          onPress={handlePreviousStory}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.rightTouchArea}
          onPress={handleNextStory}
          activeOpacity={1}
        />
        
        {/* Bottom Actions */}
        <View style={styles.storyActions}>
          <View style={styles.storyInput}>
            <TouchableOpacity style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>Send message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.text.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="paper-plane-outline" size={24} color={theme.colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const StoriesScreen: React.FC = () => {
  const [selectedStoryData, setSelectedStoryData] = useState<StoryData | null>(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const handleStoryPress = (storyData: StoryData, index: number) => {
    setSelectedStoryData(storyData);
    setCurrentUserIndex(index);
  };

  const handleCloseStory = () => {
    setSelectedStoryData(null);
  };

  const handleNextUser = () => {
    const nextIndex = currentUserIndex + 1;
    if (nextIndex < MOCK_STORY_DATA.length) {
      setCurrentUserIndex(nextIndex);
      setSelectedStoryData(MOCK_STORY_DATA[nextIndex]);
    } else {
      handleCloseStory();
    }
  };

  const handlePreviousUser = () => {
    const prevIndex = currentUserIndex - 1;
    if (prevIndex >= 0) {
      setCurrentUserIndex(prevIndex);
      setSelectedStoryData(MOCK_STORY_DATA[prevIndex]);
    }
  };

  const renderStoryPreview = ({ item, index }: { item: StoryData; index: number }) => (
    <TouchableOpacity
      style={styles.storyPreview}
      onPress={() => handleStoryPress(item, index)}
    >
      <View style={styles.storyPreviewImageContainer}>
        <Image source={{ uri: item.stories[0].url }} style={styles.storyPreviewImage} />
        <View style={styles.storyPreviewOverlay}>
          <Image source={{ uri: item.avatar }} style={styles.previewAvatar} />
          <Text style={styles.previewUsername}>{item.username}</Text>
          <Text style={styles.previewCount}>{item.stories.length} stories</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedStoryData) {
    return (
      <StoryViewer
        storyData={selectedStoryData}
        onClose={handleCloseStory}
        onNext={handleNextUser}
        onPrevious={handlePreviousUser}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>myStories</Text>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_STORY_DATA}
        keyExtractor={item => item.id}
        renderItem={renderStoryPreview}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.storiesGrid}
        columnWrapperStyle={styles.storyRow}
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
  storiesGrid: {
    padding: theme.spacing.sm,
  },
  storyRow: {
    justifyContent: 'space-between',
  },
  storyPreview: {
    width: (width - theme.spacing.sm * 3) / 2,
    height: 200,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  storyPreviewImageContainer: {
    flex: 1,
    position: 'relative',
  },
  storyPreviewImage: {
    width: '100%',
    height: '100%',
  },
  storyPreviewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  previewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: theme.spacing.xs,
  },
  previewUsername: {
    ...theme.typography.body,
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  previewCount: {
    ...theme.typography.caption,
    color: theme.colors.text.white,
    opacity: 0.8,
  },
  // Story Viewer Styles
  storyViewer: {
    flex: 1,
    backgroundColor: theme.colors.text.primary,
  },
  storyImage: {
    width,
    height,
    resizeMode: 'cover',
  },
  storyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 4,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.text.white,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  storyUsername: {
    ...theme.typography.body,
    color: theme.colors.text.white,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  storyTimestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.white,
    opacity: 0.8,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 100,
    bottom: 100,
    width: width / 3,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: width / 3,
  },
  storyActions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
  },
  storyInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  inputPlaceholder: {
    ...theme.typography.body,
    color: theme.colors.text.white,
    opacity: 0.8,
  },
  heartButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  shareButton: {
    padding: theme.spacing.sm,
  },
});

export default StoriesScreen;