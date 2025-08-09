import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Clock,
  Video,
  MessageCircle,
  Star,
  Calendar,
  User,
} from 'lucide-react-native';

interface Session {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  studentId: string;
  studentName: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  hourlyRate: string;
  totalAmount: string;
  escrowAmount?: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionsListProps {
  sessions: Session[];
  loading: boolean;
}

const statusColors = {
  scheduled: '#f59e0b',
  confirmed: '#10b981',
  in_progress: '#3b82f6',
  completed: '#6b7280',
  cancelled: '#ef4444',
};

const statusLabels = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  loading,
}) => {
  const colorScheme = useColorScheme();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateLabel = '';
    if (date.toDateString() === today.toDateString()) {
      dateLabel = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }

    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateLabel} • ${time}`;
  };

  const getActionButton = (session: Session) => {
    switch (session.status) {
      case 'confirmed':
        return (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          >
            <Video size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Join</Text>
          </TouchableOpacity>
        );
      case 'in_progress':
        return (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
          >
            <Video size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Rejoin</Text>
          </TouchableOpacity>
        );
      case 'completed':
        if (!session.rating) {
          return (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
            >
              <Star size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Rate</Text>
            </TouchableOpacity>
          );
        }
        return null;
      default:
        return (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#6b7280' }]}
          >
            <MessageCircle size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        );
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.tutorInfo}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{item.tutorName.charAt(0)}</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <Text style={styles.tutorName}>{item.tutorName}</Text>
            <Text style={styles.skill}>{item.skill}</Text>
            <View style={styles.timeContainer}>
              <Calendar
                size={14}
                color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <Text style={styles.timeText}>
                {formatDateTime(item.scheduledTime)}
              </Text>
              <Text style={styles.duration}>• {item.duration}min</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[item.status] },
            ]}
          >
            <Text style={styles.statusText}>{statusLabels[item.status]}</Text>
          </View>
          <Text style={styles.amount}>${item.totalAmount}</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      )}

      {item.status === 'completed' && item.rating && (
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                color="#f59e0b"
                fill={star <= item.rating! ? '#f59e0b' : 'transparent'}
              />
            ))}
          </View>
          {item.review && (
            <Text style={styles.reviewText} numberOfLines={2}>
              &quot;{item.review}&quot;
            </Text>
          )}
        </View>
      )}

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle
            size={16}
            color={colorScheme === 'dark' ? '#e5e7eb' : '#374151'}
          />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>

        {getActionButton(item)}
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
      data={sessions}
      renderItem={renderSession}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
    sessionCard: {
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    tutorInfo: {
      flexDirection: 'row',
      flex: 1,
      marginRight: 12,
    },
    avatarContainer: {
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
    sessionDetails: {
      flex: 1,
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
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    timeText: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    duration: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    statusContainer: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 4,
    },
    statusText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#3b82f6',
    },
    notesContainer: {
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    notesLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#e5e7eb' : '#374151',
      marginBottom: 4,
    },
    notesText: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 18,
    },
    ratingContainer: {
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
      marginBottom: 8,
    },
    reviewText: {
      fontSize: 14,
      color: isDark ? '#e5e7eb' : '#374151',
      fontStyle: 'italic',
      lineHeight: 18,
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
    messageButtonText: {
      fontSize: 14,
      color: isDark ? '#e5e7eb' : '#374151',
      fontWeight: '500',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 6,
    },
    actionButtonText: {
      fontSize: 14,
      color: '#ffffff',
      fontWeight: '600',
    },
  });
