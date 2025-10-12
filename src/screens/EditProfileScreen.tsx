import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface EditProfileScreenProps {
  navigation?: any;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  website: string;
}

const INITIAL_PROFILE: UserProfile = {
  username: 'your_username',
  displayName: 'Your Display Name',
  bio: '🎨 Designer • 📱 App Developer • ☕ Coffee Lover, Living life one pixel at a time ✨',
  avatar: 'https://sm.marandi.in/sumitmarandi.jpeg?text=YOU',
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://yourwebsite.com',
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Profile updated successfully!');
      navigation?.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };  
return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Profile</Text>
          
          <TouchableOpacity 
            style={[styles.headerButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={[
              styles.saveButtonText,
              isLoading && styles.saveButtonTextDisabled
            ]}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleChangePhoto}
              >
                <Ionicons name="camera" size={16} color={theme.colors.text.white} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={profile.username}
                onChangeText={(text) => updateProfile('username', text)}
                placeholder="Enter username"
                placeholderTextColor={theme.colors.text.muted}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={profile.displayName}
                onChangeText={(text) => updateProfile('displayName', text)}
                placeholder="Enter display name"
                placeholderTextColor={theme.colors.text.muted}
              />
            </View>     
       <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={profile.bio}
                onChangeText={(text) => updateProfile('bio', text)}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.text.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>{profile.bio.length}/150</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={profile.email}
                onChangeText={(text) => updateProfile('email', text)}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={profile.phone}
                onChangeText={(text) => updateProfile('phone', text)}
                placeholder="Enter phone number"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.textInput}
                value={profile.website}
                onChangeText={(text) => updateProfile('website', text)}
                placeholder="Enter website URL"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.optionsSection}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.optionText}>Privacy Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Ionicons name="notifications-outline" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.optionText}>Notification Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
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
  headerButton: {
    padding: theme.spacing.xs,
    minWidth: 60,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  saveButton: {
    alignItems: 'flex-end',
  },
  saveButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  saveButtonTextDisabled: {
    color: theme.colors.text.muted,
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  changePhotoText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  bioInput: {
    height: 100,
    paddingTop: theme.spacing.sm,
  },
  characterCount: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  optionsSection: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
});

export default EditProfileScreen;