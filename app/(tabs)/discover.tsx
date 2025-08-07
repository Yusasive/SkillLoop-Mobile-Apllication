import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { SearchHeader } from '@/components/discover/SearchHeader';
import { FilterTabs } from '@/components/discover/FilterTabs';
import { TutorGrid } from '@/components/discover/TutorGrid';
import { TutorCards } from '@/components/discover/TutorCards';
import { FilterModal } from '@/components/discover/FilterModal';
import { RootState } from '@/store';
import { searchTutors, setFilters } from '@/store/slices/discoverSlice';

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  
  const { tutors, loading, filters, searchQuery } = useSelector(
    (state: RootState) => state.discover
  );

  useEffect(() => {
    dispatch(searchTutors() as any);
  }, [filters, searchQuery, dispatch]);

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader 
        onSearch={(query) => dispatch(searchTutors({ query }) as any)}
        onFilterPress={() => setShowFilters(true)}
        onViewModeChange={setViewMode}
        currentViewMode={viewMode}
      />
      
      <FilterTabs 
        activeFilter={filters.category}
        onFilterChange={(category) => dispatch(setFilters({ category }))}
      />

      <View style={styles.content}>
        {viewMode === 'grid' ? (
          <TutorGrid tutors={tutors} loading={loading} />
        ) : (
          <TutorCards tutors={tutors} loading={loading} />
        )}
      </View>

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={(newFilters) => dispatch(setFilters(newFilters))}
      />
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});