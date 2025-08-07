import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Search, Filter, Grid, List } from 'lucide-react-native';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  onViewModeChange: (mode: 'grid' | 'cards') => void;
  currentViewMode: 'grid' | 'cards';
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  onFilterPress,
  onViewModeChange,
  currentViewMode,
}) => {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tutors, skills..."
            placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Filter size={20} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentViewMode === 'cards' && styles.activeToggle,
          ]}
          onPress={() => onViewModeChange('cards')}
        >
          <List size={18} color={currentViewMode === 'cards' ? '#ffffff' : '#6b7280'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentViewMode === 'grid' && styles.activeToggle,
          ]}
          onPress={() => onViewModeChange('grid')}
        >
          <Grid size={18} color={currentViewMode === 'grid' ? '#ffffff' : '#6b7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#111827',
  },
  filterButton: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    padding: 12,
    borderRadius: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 8,
    padding: 2,
    alignSelf: 'flex-end',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#3b82f6',
  },
});