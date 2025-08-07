import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { SessionsHeader } from '@/components/sessions/SessionsHeader';
import { SessionsTabs } from '@/components/sessions/SessionsTabs';
import { SessionsList } from '@/components/sessions/SessionsList';
import { SessionCalendar } from '@/components/sessions/SessionCalendar';
import { BookSessionModal } from '@/components/sessions/BookSessionModal';
import { RootState } from '@/store';
import { fetchSessions } from '@/store/slices/sessionsSlice';

type ViewMode = 'list' | 'calendar';
type SessionFilter = 'upcoming' | 'completed' | 'cancelled';

export default function SessionsScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<SessionFilter>('upcoming');
  const [showBookModal, setShowBookModal] = useState(false);

  const { sessions, loading } = useSelector((state: RootState) => state.sessions);

  useEffect(() => {
    dispatch(fetchSessions() as any);
  }, [dispatch]);

  const filteredSessions = sessions.filter(session => {
    switch (activeFilter) {
      case 'upcoming':
        return session.status === 'scheduled' || session.status === 'confirmed';
      case 'completed':
        return session.status === 'completed';
      case 'cancelled':
        return session.status === 'cancelled';
      default:
        return true;
    }
  });

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <SessionsHeader 
        onBookSession={() => setShowBookModal(true)}
        onViewModeChange={setViewMode}
        currentViewMode={viewMode}
      />

      <SessionsTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sessionCounts={{
          upcoming: sessions.filter(s => s.status === 'scheduled' || s.status === 'confirmed').length,
          completed: sessions.filter(s => s.status === 'completed').length,
          cancelled: sessions.filter(s => s.status === 'cancelled').length,
        }}
      />

      <View style={styles.content}>
        {viewMode === 'list' ? (
          <SessionsList sessions={filteredSessions} loading={loading} />
        ) : (
          <SessionCalendar sessions={filteredSessions} />
        )}
      </View>

      <BookSessionModal
        visible={showBookModal}
        onClose={() => setShowBookModal(false)}
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
  },
});