import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../theme/theme';
const theme = themes.light;

interface HelpItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const HelpItem: React.FC<HelpItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.helpItem} onPress={onPress}>
    <View style={styles.helpItemLeft}>
      <View style={styles.helpIcon}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.helpText}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
  </TouchableOpacity>
);

interface HelpCenterScreenProps {
  navigation?: any;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ navigation }) => {
  const helpTopics = [
    {
      icon: 'person-add-outline',
      title: 'Getting Started',
      subtitle: 'Learn the basics of using the app',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Safety',
      subtitle: 'Keep your account secure and private',
    },
    {
      icon: 'chatbubble-outline',
      title: 'Messaging',
      subtitle: 'Send messages and manage conversations',
    },
    {
      icon: 'image-outline',
      title: 'Posts & Stories',
      subtitle: 'Share content and engage with others',
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
    },
    {
      icon: 'settings-outline',
      title: 'Account Settings',
      subtitle: 'Customize your account and preferences',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Ionicons name="help-circle" size={48} color={theme.colors.primary} />
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions and get support
          </Text>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          {helpTopics.map((topic, index) => (
            <HelpItem
              key={index}
              icon={topic.icon}
              title={topic.title}
              subtitle={topic.subtitle}
              onPress={() => console.log(`Help topic: ${topic.title}`)}
            />
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubbles-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.contactButtonText}>Live Chat</Text>
          </TouchableOpacity>
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
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  welcomeTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  helpSection: {
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  helpSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  contactSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contactButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});

export default HelpCenterScreen;