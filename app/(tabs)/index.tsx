import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { HomeHeader } from '@/components/home/HomeHeader';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentActivity } from '@/components/home/RecentActivity';
import { UpcomingSessions } from '@/components/home/UpcomingSessions';
import { RecommendedTutors } from '@/components/home/RecommendedTutors';
import { LearningProgress } from '@/components/home/LearningProgress';
import { RootState } from '@/store';
import { fetchDashboardData } from '@/store/slices/dashboardSlice';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dashboardData, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData() as any);
    }
  }, [user, dispatch]);

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader />
        <QuickActions />
        <UpcomingSessions sessions={dashboardData?.upcomingSessions || []} />
        <LearningProgress progress={dashboardData?.progress} />
        <RecentActivity activities={dashboardData?.recentActivity || []} />
        <RecommendedTutors tutors={dashboardData?.recommendedTutors || []} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});