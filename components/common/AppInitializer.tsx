import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AnalyticsService } from '../../services/AnalyticsService';
import { PushNotificationService } from '../../services/PushNotificationService';
import { VideoCallService } from '../../services/VideoCallService';
import AccessibilityService from '../../services/AccessibilityService';
import PerformanceMonitor from '../../services/PerformanceMonitor';
import OfflineQueueService from '../../services/OfflineQueueService';
import { useFrameworkReady } from '../../hooks/useFrameworkReady';

interface AppInitializerProps {
  children: React.ReactNode;
  onInitialized?: () => void;
}

interface InitializationState {
  analytics: boolean;
  notifications: boolean;
  videoCalls: boolean;
  accessibility: boolean;
  performance: boolean;
  offlineQueue: boolean;
  frameworks: boolean;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({
  children,
  onInitialized,
}) => {
  const [initState, setInitState] = useState<InitializationState>({
    analytics: false,
    notifications: false,
    videoCalls: false,
    accessibility: false,
    performance: false,
    offlineQueue: false,
    frameworks: false,
  });

  const [error, setError] = useState<string | null>(null);
  const envValidation = useFrameworkReady();

  useEffect(() => {
    if (!envValidation.isLoading && envValidation.isValid) {
      setInitState((prev) => ({ ...prev, frameworks: true }));
      initializeServices();
    }
  }, [envValidation.isLoading, envValidation.isValid]);

  const initializeServices = async () => {
    try {
      // Initialize Analytics Service
      const analyticsService = AnalyticsService.getInstance();
      await analyticsService.initialize();
      setInitState((prev) => ({ ...prev, analytics: true }));

      // Initialize Push Notification Service
      const notificationService = PushNotificationService.getInstance();
      await notificationService.initialize();
      setInitState((prev) => ({ ...prev, notifications: true }));

      // Initialize Video Call Service
      const videoCallService = VideoCallService.getInstance();
      await videoCallService.initialize();
      setInitState((prev) => ({ ...prev, videoCalls: true }));

      // Initialize Accessibility Service (synchronous)
      setInitState((prev) => ({ ...prev, accessibility: true }));

      // Initialize Performance Monitor
      PerformanceMonitor.recordAppLaunchTime();
      setInitState((prev) => ({ ...prev, performance: true }));

      // Initialize Offline Queue Service (initializes automatically)
      setInitState((prev) => ({ ...prev, offlineQueue: true }));

      console.log('All services initialized successfully');
      onInitialized?.();
    } catch (error) {
      console.error('Failed to initialize services:', error);
      setError(
        error instanceof Error ? error.message : 'Unknown initialization error',
      );
    }
  };

  const allServicesReady = Object.values(initState).every(Boolean);
  const initializationProgress =
    (Object.values(initState).filter(Boolean).length /
      Object.keys(initState).length) *
    100;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!allServicesReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingTitle}>Initializing SkillLoop...</Text>
        <Text style={styles.loadingProgress}>
          {Math.round(initializationProgress)}% Complete
        </Text>

        <View style={styles.serviceList}>
          {Object.entries(initState).map(([service, ready]) => (
            <View key={service} style={styles.serviceItem}>
              <View
                style={[styles.serviceIndicator, ready && styles.serviceReady]}
              />
              <Text
                style={[styles.serviceName, ready && styles.serviceNameReady]}
              >
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingProgress: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 40,
  },
  serviceList: {
    alignSelf: 'stretch',
    maxWidth: 300,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#374151',
    marginRight: 12,
  },
  serviceReady: {
    backgroundColor: '#10b981',
  },
  serviceName: {
    fontSize: 16,
    color: '#6b7280',
  },
  serviceNameReady: {
    color: '#e5e7eb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#f87171',
    textAlign: 'center',
    lineHeight: 24,
  },
});
