import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList, ActivityIndicator } from 'react-native';
import { Award, ExternalLink, Share } from 'lucide-react-native';

interface Certificate {
  id: string;
  sessionId: string;
  tutorName: string;
  skill: string;
  completedAt: string;
  progress: number;
  metadata: {
    title: string;
    description: string;
    image?: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  nftData?: {
    tokenId: string;
    contractAddress: string;
    txHash: string;
    mintedAt: string;
  };
  isMinted: boolean;
}

interface CertificatesGridProps {
  certificates: Certificate[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onCertificatePress: (certificate: Certificate) => void;
  mintingCertificates: string[];
  onMintPress: (certificate: Certificate) => void;
}

export const CertificatesGrid: React.FC<CertificatesGridProps> = ({
  certificates,
  loading,
  viewMode,
  onCertificatePress,
  mintingCertificates,
  onMintPress,
}) => {
  const colorScheme = useColorScheme();

  const renderCertificate = ({ item }: { item: Certificate }) => {
    const isMinting = mintingCertificates.includes(item.id);
    
    if (viewMode === 'list') {
      return (
        <TouchableOpacity 
          style={styles.listItem}
          onPress={() => onCertificatePress(item)}
        >
          <View style={styles.listIconContainer}>
            <Award size={24} color="#f59e0b" />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listTitle}>{item.metadata.title}</Text>
            <Text style={styles.listSubtitle}>by {item.tutorName}</Text>
            <Text style={styles.listDate}>
              Completed {new Date(item.completedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.listActions}>
            {item.isMinted ? (
              <View style={styles.mintedBadge}>
                <Text style={styles.mintedText}>NFT</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.mintButton}
                onPress={() => onMintPress(item)}
                disabled={isMinting}
              >
                {isMinting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.mintButtonText}>Mint</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.gridItem}
        onPress={() => onCertificatePress(item)}
      >
        <View style={styles.certificateCard}>
          <View style={styles.cardHeader}>
            <Award size={32} color="#f59e0b" />
            {item.isMinted && (
              <View style={styles.nftBadge}>
                <Text style={styles.nftBadgeText}>NFT</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.metadata.title}
          </Text>
          <Text style={styles.cardSubtitle}>by {item.tutorName}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.dateText}>
              {new Date(item.completedAt).toLocaleDateString()}
            </Text>
            {!item.isMinted && (
              <TouchableOpacity
                style={styles.mintButton}
                onPress={() => onMintPress(item)}
                disabled={isMinting}
              >
                {isMinting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <ExternalLink size={16} color="#ffffff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = createStyles(colorScheme === 'dark');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading certificates...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={certificates}
      renderItem={renderCertificate}
      keyExtractor={(item) => item.id}
      numColumns={viewMode === 'grid' ? 2 : 1}
      key={viewMode} // Force re-render when view mode changes
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={viewMode === 'grid' ? styles.row : undefined}
    />
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  gridItem: {
    width: '48%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#374151' : '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 4,
  },
  listDate: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  listActions: {
    alignItems: 'flex-end',
  },
  certificateCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nftBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nftBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
  },
  mintButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  mintButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  mintedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mintedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});