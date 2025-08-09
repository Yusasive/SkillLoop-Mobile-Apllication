import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  Bell,
  X,
  Calendar,
  MessageCircle,
  Award,
  AlertCircle,
} from 'lucide-react-native';
import { PushNotificationService } from '../../services/PushNotificationService';
import AccessibilityService from '../../services/AccessibilityService';
import { AnalyticsService } from '../../services/AnalyticsService';

const analyticsService = AnalyticsService.getInstance();
const notificationService = PushNotificationService.getInstance();

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type:
    | 'session_reminder'
    | 'session_request'
    | 'message'
    | 'certificate'
    | 'general';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationBannerProps {
  notification: NotificationData;
  onPress?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onPress,
  onDismiss,
  autoHide = true,
  hideDelay = 5000,
}) => {
  const colorScheme = useColorScheme();
  const [visible, setVisible] = useState(true);
  const styles = createStyles(colorScheme === 'dark');

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, onDismiss]);

  useEffect(() => {
    // Announce notification for accessibility
    AccessibilityService.announceToScreenReader(
      `New notification: ${notification.title}. ${notification.body}`,
    );

    // Track notification display
    analyticsService.track('notification_displayed', {
      notification_id: notification.id,
      type: notification.type,
      timestamp: new Date().toISOString(),
    });
  }, [notification]);

  const handlePress = () => {
    analyticsService.track('notification_tapped', {
      notification_id: notification.id,
      type: notification.type,
      timestamp: new Date().toISOString(),
    });

    AccessibilityService.provideHapticFeedback('light');
    onPress?.();
  };

  const handleDismiss = () => {
    analyticsService.track('notification_dismissed', {
      notification_id: notification.id,
      type: notification.type,
      timestamp: new Date().toISOString(),
    });

    setVisible(false);
    onDismiss?.();
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'session_reminder':
      case 'session_request':
        return <Calendar size={20} color="#3b82f6" />;
      case 'message':
        return <MessageCircle size={20} color="#10b981" />;
      case 'certificate':
        return <Award size={20} color="#f59e0b" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'session_reminder':
        return styles.sessionNotification;
      case 'session_request':
        return styles.requestNotification;
      case 'message':
        return styles.messageNotification;
      case 'certificate':
        return styles.certificateNotification;
      default:
        return styles.defaultNotification;
    }
  };

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={[styles.container, getNotificationStyle()]}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.body}`}
      accessibilityHint="Tap to view details or dismiss notification"
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getNotificationIcon()}</View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={styles.timestamp}>
            {notification.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <X size={18} color={styles.dismissIcon.color} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

interface NotificationManagerProps {
  children: React.ReactNode;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Listen for new notifications
    const unsubscribe = notificationService.onNotificationReceived(
      (notification) => {
        const notificationData: NotificationData = {
          id: notification.request.identifier,
          title: notification.request.content.title || 'SkillLoop',
          body: notification.request.content.body || '',
          type: (notification.request.content.data?.type as any) || 'general',
          timestamp: new Date(),
          read: false,
          actionUrl: notification.request.content.data?.actionUrl as
            | string
            | undefined,
          metadata: notification.request.content.data,
        };

        setNotifications((prev) => [notificationData, ...prev.slice(0, 4)]); // Keep max 5 notifications
      },
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleNotificationPress = (notification: NotificationData) => {
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'session_reminder':
        // Navigate to session
        console.log('Navigate to session:', notification.metadata?.sessionId);
        break;
      case 'session_request':
        // Navigate to session requests
        console.log('Navigate to session requests');
        break;
      case 'message':
        // Navigate to messages
        console.log(
          'Navigate to messages:',
          notification.metadata?.conversationId,
        );
        break;
      case 'certificate':
        // Navigate to certificates
        console.log('Navigate to certificates');
        break;
      default:
        // Default action
        if (notification.actionUrl) {
          console.log('Navigate to:', notification.actionUrl);
        }
    }

    // Remove notification after handling
    removeNotification(notification.id);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Render notification banners */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={notificationStyles.notificationContainer}>
          {notifications.map((notification, index) => (
            <View
              key={notification.id}
              style={[
                notificationStyles.notificationWrapper,
                { top: 20 + index * 80 },
              ]}
            >
              <NotificationBanner
                notification={notification}
                onPress={() => handleNotificationPress(notification)}
                onDismiss={() => removeNotification(notification.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
    },
    iconContainer: {
      marginRight: 12,
      marginTop: 2,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 4,
    },
    body: {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#4b5563',
      lineHeight: 18,
      marginBottom: 4,
    },
    timestamp: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    dismissButton: {
      padding: 4,
      marginLeft: 8,
    },
    dismissIcon: {
      color: isDark ? '#9ca3af' : '#6b7280',
    },

    // Notification type styles
    defaultNotification: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    sessionNotification: {
      backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
      borderLeftWidth: 4,
      borderLeftColor: '#3b82f6',
    },
    requestNotification: {
      backgroundColor: isDark ? '#166534' : '#dcfce7',
      borderLeftWidth: 4,
      borderLeftColor: '#10b981',
    },
    messageNotification: {
      backgroundColor: isDark ? '#7c2d12' : '#fed7aa',
      borderLeftWidth: 4,
      borderLeftColor: '#f97316',
    },
    certificateNotification: {
      backgroundColor: isDark ? '#a16207' : '#fef3c7',
      borderLeftWidth: 4,
      borderLeftColor: '#f59e0b',
    },
  });

const notificationStyles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  notificationWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
