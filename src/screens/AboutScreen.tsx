import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../theme/theme';
const theme = themes.light;

interface AboutItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const AboutItem: React.FC<AboutItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.aboutItem} onPress={onPress}>
    <View style={styles.aboutItemLeft}>
      <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
      <Text style={styles.aboutTitle}>{title}</Text>
    </View>
    <Text style={styles.aboutValue}>{subtitle}</Text>
  </TouchableOpacity>
);

interface AboutScreenProps {
  navigation?: any;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="logo-instagram" size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.appName}>Social App</Text>
          <Text style={styles.appSlogan}>Connect, Share, Discover</Text>
        </View>

        <View style={styles.infoSection}>
          <AboutItem
            icon="information-circle-outline"
            title="Version"
            subtitle="1.0.0"
          />
          <AboutItem
            icon="build-outline"
            title="Build"
            subtitle="2024.10.12.001"
          />
          <AboutItem
            icon="calendar-outline"
            title="Release Date"
            subtitle="October 12, 2024"
          />
          <AboutItem
            icon="code-slash-outline"
            title="Platform"
            subtitle="React Native"
          />
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.creditsSection}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.creditsText}>
            Built with React Native and Expo. Icons by Ionicons. Images from Picsum Photos.
          </Text>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Made with ❤️ for connecting people around the world
          </Text>
          <Text style={styles.copyrightText}>
            © 2024 Social App. All rights reserved.
          </Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  appName: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  appSlogan: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  aboutItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
  aboutValue: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  legalSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  legalText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  creditsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  creditsText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  footerSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  copyrightText: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export default AboutScreen;