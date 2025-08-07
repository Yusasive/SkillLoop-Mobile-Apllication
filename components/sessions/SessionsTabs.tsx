import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';

interface SessionCounts {
  upcoming: number;
  completed: number;
  cancelled: number;
}

interface SessionsTabsProps {
  activeFilter: 'upcoming' | 'completed' | 'cancelled';
  onFilterChange: (filter: 'upcoming' | 'completed' | 'cancelled') => void;
  sessionCounts: SessionCounts;
}

export const SessionsTabs: React.FC<SessionsTabsProps> = ({
  activeFilter,
  onFilterChange,
  sessionCounts,
}) => {
  const colorScheme = useColorScheme();

  const tabs = [
    { id: 'upcoming' as const, label: 'Upcoming', count: sessionCounts.upcoming },
    { id: 'completed' as const, label: 'Completed', count: sessionCounts.completed },
    { id: 'cancelled' as const, label: 'Cancelled', count: sessionCounts.cancelled },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeFilter === tab.id && styles.activeTab,
          ]}
          onPress={() => onFilterChange(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === tab.id && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {tab.count > 0 && (
            <View style={[
              styles.badge,
              activeFilter === tab.id && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeFilter === tab.id && styles.activeBadgeText,
              ]}>
                {tab.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#3b82f6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  activeBadgeText: {
    color: '#ffffff',
  },
});