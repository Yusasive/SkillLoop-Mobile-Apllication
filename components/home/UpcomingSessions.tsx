import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { Clock, Video } from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { Session } from '@/store/types';

interface UpcomingSessionsProps {
  sessions: Session[];
}

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
  const colorScheme = useColorScheme();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <Text style={styles.tutorName}>{item.tutorName}</Text>
        <Text style={styles.skill}>{item.skill}</Text>
        <View style={styles.timeInfo}>
          <Clock size={16} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
          <Text style={styles.timeText}>
            {formatDate(item.scheduledTime)} • {formatTime(item.scheduledTime)} • {item.duration}min
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Video size={20} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const styles = createStyles(colorScheme === 'dark');

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Sessions</Text>
        <EmptyState
          icon={Clock}
          title="No upcoming sessions"
          description="Book a session with a tutor to get started"
          actionText="Find Tutors"
          onAction={() => {/* Navigate to discover */}}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Sessions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={sessions.slice(0, 3)} // Show only first 3 sessions
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sessionsList}
      />
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  seeAllText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sessionInfo: {
    flex: 1,
    marginRight: 12,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  skill: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  joinButton: {
    backgroundColor: '#10b981',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});