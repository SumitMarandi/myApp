import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
}

const PostUploadScreen: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const resetForm = () => {
    setSelectedMedia(null);
    setCaption('');
    setShowFilters(false);
    setIsUploading(false);
  };

  const handleCancel = () => {
    const hasUnsaved = !!selectedMedia || caption.trim().length > 0 || showFilters || isUploading;
    if (!hasUnsaved) {
      resetForm();
      return;
    }

    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => resetForm() },
      ]
    );
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload photos and videos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
        });
        setShowFilters(false);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia({
          uri: asset.uri,
          type: 'image',
          width: asset.width,
          height: asset.height,
        });
        setShowFilters(false);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePost = async () => {
    if (!selectedMedia) {
      Alert.alert('No media selected', 'Please select a photo or video to post');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    try {
      // Here you would typically:
      // 1. Compress the image/video if needed
      // 2. Upload to your server or cloud storage
      // 3. Create the post in your database
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      Alert.alert('Success', 'Your post has been uploaded!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedMedia(null);
            setCaption('');
            setShowFilters(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const MediaSelector = () => (
    <View style={styles.mediaSelectorContainer}>
      {selectedMedia ? (
        <View style={styles.selectedMediaContainer}>
          <Image source={{ uri: selectedMedia.uri }} style={styles.selectedMedia} />
          {selectedMedia.type === 'video' && (
            <View style={styles.videoOverlay}>
              <Ionicons name="play-circle" size={48} color={theme.colors.text.white} />
              {selectedMedia.duration && (
                <Text style={styles.videoDuration}>
                  {Math.floor(selectedMedia.duration / 1000)}s
                </Text>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.removeMediaButton}
            onPress={() => setSelectedMedia(null)}
          >
            <Ionicons name="close-circle" size={24} color={theme.colors.text.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyMediaContainer}>
          <Ionicons name="camera-outline" size={48} color={theme.colors.text.muted} />
          <Text style={styles.emptyMediaText}>Select a photo or video to share</Text>
          
          <View style={styles.mediaOptions}>
            <TouchableOpacity style={styles.mediaOptionButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={theme.colors.primary} />
              <Text style={styles.mediaOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaOptionButton} onPress={pickImageFromGallery}>
              <Ionicons name="images" size={24} color={theme.colors.primary} />
              <Text style={styles.mediaOptionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const FilterOptions = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
      {['Normal', 'Bright', 'Contrast', 'Vintage', 'B&W', 'Sepia', 'Warm', 'Cool'].map((filter, index) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterOption, index === 0 && styles.activeFilter]}
        >
          <View style={styles.filterPreview}>
            {selectedMedia && (
              <Image source={{ uri: selectedMedia.uri }} style={styles.filterPreviewImage} />
            )}
          </View>
          <Text style={styles.filterName}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
            onPress={handlePost}
            disabled={!selectedMedia || isUploading}
        >
          <Text
            style={[
              styles.shareButton,
                (!selectedMedia || isUploading) && styles.shareButtonDisabled,
            ]}
          >
            {isUploading ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MediaSelector />

        {selectedMedia && (
          <>
            {/* Filter Toggle */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.filterToggle}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons name="color-filter-outline" size={20} color={theme.colors.text.primary} />
                <Text style={styles.filterToggleText}>Filters</Text>
                <Ionicons
                  name={showFilters ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.text.muted}
                />
              </TouchableOpacity>
              
              {showFilters && <FilterOptions />}
            </View>

            {/* Caption Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caption</Text>
              <View style={styles.captionContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/40x40/007AFF/FFFFFF?text=YOU' }}
                  style={styles.userAvatar}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={theme.colors.text.muted}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  maxLength={2200}
                />
              </View>
              <Text style={styles.characterCount}>{caption.length}/2,200</Text>
            </View>

            {/* Additional Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Options</Text>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Ionicons name="location-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={styles.optionText}>Add Location</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Ionicons name="person-add-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={styles.optionText}>Tag People</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Ionicons name="musical-notes-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={styles.optionText}>Add Music</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            {/* Privacy Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy</Text>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Ionicons name="globe-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={styles.optionText}>Share to Feed</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>
          </>
        )}
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
  },
  cancelButton: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  shareButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  shareButtonDisabled: {
    color: theme.colors.text.muted,
  },
  content: {
    flex: 1,
  },
  mediaSelectorContainer: {
    height: width,
    backgroundColor: theme.colors.surface,
  },
  selectedMediaContainer: {
    flex: 1,
    position: 'relative',
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoDuration: {
    ...theme.typography.caption,
    color: theme.colors.text.white,
    marginTop: theme.spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  removeMediaButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  emptyMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyMediaText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  mediaOptions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
  mediaOptionButton: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    minWidth: 80,
    ...theme.shadows.sm,
  },
  mediaOptionText: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  filterToggleText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  filtersContainer: {
    marginTop: theme.spacing.sm,
  },
  filterOption: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  activeFilter: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  filterPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  filterName: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  captionInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default PostUploadScreen;