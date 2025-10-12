import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { themes } from '../theme/theme';
const theme = themes.light;

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.hint}>Placeholder settings screen</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
  title: { fontSize: 22, fontWeight: '700', color: theme.colors.text.primary },
  hint: { marginTop: 8, color: theme.colors.text.muted },
  item: { marginTop: 16, paddingVertical: 12 },
  itemText: { color: theme.colors.text.primary },
});

export default SettingsScreen;
