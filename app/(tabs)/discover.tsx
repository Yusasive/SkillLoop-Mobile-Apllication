import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, useColorScheme, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { SearchHeader } from '@/components/discover/SearchHeader';
import { FilterTabs } from '@/components/discover/FilterTabs';
import { TutorGrid } from '@/components/discover/TutorGrid';
import { TutorCards } from '@/components/discover/TutorCards';
import { FilterModal } from '@/components/discover/FilterModal';
import { RootState } from '@/store';
import { searchTutors, setFilters } from '@/store/slices/discoverSlice';
import AccessibilityService from '@/services/AccessibilityService';
import { AnalyticsService } from '@/services/AnalyticsService';

const analyticsService = AnalyticsService.getInstance();

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { tutors, loading, filters, searchQuery } = useSelector(
    (state: RootState) => state.discover,
  );

  useEffect(() => {
    dispatch(searchTutors() as any);

    // Track screen view
    analyticsService.track('screen_viewed', {
      screen_name: 'discover',
      timestamp: new Date().toISOString(),
    });
  }, [filters, searchQuery, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Provide haptic feedback
    await AccessibilityService.provideHapticFeedback('light');

    // Announce refresh for accessibility
    AccessibilityService.announceToScreenReader('Refreshing tutors list');

    // Track refresh action
    analyticsService.track('discover_refreshed', {
      timestamp: new Date().toISOString(),
      filters: filters,
    });

    try {
      await dispatch(searchTutors() as any);
    } finally {
      setRefreshing(false);
      AccessibilityService.announceToScreenReader('Tutors list updated');
    }
  }, [dispatch, filters]);

  const handleViewModeChange = (mode: 'grid' | 'cards') => {
    setViewMode(mode);

    // Track view mode change
    analyticsService.track('discover_view_mode_changed', {
      view_mode: mode,
      timestamp: new Date().toISOString(),
    });

    // Announce view mode change
    AccessibilityService.announceToScreenReader(`Switched to ${mode} view`);
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        onSearch={(query) => dispatch(searchTutors({ query }) as any)}
        onFilterPress={() => setShowFilters(true)}
        onViewModeChange={handleViewModeChange}
        currentViewMode={viewMode}
      />

      <FilterTabs
        activeFilter={filters.category}
        onFilterChange={(category) => dispatch(setFilters({ category }))}
      />

      <View style={styles.content}>
        {viewMode === 'grid' ? (
          <TutorGrid
            tutors={tutors}
            loading={loading}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                colors={['#3b82f6']}
                progressBackgroundColor={
                  colorScheme === 'dark' ? '#1f2937' : '#ffffff'
                }
              />
            }
          />
        ) : (
          <TutorCards
            tutors={tutors}
            loading={loading}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                colors={['#3b82f6']}
                progressBackgroundColor={
                  colorScheme === 'dark' ? '#1f2937' : '#ffffff'
                }
              />
            }
          />
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

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
  });
