import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  Award,
} from 'lucide-react-native';
import { RootState } from '@/store';
import {
  fetchLearningRequests,
  fetchMyLearningRequests,
  LearningRequest,
} from '@/store/slices/learningRequestsSlice';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { HapticService } from '@/services/HapticService';

interface LearningRequestCardProps {
  request: LearningRequest;
  onPress: (request: LearningRequest) => void;
}

const LearningRequestCard: React.FC<LearningRequestCardProps> = ({
  request,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  const handlePress = () => {
    HapticService.selection();
    onPress(request);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#10b981';
      case 'in_bidding':
        return '#f59e0b';
      case 'assigned':
        return '#3b82f6';
      case 'in_progress':
        return '#8b5cf6';
      case 'completed':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.requestCard} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.requestTitle} numberOfLines={2}>
            {request.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {request.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <BookOpen size={14} color="#6b7280" />
            <Text style={styles.metaText}>{request.skill}</Text>
          </View>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: getLevelColor(request.level) },
            ]}
          >
            <Text style={styles.levelText}>{request.level}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {request.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.budgetInfo}>
          <DollarSign size={16} color="#3b82f6" />
          <Text style={styles.budgetText}>
            ${request.budget.min} - ${request.budget.max}{' '}
            {request.budget.currency}
          </Text>
        </View>

        <View style={styles.footerMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#6b7280" />
            <Text style={styles.metaText}>{request.duration}h</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color="#6b7280" />
            <Text style={styles.metaText}>{request.bidsCount} bids</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function LearningRequestsScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests'>(
    'browse',
  );
  const [refreshing, setRefreshing] = useState(false);

  const { requests, myRequests, loading, error } = useSelector(
    (state: RootState) => state.learningRequests,
  );

  useEffect(() => {
    dispatch(fetchLearningRequests() as any);
    dispatch(fetchMyLearningRequests() as any);
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    HapticService.light();

    try {
      if (activeTab === 'browse') {
        await dispatch(fetchLearningRequests() as any);
      } else {
        await dispatch(fetchMyLearningRequests() as any);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleTabChange = (tab: 'browse' | 'my-requests') => {
    HapticService.selection();
    setActiveTab(tab);
  };

  const handleRequestPress = (request: LearningRequest) => {
    // Navigate to request details
    console.log('Navigate to request:', request.id);
  };

  const handleCreateRequest = () => {
    HapticService.medium();
    // Navigate to create request screen
    console.log('Navigate to create request');
  };

  const styles = createStyles(colorScheme === 'dark');

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  const currentRequests = activeTab === 'browse' ? requests : myRequests;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Requests</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search
              size={20}
              color={colorScheme === 'dark' ? '#ffffff' : '#374151'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter
              size={20}
              color={colorScheme === 'dark' ? '#ffffff' : '#374151'}
            />
          </TouchableOpacity>
          {activeTab === 'my-requests' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateRequest}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => handleTabChange('browse')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'browse' && styles.activeTabText,
            ]}
          >
            Browse Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-requests' && styles.activeTab]}
          onPress={() => handleTabChange('my-requests')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'my-requests' && styles.activeTabText,
            ]}
          >
            My Requests
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {currentRequests.length === 0 ? (
          <EmptyState
            icon={activeTab === 'browse' ? Search : Plus}
            title={
              activeTab === 'browse'
                ? 'No Requests Found'
                : 'No Requests Created'
            }
            description={
              activeTab === 'browse'
                ? 'Be the first to discover learning opportunities'
                : 'Create your first learning request to get started'
            }
            actionText={activeTab === 'browse' ? 'Refresh' : 'Create Request'}
            onAction={
              activeTab === 'browse' ? handleRefresh : handleCreateRequest
            }
          />
        ) : (
          <FlatList
            data={currentRequests}
            renderItem={({ item }) => (
              <LearningRequestCard
                request={item}
                onPress={handleRequestPress}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#3b82f6"
                colors={['#3b82f6']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#0f172a',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    searchButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#334155' : '#f1f5f9',
    },
    filterButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#334155' : '#f1f5f9',
    },
    createButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#3b82f6',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#3b82f6',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    activeTabText: {
      color: '#3b82f6',
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    listContainer: {
      padding: 16,
      gap: 16,
    },
    requestCard: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardHeader: {
      marginBottom: 12,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    requestTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#0f172a',
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#ffffff',
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: '#6b7280',
    },
    levelBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    levelText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
      textTransform: 'capitalize',
    },
    description: {
      fontSize: 14,
      color: isDark ? '#cbd5e1' : '#475569',
      lineHeight: 20,
      marginBottom: 16,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    budgetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    budgetText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3b82f6',
    },
    footerMeta: {
      flexDirection: 'row',
      gap: 16,
    },
  });
