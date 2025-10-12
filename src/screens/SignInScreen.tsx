import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { themes } from '../theme/theme';
const theme = themes.light;

const SignInScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.hint}>Placeholder sign in screen</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text.primary },
  hint: { marginTop: 8, color: theme.colors.text.muted },
  button: { marginTop: 16, backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: theme.borderRadius.md },
  buttonText: { color: theme.colors.text.white, fontWeight: '600' },
});

export default SignInScreen;
