import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList, ActivityIndicator } from 'react-native';
import { Star, Clock, CheckCircle, MessageCircle, Calendar } from 'lucide-react-native';

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  isOnline: boolean;
  responseTime: string;
  completedSessions: number;
  languages: string[];
  verified: boolean;
}

interface TutorCardsProps {
  tutors: Tutor[];
  loading: boolean;
}

export const TutorCards: React.FC<TutorCardsProps> = ({ tutors, loading }) => {
  const colorScheme = useColorScheme();

  const renderTutor = ({ item }: { item: Tutor }) => (
    <TouchableOpacity style={styles.tutorCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.tutorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.tutorName}>{item.name}</Text>
            {item.verified && (
              <CheckCircle size={16} color="#3b82f6" />
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
          </View>
          
          <View style={styles.metaInfo}>
            <Text style={styles.sessions}>{item.completedSessions} sessions</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.responseTime}>{item.responseTime} response</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.rate}>${item.hourlyRate}</Text>
          <Text style={styles.rateUnit}>/hour</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

      <View style={styles.skillsContainer}>
        {item.skills.slice(0, 4).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 4 && (
          <Text style={styles.moreSkills}>+{item.skills.length - 4} more</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={16} color="#6b7280" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bookButton}>
          <Calendar size={16} color="#ffffff" />
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
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
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
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
  tutorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
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
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessions: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  separator: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  responseTime: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  rate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  rateUnit: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  bio: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  bookButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});