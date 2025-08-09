import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { AppInitializer } from '@/components/common/AppInitializer';
import { NotificationManager } from '@/components/common/NotificationManager';
import { usePerformanceMonitoring } from '@/services/PerformanceMonitor';

export default function RootLayout() {
  const envValidation = useFrameworkReady();
  const [servicesInitialized, setServicesInitialized] = useState(false);

  // Monitor performance for the root layout
  usePerformanceMonitoring('app_root');

  if (envValidation.isLoading || !servicesInitialized) {
    return (
      <AppInitializer onInitialized={() => setServicesInitialized(true)}>
        <LoadingScreen />
      </AppInitializer>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NotificationManager>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="session" />
            <Stack.Screen name="tutor" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NotificationManager>
      </PersistGate>
    </Provider>
  );
}
