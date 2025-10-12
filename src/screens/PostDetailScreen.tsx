import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { themes } from '../theme/theme';
const theme = themes.light;

const PostDetailScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Post</Text>
        <Text style={styles.hint}>Placeholder post detail screen</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text.primary },
  hint: { marginTop: 8, color: theme.colors.text.muted },
});

export default PostDetailScreen;
