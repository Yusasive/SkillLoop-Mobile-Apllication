import React from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  RefreshControlProps,
} from 'react-native';
import { SwipeableTutorCard } from './SwipeableTutorCard';
import { AnalyticsService } from '../../services/AnalyticsService';
import AccessibilityService from '../../services/AccessibilityService';

const analyticsService = AnalyticsService.getInstance();

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
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const TutorCards: React.FC<TutorCardsProps> = ({
  tutors,
  loading,
  refreshControl,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  const handleTutorProfile = (tutorId: string) => {
    analyticsService.track('tutor_profile_viewed', {
      tutor_id: tutorId,
      source: 'discover_cards',
      timestamp: new Date().toISOString(),
    });
    // Navigate to tutor profile
    console.log('View profile:', tutorId);
  };

  const handleMessage = (tutorId: string) => {
    analyticsService.track('tutor_message_initiated', {
      tutor_id: tutorId,
      source: 'discover_cards',
      timestamp: new Date().toISOString(),
    });
    AccessibilityService.announceToScreenReader('Opening message with tutor');
    console.log('Message tutor:', tutorId);
  };

  const handleBook = (tutorId: string) => {
    analyticsService.track('session_booking_initiated', {
      tutor_id: tutorId,
      source: 'discover_cards',
      timestamp: new Date().toISOString(),
    });
    AccessibilityService.announceToScreenReader('Opening session booking');
    console.log('Book session:', tutorId);
  };

  const handleFavorite = (tutorId: string) => {
    analyticsService.track('tutor_favorited', {
      tutor_id: tutorId,
      source: 'discover_cards',
      timestamp: new Date().toISOString(),
    });
    AccessibilityService.announceToScreenReader('Added tutor to favorites');
    AccessibilityService.provideHapticFeedback('success');
    console.log('Add to favorites:', tutorId);
  };

  const renderTutor = ({ item }: { item: Tutor }) => (
    <SwipeableTutorCard
      tutor={item}
      onPress={() => handleTutorProfile(item.id)}
      onSwipeLeft={() => handleMessage(item.id)}
      onSwipeRight={() => handleFavorite(item.id)}
      onSwipeUp={() => handleBook(item.id)}
    />
  );

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
      refreshControl={refreshControl}
      accessible={true}
      accessibilityLabel="List of available tutors"
      accessibilityHint="Swipe cards left or right for quick actions"
    />
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
