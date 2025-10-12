import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';
import { Camera } from 'expo-camera';

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
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds per story

  const currentStory = storyData.stories[currentStoryIndex];

  useEffect(() => {
    if (!isPaused) {
      startProgress();
    }
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStoryIndex, isPaused]);

  useEffect(() => {
    // Reset story index when story data changes
    setCurrentStoryIndex(0);
    setProgress(0);
  }, [storyData]);

  const startProgress = () => {
    setProgress(0);
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    const interval = 50; // Update every 50ms for smoother animation
    const increment = (100 * interval) / STORY_DURATION;
    
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressRef.current!);
          // Use setTimeout to avoid state update conflicts
          setTimeout(() => {
            handleNextStory();
          }, 10);
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };

  const pauseProgress = () => {
    setIsPaused(true);
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
  };

  const resumeProgress = () => {
    setIsPaused(false);
  };

  const handleNextStory = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    
    if (currentStoryIndex < storyData.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Move to next user
      setTimeout(() => {
        onNext();
      }, 100);
    }
  };

  const handlePreviousStory = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
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
          onPressIn={pauseProgress}
          onPressOut={resumeProgress}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.rightTouchArea}
          onPress={handleNextStory}
          onPressIn={pauseProgress}
          onPressOut={resumeProgress}
          activeOpacity={1}
        />
        
        {/* Center pause area */}
        <TouchableOpacity
          style={styles.centerTouchArea}
          onPressIn={pauseProgress}
          onPressOut={resumeProgress}
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
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleStoryPress = (storyData: StoryData, index: number) => {
    setSelectedStoryData(storyData);
    setCurrentUserIndex(index);
  };

  const handleCloseStory = () => {
    setSelectedStoryData(null);
  };

  const handleNextUser = () => {
    const nextIndex = currentUserIndex + 1;
    console.log('Moving to next user:', nextIndex, 'Total users:', MOCK_STORY_DATA.length);
    
    if (nextIndex < MOCK_STORY_DATA.length) {
      setCurrentUserIndex(nextIndex);
      setSelectedStoryData(MOCK_STORY_DATA[nextIndex]);
    } else {
      console.log('No more users, closing stories');
      handleCloseStory();
    }
  };

  const handlePreviousUser = () => {
    const prevIndex = currentUserIndex - 1;
    console.log('Moving to previous user:', prevIndex);
    
    if (prevIndex >= 0) {
      setCurrentUserIndex(prevIndex);
      setSelectedStoryData(MOCK_STORY_DATA[prevIndex]);
    }
  };

  const handleCameraPress = () => {
    setShowCameraModal(true);
  };

  const handleCloseModal = () => {
    setShowCameraModal(false);
  };

  const takePhoto = async () => {
    console.log('📷 Take Photo button pressed');
    setShowCameraModal(false);
    
    // Add a small delay to ensure modal closes properly
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      console.log('📱 Step 1: Checking platform...');
      console.log('Platform:', Platform.OS);
      console.log('Platform Version:', Platform.Version);
      
      // First try to get camera permissions using expo-camera (more reliable)
      console.log('📱 Step 2: Requesting camera permissions with expo-camera...');
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission (expo-camera):', cameraPermission);
      
      if (cameraPermission.status !== 'granted') {
        console.log('❌ Camera permission denied');
        Alert.alert(
          'Permission Required',
          'This app needs camera access to take photos. Please enable camera permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('✅ Camera permissions granted');
      
      // Also request ImagePicker permissions as backup
      console.log('📱 Step 3: Requesting ImagePicker permissions...');
      const imagePickerPermission = await ImagePicker.requestCameraPermissionsAsync();
      console.log('ImagePicker permission:', imagePickerPermission);
      
      console.log('� Step 4: Launching camera with ImagePicker...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: false, // Try without editing first
        quality: 1.0, // Maximum quality
        base64: false,
      });

      console.log('📸 Step 5: Camera result received');
      console.log('Result canceled:', result.canceled);
      console.log('Result assets length:', result.assets?.length || 0);
      console.log('Full result:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('✅ Photo taken successfully!');
        console.log('Photo URI:', asset.uri);
        console.log('Photo dimensions:', asset.width, 'x', asset.height);
        
        Alert.alert(
          'Success!', 
          `Photo captured successfully!\nURI: ${asset.uri}\nSize: ${asset.width}x${asset.height}`,
          [{ text: 'OK' }]
        );
      } else {
        console.log('📷 Camera was canceled or no photo captured');
        console.log('Canceled:', result.canceled);
        console.log('Assets:', result.assets);
      }
    } catch (error) {
      console.error('❌ DETAILED CAMERA ERROR:');
      console.error('Error type:', typeof error);
      console.error('Error instanceof Error:', error instanceof Error);
      console.error('Error message:', error?.message || 'No message');
      console.error('Error stack:', error?.stack || 'No stack');
      console.error('Full error object:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert(
        'Camera Error', 
        `Camera failed: ${errorMessage}\n\nDebugging info:\n- Make sure you're on a real device\n- Check camera permissions in Settings\n- Try restarting the app`
      );
    }
  };

  const pickImageFromGallery = async () => {
    console.log('📱 Choose from Gallery button pressed');
    setShowCameraModal(false);
    
    // Add a small delay to ensure modal closes properly
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      console.log('📱 Step 1: Requesting media library permissions...');
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission result:', permission);
      
      if (permission.status !== 'granted') {
        console.log('❌ Media library permission denied');
        Alert.alert(
          'Permission Required',
          'This app needs photo library access to select images. Please enable photo permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('✅ Media library permissions granted');
      console.log('� Step 2: Opening image gallery...');
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false, // Try without editing first
        quality: 1.0,
        allowsMultipleSelection: false,
        base64: false,
      });

      console.log('📸 Step 3: Gallery result received');
      console.log('Result canceled:', result.canceled);
      console.log('Result assets length:', result.assets?.length || 0);
      console.log('Full gallery result:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('✅ Image selected successfully!');
        console.log('Image URI:', asset.uri);
        console.log('Image dimensions:', asset.width, 'x', asset.height);
        
        Alert.alert(
          'Success!', 
          `Image selected successfully!\nURI: ${asset.uri}\nSize: ${asset.width}x${asset.height}`,
          [{ text: 'OK' }]
        );
      } else {
        console.log('📷 Gallery selection was canceled or no image selected');
      }
    } catch (error) {
      console.error('❌ DETAILED GALLERY ERROR:');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message || 'No message');
      console.error('Error stack:', error?.stack || 'No stack');
      console.error('Full error object:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert(
        'Gallery Error', 
        `Gallery failed: ${errorMessage}\n\nTry:\n- Check photo permissions in Settings\n- Restart the app\n- Make sure you have photos in your gallery`
      );
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
        key={`story-${currentUserIndex}-${selectedStoryData.id}`}
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

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.floatingCameraButton} onPress={handleCameraPress}>
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>

      {/* Camera Modal */}
      <Modal
        visible={showCameraModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Story</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="camera" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionSubtitle}>Use camera to capture a moment</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={pickImageFromGallery}>
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="images" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                  <Text style={styles.modalOptionSubtitle}>Select an existing photo or video</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  centerTouchArea: {
    position: 'absolute',
    left: width / 3,
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
  // Floating Camera Button
  floatingCameraButton: {
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  modalOptionSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  // Story Preview Styles
  storyPreviewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyPreviewFullImage: {
    width,
    height,
    resizeMode: 'cover',
  },
  storyPreviewFullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
    paddingBottom: 50,
  },
  storyPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  storyPreviewTitle: {
    ...theme.typography.body,
    color: 'white',
    fontWeight: '600',
  },
  discardButton: {
    padding: theme.spacing.xs,
  },
  storyPreviewActions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  discardStoryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'white',
  },
  discardStoryText: {
    ...theme.typography.body,
    color: 'white',
    fontWeight: '500',
  },
  publishStoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
  },
  publishStoryText: {
    ...theme.typography.body,
    color: 'white',
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});

export default StoriesScreen;