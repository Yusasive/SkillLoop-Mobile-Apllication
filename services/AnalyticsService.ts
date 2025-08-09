
import * as Sentry from '@sentry/react-native';
import {
  createClient,
  Identify,
  TrackEvent,
  ScreenEvent,
} from '@segment/analytics-react-native';
import * as Device from 'expo-device';
import Environment from './EnvironmentService';
import type { Transaction } from '@sentry/types';

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  userType: 'student' | 'tutor';
  signupDate?: string;
  walletConnected?: boolean;
  totalSessions?: number;
  skillsLearned?: string[];
  skillsTaught?: string[];
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private userId: string | null = null;
  private segmentClient: ReturnType<typeof createClient> | null = null;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.initializeSentry();
      await this.initializeSegment();

      this.isInitialized = true;
      console.log('Analytics service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  private async initializeSentry(): Promise<void> {
    const sentryDsn = Environment.get('SENTRY_DSN');
    if (!sentryDsn) {
      console.warn('Sentry DSN not configured, skipping crash reporting setup');
      return;
    }

    Sentry.init({
      dsn: sentryDsn,
      environment: Environment.get('ENVIRONMENT'),
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      beforeSend: (event) => {
        if (event.user) {
          delete event.user.email;
        }
        return event;
      },
      integrations: (defaults) => [
        ...defaults,
        Sentry.reactNavigationIntegration(),
      ],
      tracesSampleRate: Environment.isDevelopment() ? 1.0 : 0.1,
    });

    Sentry.setContext('device', {
      brand: Device.brand ?? 'Unknown',
      manufacturer: Device.manufacturer ?? 'Unknown',
      modelName: Device.modelName ?? 'Unknown',
      osName: Device.osName ?? 'Unknown',
      osVersion: Device.osVersion ?? 'Unknown',
      platform: Device.platformApiLevel ?? 'Unknown',
    });
  }

  private async initializeSegment(): Promise<void> {
    const segmentKey = Environment.get('SEGMENT_WRITE_KEY');
    if (!segmentKey) {
      console.warn(
        'Segment write key not configured, skipping analytics setup',
      );
      return;
    }

    this.segmentClient = createClient({ writeKey: segmentKey });
  }

  setUser(userProperties: UserProperties): void {
    if (!this.isInitialized || !this.segmentClient) return;

    this.userId = userProperties.userId;

    Sentry.setUser({
      id: userProperties.userId,
      userType: userProperties.userType,
    });

    const identify = new Identify();
    if (userProperties.email) identify.set('email', userProperties.email);
    identify.set('userType', userProperties.userType);

    this.segmentClient.identify(userProperties.userId, identify);
  }

  track(event: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || !this.segmentClient) return;

    try {
      const eventProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: 'mobile',
        environment: Environment.get('ENVIRONMENT'),
      };

      const trackEvent = new TrackEvent(event, eventProperties);
      this.segmentClient.track(trackEvent);

      Sentry.addBreadcrumb({
        message: event,
        category: 'user_action',
        data: eventProperties,
        level: 'info',
      });

      console.log('Tracked event:', event, eventProperties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  screen(screenName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || !this.segmentClient) return;

    try {
      const screenEvent = new ScreenEvent(screenName, properties ?? {});
      this.segmentClient.screen(screenEvent);

      Sentry.addBreadcrumb({
        message: `Screen: ${screenName}`,
        category: 'navigation',
        data: properties,
        level: 'info',
      });
    } catch (error) {
      console.error('Failed to track screen:', error);
    }
  }

  // Example of domain-specific tracking
  trackSessionBooked(data: {
    sessionId: string;
    tutorId: string;
    skill: string;
    duration: number;
    rate: number;
  }): void {
    this.track('Session Booked', data);
  }

  // Error tracking
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.error('Untracked error:', error);
      return;
    }

    Sentry.withScope((scope) => {
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          scope.setExtra(key, value);
        }
      }
      Sentry.captureException(error);
    });
  }

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ): void {
    if (!this.isInitialized) return;
    Sentry.captureMessage(message, level);
  }

  startTransaction(name: string, op: string): Transaction | null {
    if (!this.isInitialized) return null;
    return Sentry.startTransaction({ name, op });
  }

  async setAnalyticsEnabled(enabled: boolean): Promise<void> {
    if (enabled) {
      await this.initialize();
    } else {
      this.segmentClient?.reset();
      await Sentry.flush(2000);
      this.isInitialized = false;
    }
  }

  async flush(): Promise<void> {
    await this.segmentClient?.flush();
  }

  reset(): void {
    this.segmentClient?.reset();
    Sentry.configureScope((scope) => scope.clear());
    this.userId = null;
  }
}

export const analyticsService = AnalyticsService.getInstance();
