import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { ProgressBar } from '@/components/common/ProgressBar';
import { StatCard } from '@/components/common/StatCard';

interface Progress {
  totalSessions: number;
  completedSessions: number;
  hoursLearned: number;
  skillsLearned: number;
  certificatesEarned: number;
  currentStreak: number;
}

interface LearningProgressProps {
  progress?: Progress;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({ progress }) => {
  const colorScheme = useColorScheme();

  if (!progress) {
    return null;
  }

  const completionRate = progress.totalSessions > 0 
    ? (progress.completedSessions / progress.totalSessions) * 100 
    : 0;

  const stats = [
    { label: 'Hours Learned', value: progress.hoursLearned.toString(), color: '#3b82f6' },
    { label: 'Skills Learned', value: progress.skillsLearned.toString(), color: '#10b981' },
    { label: 'Certificates', value: progress.certificatesEarned.toString(), color: '#f59e0b' },
    { label: 'Current Streak', value: `${progress.currentStreak} days`, color: '#ef4444' },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Session Completion</Text>
          <Text style={styles.progressPercent}>{Math.round(completionRate)}%</Text>
        </View>
        <ProgressBar 
          progress={completionRate / 100} 
          color="#3b82f6"
          backgroundColor={colorScheme === 'dark' ? '#374151' : '#e5e7eb'}
        />
        <Text style={styles.progressSubtext}>
          {progress.completedSessions} of {progress.totalSessions} sessions completed
        </Text>
      </View>

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
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  progressSection: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressSubtext: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});