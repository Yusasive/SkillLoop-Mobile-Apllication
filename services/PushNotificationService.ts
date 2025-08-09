import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Environment from './EnvironmentService';
import { ApiService } from './ApiService';

export interface PushNotificationData {
  type:
    | 'session_reminder'
    | 'bid_received'
    | 'bid_accepted'
    | 'message'
    | 'certificate_ready';
  sessionId?: string;
  bidId?: string;
  messageId?: string;
  certificateId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const shouldShowAlert =
      notification.request.content.data?.showAlert !== false;
    const shouldPlaySound =
      notification.request.content.data?.playSound !== false;
    const shouldSetBadge =
      notification.request.content.data?.setBadge !== false;

    return {
      shouldShowAlert,
      shouldPlaySound,
      shouldSetBadge,
      shouldShowBanner: shouldShowAlert,
      shouldShowList: shouldShowAlert,
    };
  },
});

export class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<string | null> {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        console.warn(
          'Push notifications are not supported on simulators/emulators',
        );
        return null;
      }

      // Request permissions
      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        console.warn('Push notification permissions not granted');
        return null;
      }

      // Get Expo push token
      const token = await this.getExpoPushToken();
      if (!token) {
        console.error('Failed to get Expo push token');
        return null;
      }

      this.expoPushToken = token;

      // Register token with backend
      await this.registerTokenWithBackend(token);

      // Set up notification listeners
      this.setupNotificationListeners();

      // Configure notification channels (Android)
      if (Platform.OS === 'android') {
        await this.configureNotificationChannels();
      }

      console.log('Push notification service initialized successfully');
      return token;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return null;
    }
  }

  async requestPermissions(): Promise<NotificationPermissions> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return {
        granted: finalStatus === 'granted',
        canAskAgain: finalStatus !== 'denied',
        status: finalStatus,
      };
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Notifications.PermissionStatus.UNDETERMINED,
      };
    }
  }

  private async getExpoPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Environment.get('EXPO_PROJECT_ID'),
      });
      return token.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      await ApiService.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceId: Device.deviceName,
      });
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
    }
  }

  private setupNotificationListeners(): void {
    // Listen for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        this.handleNotificationReceived(notification);
      },
    );

    // Listen for user tapping on notifications
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response);
        this.handleNotificationResponse(response);
      });
  }

  private async configureNotificationChannels(): Promise<void> {
    // Session notifications
    await Notifications.setNotificationChannelAsync('sessions', {
      name: 'Sessions',
      description: 'Notifications about learning sessions',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
      sound: 'default',
    });

    // Bidding notifications
    await Notifications.setNotificationChannelAsync('bidding', {
      name: 'Bidding',
      description: 'Notifications about bids and learning requests',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#10b981',
      sound: 'default',
    });

    // Messages
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      description: 'Direct messages and chat notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 100, 100, 100],
      lightColor: '#f59e0b',
      sound: 'default',
    });

    // Certificates
    await Notifications.setNotificationChannelAsync('certificates', {
      name: 'Certificates',
      description: 'NFT certificate notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 500],
      lightColor: '#8b5cf6',
      sound: 'default',
    });
  }

  private handleNotificationReceived(
    notification: Notifications.Notification,
  ): void {
    const data = (notification.request.content.data || {}) as any;

    // Handle different notification types
    switch (data?.type) {
      case 'session_reminder':
        this.handleSessionReminder(data);
        break;
      case 'bid_received':
        this.handleBidReceived(data);
        break;
      case 'bid_accepted':
        this.handleBidAccepted(data);
        break;
      case 'message':
        this.handleMessage(data);
        break;
      case 'certificate_ready':
        this.handleCertificateReady(data);
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse,
  ): void {
    const data = response.notification.request.content.data as any;

    // Navigate to appropriate screen based on notification type
    switch (data?.type) {
      case 'session_reminder':
        // Navigate to session details
        break;
      case 'bid_received':
      case 'bid_accepted':
        // Navigate to learning requests
        break;
      case 'message':
        // Navigate to messages
        break;
      case 'certificate_ready':
        // Navigate to certificates
        break;
    }
  }

  private handleSessionReminder(data: PushNotificationData): void {
    // Handle session reminder logic
    console.log('Session reminder received:', data);
  }

  private handleBidReceived(data: PushNotificationData): void {
    // Handle bid received logic
    console.log('Bid received:', data);
  }

  private handleBidAccepted(data: PushNotificationData): void {
    // Handle bid accepted logic
    console.log('Bid accepted:', data);
  }

  private handleMessage(data: PushNotificationData): void {
    // Handle message logic
    console.log('Message received:', data);
  }

  private handleCertificateReady(data: PushNotificationData): void {
    // Handle certificate ready logic
    console.log('Certificate ready:', data);
  }

  async scheduleSessionReminder(
    sessionId: string,
    sessionTime: Date,
    minutesBefore: number = 15,
  ): Promise<string | null> {
    try {
      const reminderTime = new Date(
        sessionTime.getTime() - minutesBefore * 60 * 1000,
      );

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Session Starting Soon',
          body: `Your learning session starts in ${minutesBefore} minutes`,
          data: {
            type: 'session_reminder',
            sessionId,
          },
          sound: 'default',
        },
        trigger: {
          date: reminderTime,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule session reminder:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  getCurrentPushToken(): string | null {
    return this.expoPushToken;
  }

  onNotificationReceived(
    callback: (notification: Notifications.Notification) => void,
  ): () => void {
    const subscription =
      Notifications.addNotificationReceivedListener(callback);
    return () => Notifications.removeNotificationSubscription(subscription);
  }

  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }
  }
}
