import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Search, Calendar, Award, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  onPress: () => void;
}

export const QuickActions: React.FC = () => {
  const colorScheme = useColorScheme();

  const handleActionPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  const quickActions: QuickAction[] = [
    {
      id: 'find_tutor',
      title: 'Find Tutor',
      icon: Search,
      color: '#3b82f6',
      onPress: () => {
        // Navigate to discover tab
      },
    },
    {
      id: 'book_session',
      title: 'Book Session',
      icon: Calendar,
      color: '#10b981',
      onPress: () => {
        // Open book session modal
      },
    },
    {
      id: 'certificates',
      title: 'Certificates',
      icon: Award,
      color: '#f59e0b',
      onPress: () => {
        // Navigate to certificates tab
      },
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      color: '#8b5cf6',
      onPress: () => {
        // Open messages
      },
    },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => handleActionPress(action.onPress)}
              activeOpacity={0.8}
            >
              <IconComponent size={28} color="#ffffff" strokeWidth={2} />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});