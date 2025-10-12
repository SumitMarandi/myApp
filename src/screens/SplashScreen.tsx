import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { themes } from '../theme/theme';
const theme = themes.light;

const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>MyApp</Text>
        <Text style={styles.subtitle}>Loading…</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.text.muted,
  },
});

export default SplashScreen;
