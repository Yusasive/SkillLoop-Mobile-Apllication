import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Device from 'expo-device';
import { AnalyticsService } from '../services/AnalyticsService';

const analyticsService = AnalyticsService.getInstance();

interface PerformanceMetrics {
  appLaunchTime: number;
  screenLoadTime: number;
  memoryUsage: number;
  batteryLevel?: number;
  networkType?: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private appStartTime: number;
  private screenLoadTimes: Map<string, number> = new Map();
  private memoryWarningCount = 0;
  private performanceMetrics: PerformanceMetrics[] = [];

  private constructor() {
    this.appStartTime = Date.now();
    this.setupListeners();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupListeners() {
    // Monitor app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // Monitor memory warnings (React Native doesn't have native memory warning events)
    // We'll simulate this with periodic checks
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000); // Check every 30 seconds
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    analyticsService.track('app_state_changed', {
      app_state: nextAppState,
      timestamp: new Date().toISOString(),
    });

    if (nextAppState === 'active') {
      this.recordAppResumeTime();
    } else if (nextAppState === 'background') {
      this.recordAppBackgroundTime();
    }
  };

  private checkMemoryUsage() {
    // In a real implementation, you'd use a native module to get actual memory usage
    // For now, we'll simulate this
    const simulatedMemoryUsage = Math.random() * 100; // MB

    if (simulatedMemoryUsage > 80) {
      this.memoryWarningCount++;
      analyticsService.track('memory_warning', {
        memory_usage: simulatedMemoryUsage,
        warning_count: this.memoryWarningCount,
        timestamp: new Date().toISOString(),
      });
    }
  }

  recordScreenLoad(screenName: string, startTime: number) {
    const loadTime = Date.now() - startTime;
    this.screenLoadTimes.set(screenName, loadTime);

    analyticsService.track('screen_load_time', {
      screen_name: screenName,
      load_time: loadTime,
      timestamp: new Date().toISOString(),
    });

    // Track slow screens
    if (loadTime > 2000) {
      analyticsService.track('slow_screen_load', {
        screen_name: screenName,
        load_time: loadTime,
        timestamp: new Date().toISOString(),
      });
    }
  }

  recordAppLaunchTime() {
    const launchTime = Date.now() - this.appStartTime;

    analyticsService.track('app_launch_time', {
      launch_time: launchTime,
      device_type: Device.deviceType,
      device_model: Device.modelName,
      timestamp: new Date().toISOString(),
    });

    return launchTime;
  }

  private recordAppResumeTime() {
    analyticsService.track('app_resumed', {
      timestamp: new Date().toISOString(),
    });
  }

  private recordAppBackgroundTime() {
    analyticsService.track('app_backgrounded', {
      timestamp: new Date().toISOString(),
    });
  }

  recordAPICall(
    endpoint: string,
    startTime: number,
    success: boolean,
    statusCode?: number,
  ) {
    const responseTime = Date.now() - startTime;

    analyticsService.track('api_call_performance', {
      endpoint,
      response_time: responseTime,
      success,
      status_code: statusCode,
      timestamp: new Date().toISOString(),
    });

    // Track slow API calls
    if (responseTime > 5000) {
      analyticsService.track('slow_api_call', {
        endpoint,
        response_time: responseTime,
        timestamp: new Date().toISOString(),
      });
    }
  }

  recordUserInteraction(action: string, elementId?: string) {
    analyticsService.track('user_interaction', {
      action,
      element_id: elementId,
      timestamp: new Date().toISOString(),
    });
  }

  recordError(error: Error, context?: string) {
    analyticsService.track('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  getPerformanceReport(): PerformanceMetrics {
    const avgScreenLoadTime =
      Array.from(this.screenLoadTimes.values()).reduce(
        (acc, time) => acc + time,
        0,
      ) / this.screenLoadTimes.size || 0;

    return {
      appLaunchTime: Date.now() - this.appStartTime,
      screenLoadTime: avgScreenLoadTime,
      memoryUsage: this.memoryWarningCount,
    };
  }

  // React Hook for monitoring screen performance
  useScreenPerformance(screenName: string) {
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
      const startTime = startTimeRef.current;

      // Record screen load time when component mounts
      const loadTime = Date.now() - startTime;
      this.recordScreenLoad(screenName, startTime);

      // Cleanup function
      return () => {
        // Record screen exit time
        analyticsService.track('screen_exited', {
          screen_name: screenName,
          time_spent: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      };
    }, [screenName]);
  }
}

// React Hook for easy integration
export const usePerformanceMonitoring = (screenName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const startTime = Date.now();

    // Record screen entry
    analyticsService.track('screen_entered', {
      screen_name: screenName,
      timestamp: new Date().toISOString(),
    });

    // Record screen load time after component has mounted
    const timeoutId = setTimeout(() => {
      monitor.recordScreenLoad(screenName, startTime);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Record time spent on screen
      const timeSpent = Date.now() - startTime;
      analyticsService.track('screen_time_spent', {
        screen_name: screenName,
        time_spent: timeSpent,
        timestamp: new Date().toISOString(),
      });
    };
  }, [screenName]);

  return monitor;
};

// Higher-order component for automatic performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  screenName: string,
): React.ComponentType<P> => {
  return function PerformanceMonitoredComponent(props: P) {
    usePerformanceMonitoring(screenName);
    return React.createElement(WrappedComponent, props);
  };
};

export default PerformanceMonitor.getInstance();
