import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  PanGestureHandler,
  State,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import {
  Star,
  Clock,
  CheckCircle,
  Heart,
  X,
  MessageCircle,
  Calendar,
} from 'lucide-react-native';
import { HapticService } from '@/services/HapticService';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;
const CARD_WIDTH = screenWidth - 32;

export interface SwipeableTutorCardProps {
  tutor: {
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
  };
  onSwipeLeft?: (tutorId: string) => void; // Reject/Pass
  onSwipeRight?: (tutorId: string) => void; // Like/Interested
  onSwipeUp?: (tutorId: string) => void; // Super like
  onPress?: (tutorId: string) => void; // Tap to view details
  disabled?: boolean;
}

export const SwipeableTutorCard: React.FC<SwipeableTutorCardProps> = ({
  tutor,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onPress,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [isPressed, setIsPressed] = useState(false);

  const styles = createStyles(colorScheme === 'dark');

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (disabled) return;

    const { state, translationX: x, translationY: y } = event.nativeEvent;

    if (state === State.ACTIVE) {
      // Update rotation based on horizontal movement
      const rotation = (x / screenWidth) * 15; // Max 15 degrees
      rotate.setValue(rotation);

      // Scale down slightly when dragging
      scale.setValue(0.95);
    }

    if (state === State.END) {
      const absX = Math.abs(x);
      const absY = Math.abs(y);

      // Check for vertical swipe (super like)
      if (y < -100 && absY > absX) {
        HapticService.success();
        animateSwipeUp();
        onSwipeUp?.(tutor.id);
        return;
      }

      // Check for horizontal swipes
      if (absX > SWIPE_THRESHOLD) {
        if (x > 0) {
          // Swipe right - like
          HapticService.success();
          animateSwipeRight();
          onSwipeRight?.(tutor.id);
        } else {
          // Swipe left - pass
          HapticService.light();
          animateSwipeLeft();
          onSwipeLeft?.(tutor.id);
        }
      } else {
        // Snap back to center
        animateToCenter();
      }
    }
  };

  const animateSwipeRight = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: screenWidth * 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSwipeLeft = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -screenWidth * 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSwipeUp = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -screenWidth * 1.5,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateToCenter = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled) {
      HapticService.selection();
      onPress?.(tutor.id);
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  // Create swipe direction indicators
  const rightLabelOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftLabelOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const upLabelOpacity = translateY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Swipe Direction Labels */}
      <Animated.View
        style={[
          styles.swipeLabel,
          styles.rightLabel,
          { opacity: rightLabelOpacity },
        ]}
      >
        <Heart size={32} color="#10b981" fill="#10b981" />
        <Text style={[styles.swipeLabelText, { color: '#10b981' }]}>
          INTERESTED
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.swipeLabel,
          styles.leftLabel,
          { opacity: leftLabelOpacity },
        ]}
      >
        <X size={32} color="#ef4444" />
        <Text style={[styles.swipeLabelText, { color: '#ef4444' }]}>PASS</Text>
      </Animated.View>

      <Animated.View
        style={[styles.swipeLabel, styles.upLabel, { opacity: upLabelOpacity }]}
      >
        <Star size={32} color="#f59e0b" fill="#f59e0b" />
        <Text style={[styles.swipeLabelText, { color: '#f59e0b' }]}>
          SUPER LIKE
        </Text>
      </Animated.View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!disabled}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateInterpolate },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.cardContent}
          >
            {/* Header */}
            <View style={styles.header}>
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

              <View style={styles.headerInfo}>
                <Text style={styles.name}>{tutor.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.rating}>{tutor.rating}</Text>
                  <Text style={styles.reviewCount}>({tutor.reviewCount})</Text>
                </View>
                <View style={styles.metaInfo}>
                  <Clock size={12} color="#6b7280" />
                  <Text style={styles.metaText}>{tutor.responseTime}</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>${tutor.hourlyRate}/hr</Text>
              </View>
            </View>

            {/* Bio */}
            <Text style={styles.bio} numberOfLines={3}>
              {tutor.bio}
            </Text>

            {/* Skills */}
            <View style={styles.skillsContainer}>
              {tutor.skills.slice(0, 4).map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {tutor.skills.length > 4 && (
                <View style={styles.skillTag}>
                  <Text style={styles.skillText}>
                    +{tutor.skills.length - 4}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Calendar size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: CARD_WIDTH,
      alignSelf: 'center',
      marginVertical: 8,
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    cardContent: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 12,
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
      fontSize: 24,
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
      borderColor: isDark ? '#1e293b' : '#ffffff',
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
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#0f172a',
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 4,
    },
    rating: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#0f172a',
    },
    reviewCount: {
      fontSize: 14,
      color: '#6b7280',
    },
    metaInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: '#6b7280',
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#3b82f6',
    },
    bio: {
      fontSize: 14,
      color: isDark ? '#cbd5e1' : '#475569',
      lineHeight: 20,
      marginBottom: 16,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    skillTag: {
      backgroundColor: isDark ? '#374151' : '#f1f5f9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    skillText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#e5e7eb' : '#475569',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    actionButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#374151' : '#f8fafc',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e2e8f0',
    },
    swipeLabel: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    rightLabel: {
      right: 20,
      top: '45%',
    },
    leftLabel: {
      left: 20,
      top: '45%',
    },
    upLabel: {
      top: 20,
      left: '45%',
    },
    swipeLabelText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
    },
  });
