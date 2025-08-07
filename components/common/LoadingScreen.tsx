import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';

export const LoadingScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.text}>Loading SkillLoop...</Text>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#111827',
    fontWeight: '500',
  },
});