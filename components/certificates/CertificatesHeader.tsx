import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Grid, List, Filter } from 'lucide-react-native';

interface CertificatesHeaderProps {
  onViewModeChange: (mode: 'grid' | 'list') => void;
  currentViewMode: 'grid' | 'list';
  certificateCount: number;
}

export const CertificatesHeader: React.FC<CertificatesHeaderProps> = ({
  onViewModeChange,
  currentViewMode,
  certificateCount,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>My Certificates</Text>
        <Text style={styles.subtitle}>{certificateCount} certificates earned</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Filter size={20} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              currentViewMode === 'grid' && styles.activeToggle,
            ]}
            onPress={() => onViewModeChange('grid')}
          >
            <Grid size={18} color={currentViewMode === 'grid' ? '#ffffff' : '#6b7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              currentViewMode === 'list' && styles.activeToggle,
            ]}
            onPress={() => onViewModeChange('list')}
          >
            <List size={18} color={currentViewMode === 'list' ? '#ffffff' : '#6b7280'} />
          </TouchableOpacity>
        </View>
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
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
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
});