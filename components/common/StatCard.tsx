import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark', color);

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const createStyles = (isDark: boolean, color: string) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  indicator: {
    width: 4,
    height: 24,
    backgroundColor: color,
    borderRadius: 2,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});