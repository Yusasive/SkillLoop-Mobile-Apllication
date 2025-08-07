import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Plus, Calendar, List } from 'lucide-react-native';

interface SessionsHeaderProps {
  onBookSession: () => void;
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  currentViewMode: 'list' | 'calendar';
}

export const SessionsHeader: React.FC<SessionsHeaderProps> = ({
  onBookSession,
  onViewModeChange,
  currentViewMode,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>My Sessions</Text>
        <Text style={styles.subtitle}>Manage your learning sessions</Text>
      </View>
      
      <View style={styles.actions}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              currentViewMode === 'list' && styles.activeToggle,
            ]}
            onPress={() => onViewModeChange('list')}
          >
            <List size={18} color={currentViewMode === 'list' ? '#ffffff' : '#6b7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              currentViewMode === 'calendar' && styles.activeToggle,
            ]}
            onPress={() => onViewModeChange('calendar')}
          >
            <Calendar size={18} color={currentViewMode === 'calendar' ? '#ffffff' : '#6b7280'} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.bookButton} onPress={onBookSession}>
          <Plus size={20} color="#ffffff" />
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
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#3b82f6',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});