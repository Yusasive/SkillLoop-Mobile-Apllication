import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { Bell, Settings } from 'lucide-react-native';
import { RootState } from '@/store';

export const HomeHeader: React.FC = () => {
  const colorScheme = useColorScheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const styles = createStyles(colorScheme === 'dark');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Settings size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});