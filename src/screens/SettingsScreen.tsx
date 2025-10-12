import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../theme/theme';
import { useAppTheme } from '../theme/ThemeProvider';
const theme = themes.light;

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsItemLeft}>
      <View style={styles.settingsIcon}>
        <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.settingsText}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || (showArrow && (
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
    ))}
  </TouchableOpacity>
);

interface SettingsScreenProps {
  navigation?: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const { mode: themeMode, setMode } = useAppTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Account</Text>
          <SettingsItem
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Control who can see your content"
            onPress={() => console.log('Privacy')}
          />
          <SettingsItem
            icon="shield-outline"
            title="Private Account"
            subtitle="Only followers can see your posts"
            showArrow={false}
            rightElement={
              <Switch
                value={privateAccount}
                onValueChange={setPrivateAccount}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            }
          />
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Notifications</Text>
          <SettingsItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            showArrow={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            }
          />
          <SettingsItem
            icon="mail-outline"
            title="Email Notifications"
            subtitle="Receive updates via email"
            onPress={() => console.log('Email Notifications')}
          />
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Appearance</Text>
          <View style={styles.themeToggleWrap}>
            <TouchableOpacity
              style={[styles.themeOption, themeMode === 'light' && styles.themeOptionActive]}
              onPress={() => setMode('light')}
            >
              <Text style={[styles.themeOptionText, themeMode === 'light' && styles.themeOptionTextActive]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeOption, themeMode === 'dark' && styles.themeOptionActive]}
              onPress={() => setMode('dark')}
            >
              <Text style={[styles.themeOptionText, themeMode === 'dark' && styles.themeOptionTextActive]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeOption, themeMode === 'solarized' && styles.themeOptionActive]}
              onPress={() => setMode('solarized')}
            >
              <Text style={[styles.themeOptionText, themeMode === 'solarized' && styles.themeOptionTextActive]}>Solarized</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Data & Storage</Text>
          <SettingsItem
            icon="cloud-download-outline"
            title="Backup & Sync"
            subtitle="Save your data to the cloud"
            onPress={() => console.log('Backup & Sync')}
          />
          <SettingsItem
            icon="download-outline"
            title="Download Data"
            subtitle="Export all your data"
            onPress={() => console.log('Download Data')}
          />
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.settingsGroupTitle}>Support</Text>
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => navigation?.navigate('HelpCenter')}
          />
          <SettingsItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and info"
            onPress={() => navigation?.navigate('About')}
          />
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation?.navigate('SignIn')}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.accent} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  settingsGroup: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  settingsGroupTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  settingsSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  themeToggleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  themeOption: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  themeOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  themeOptionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  themeOptionTextActive: {
    color: theme.colors.text.white,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  logoutText: {
    ...theme.typography.body,
    color: theme.colors.accent,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});

export default SettingsScreen;
