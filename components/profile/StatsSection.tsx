import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { StatCard } from '@/components/common/StatCard';
import { User } from '@/store/types';

interface StatsSectionProps {
  user: User | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ user }) => {
  const colorScheme = useColorScheme();

  if (!user) return null;

  const stats = [
    { 
      label: 'Sessions Completed', 
      value: user.completedSessions.toString(), 
      color: '#3b82f6' 
    },
    { 
      label: 'Skills Teaching', 
      value: user.teachingSkills.length.toString(), 
      color: '#10b981' 
    },
    { 
      label: 'Skills Learning', 
      value: user.learningSkills.length.toString(), 
      color: '#f59e0b' 
    },
    { 
      label: 'Average Rating', 
      value: user.rating.toFixed(1), 
      color: '#8b5cf6' 
    },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});