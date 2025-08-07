import React from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { Clock, Award, Star, BookOpen } from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';

interface Activity {
  id: string;
  type: 'session_completed' | 'certificate_earned' | 'skill_learned' | 'tutor_rated';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  session_completed: BookOpen,
  certificate_earned: Award,
  skill_learned: Star,
  tutor_rated: Star,
};

const activityColors = {
  session_completed: '#10b981',
  certificate_earned: '#f59e0b',
  skill_learned: '#3b82f6',
  tutor_rated: '#8b5cf6',
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const colorScheme = useColorScheme();

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return activityTime.toLocaleDateString();
  };

  const renderActivity = ({ item }: { item: Activity }) => {
    const IconComponent = activityIcons[item.type];
    const color = activityColors[item.type];

    return (
      <View style={styles.activityItem}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <IconComponent size={20} color="#ffffff" strokeWidth={2} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityTime}>{formatTimeAgo(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  const styles = createStyles(colorScheme === 'dark');

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Activity</Text>
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="Complete sessions and earn certificates to see your activity here"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      
      <FlatList
        data={activities.slice(0, 5)} // Show only last 5 activities
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.activitiesList}
      />
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
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
});