import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'programming', label: 'Programming' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'languages', label: 'Languages' },
  { id: 'music', label: 'Music' },
  { id: 'fitness', label: 'Fitness' },
];

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.tab,
            activeFilter === category.id && styles.activeTab,
          ]}
          onPress={() => onFilterChange(category.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === category.id && styles.activeTabText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});