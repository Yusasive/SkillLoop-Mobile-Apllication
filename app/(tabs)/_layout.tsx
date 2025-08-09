import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Search,
  Calendar,
  Award,
  User,
  FileText,
} from 'lucide-react-native';
import { useColorScheme, Platform } from 'react-native';
import { HapticService } from '@/services/HapticService';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
    borderTopColor: colorScheme === 'dark' ? '#333333' : '#e5e7eb',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 88 : 68,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  };

  const activeColor = '#3b82f6';
  const inactiveColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';

  const handleTabPress = () => {
    HapticService.selection();
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="certificates"
        options={{
          title: 'Certificates',
          tabBarIcon: ({ size, color }) => <Award size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
