import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { Tutor } from '@/store/types';

interface RecommendedTutorsProps {
  tutors: Tutor[];
}

export const RecommendedTutors: React.FC<RecommendedTutorsProps> = ({ tutors }) => {
  const colorScheme = useColorScheme();

  const renderTutor = (tutor: Tutor) => (
    <TouchableOpacity key={tutor.id} style={styles.tutorCard}>
      <View style={styles.tutorHeader}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{tutor.name.charAt(0)}</Text>
          </View>
          {tutor.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.tutorInfo}>
          <Text style={styles.tutorName}>{tutor.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.rating}>{tutor.rating}</Text>
            <Text style={styles.rateText}>• ${tutor.hourlyRate}/hr</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.skillsContainer}>
        {tutor.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(colorScheme === 'dark');

  if (tutors.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recommended Tutors</Text>
        <EmptyState
          icon={Clock}
          title="No recommendations yet"
          description="Complete your profile to get personalized tutor recommendations"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Tutors</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tutorsScroll}
      >
        {tutors.slice(0, 5).map(renderTutor)}
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  tutorsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  tutorCard: {
    width: 280,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: isDark ? '#1f2937' : '#ffffff',
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  rateText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontWeight: '500',
  },
});