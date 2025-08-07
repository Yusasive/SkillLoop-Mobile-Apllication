import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Calendar,
  Globe,
  Award
} from 'lucide-react-native';

export default function TutorProfileScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'schedule'>('about');

  // Mock tutor data
  const tutor = {
    id: id as string,
    name: 'Sarah Johnson',
    bio: 'Experienced software engineer with 8+ years in full-stack development. Passionate about teaching and helping others grow their programming skills.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript'],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: '75',
    isOnline: true,
    responseTime: '~2 hours',
    completedSessions: 340,
    languages: ['English', 'Spanish'],
    verified: true,
    joinedDate: '2023-01-15',
    totalEarnings: '25,400',
    successRate: 98,
  };

  const reviews = [
    {
      id: '1',
      studentName: 'Alex Chen',
      rating: 5,
      comment: 'Excellent teacher! Sarah explained complex concepts in a very clear way.',
      date: '2024-01-15',
    },
    {
      id: '2',
      studentName: 'Maria Garcia',
      rating: 5,
      comment: 'Very patient and knowledgeable. Helped me understand React hooks perfectly.',
      date: '2024-01-10',
    },
  ];

  const tabs = [
    { id: 'about' as const, label: 'About' },
    { id: 'reviews' as const, label: 'Reviews' },
    { id: 'schedule' as const, label: 'Schedule' },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutor Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{tutor.name.charAt(0)}</Text>
            </View>
            {tutor.isOnline && <View style={styles.onlineIndicator} />}
            {tutor.verified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={16} color="#ffffff" />
              </View>
            )}
          </View>

          <Text style={styles.tutorName}>{tutor.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.rating}>{tutor.rating}</Text>
            <Text style={styles.reviewCount}>({tutor.reviewCount} reviews)</Text>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Text style={styles.metaText}>{tutor.responseTime} response</Text>
            </View>
            <View style={styles.metaItem}>
              <Globe size={14} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Text style={styles.metaText}>{tutor.languages.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>${tutor.hourlyRate}/hour</Text>
            <Text style={styles.priceNote}>Secure payments via smart contract</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <View style={styles.aboutContent}>
              <View style={styles.bioSection}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>{tutor.bio}</Text>
              </View>

              <View style={styles.skillsSection}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsGrid}>
                  {tutor.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{tutor.completedSessions}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{tutor.successRate}%</Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>${tutor.totalEarnings}</Text>
                    <Text style={styles.statLabel}>Total Earned</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.reviewsContent}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.studentName}</Text>
                    <View style={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          color="#f59e0b"
                          fill={star <= review.rating ? "#f59e0b" : "transparent"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'schedule' && (
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Available Time Slots</Text>
              <Text style={styles.schedulePlaceholder}>
                Calendar integration would go here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={20} color="#3b82f6" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bookButton}>
          <Calendar size={20} color="#ffffff" />
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: isDark ? '#1f2937' : '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  reviewCount: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  priceSection: {
    alignItems: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  tabContent: {
    margin: 16,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  aboutContent: {
    gap: 24,
  },
  bioSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
  },
  skillsSection: {},
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontWeight: '500',
  },
  statsSection: {},
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  reviewsContent: {
    gap: 16,
  },
  reviewItem: {
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  scheduleContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  schedulePlaceholder: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  messageButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});