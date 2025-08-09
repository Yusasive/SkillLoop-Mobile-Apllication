import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList, ActivityIndicator } from 'react-native';
import { Star, Clock, CheckCircle } from 'lucide-react-native';
import { Tutor } from '@/store/types';

interface TutorGridProps {
  tutors: Tutor[];
  loading: boolean;
  refreshControl?: React.ReactElement<any>;
}

export const TutorGrid: React.FC<TutorGridProps> = ({ 
  tutors, 
  loading, 
  refreshControl 
}) => {
  const colorScheme = useColorScheme();

  const renderTutor = ({ item }: { item: Tutor }) => (
    <TouchableOpacity style={styles.tutorCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          {item.isOnline && <View style={styles.onlineIndicator} />}
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={12} color="#ffffff" />
            </View>
          )}
        </View>
      </View>

      <Text style={styles.tutorName} numberOfLines={1}>{item.name}</Text>
      
      <View style={styles.ratingContainer}>
        <Star size={14} color="#f59e0b" fill="#f59e0b" />
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.reviewCount}>({item.reviewCount})</Text>
      </View>

      <View style={styles.skillsContainer}>
        {item.skills.slice(0, 2).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText} numberOfLines={1}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 2 && (
          <Text style={styles.moreSkills}>+{item.skills.length - 2}</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.rate}>${item.hourlyRate}/hr</Text>
        <View style={styles.responseTime}>
          <Clock size={12} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
          <Text style={styles.responseText}>{item.responseTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(colorScheme === 'dark');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <FlatList
      data={tutors}
      renderItem={renderTutor}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    />
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorCard: {
    width: '48%',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: isDark ? '#1f2937' : '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  reviewCount: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    justifyContent: 'center',
  },
  skillTag: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 80,
  },
  skillText: {
    fontSize: 10,
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontWeight: '500',
    textAlign: 'center',
  },
  moreSkills: {
    fontSize: 10,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  cardFooter: {
    alignItems: 'center',
    gap: 4,
  },
  rate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});