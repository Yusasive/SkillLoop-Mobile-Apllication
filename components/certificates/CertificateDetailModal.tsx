import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ScrollView, Share } from 'react-native';
import { X, Award, ExternalLink, Share as ShareIcon, Download } from 'lucide-react-native';

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

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  visible: boolean;
  onClose: () => void;
  onMint: () => void;
}

export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({
  certificate,
  visible,
  onClose,
  onMint,
}) => {
  const colorScheme = useColorScheme();

  if (!certificate) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my ${certificate.metadata.title} certificate from SkillLoop!`,
        url: certificate.nftData ? `https://opensea.io/assets/${certificate.nftData.contractAddress}/${certificate.nftData.tokenId}` : undefined,
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certificate Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <ShareIcon size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.certificatePreview}>
            <View style={styles.certificateIcon}>
              <Award size={64} color="#f59e0b" />
            </View>
            <Text style={styles.certificateTitle}>{certificate.metadata.title}</Text>
            <Text style={styles.tutorName}>Taught by {certificate.tutorName}</Text>
            
            {certificate.isMinted && certificate.nftData && (
              <View style={styles.nftInfo}>
                <Text style={styles.nftLabel}>NFT Certificate</Text>
                <Text style={styles.nftDetails}>
                  Token ID: {certificate.nftData.tokenId}
                </Text>
                <TouchableOpacity style={styles.viewOnChainButton}>
                  <ExternalLink size={16} color="#ffffff" />
                  <Text style={styles.viewOnChainText}>View on OpenSea</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{certificate.metadata.description}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Completion Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Skill:</Text>
              <Text style={styles.detailValue}>{certificate.skill}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Progress:</Text>
              <Text style={styles.detailValue}>{certificate.progress}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Completed:</Text>
              <Text style={styles.detailValue}>
                {new Date(certificate.completedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {certificate.metadata.attributes.length > 0 && (
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Attributes</Text>
              {certificate.metadata.attributes.map((attr, index) => (
                <View key={index} style={styles.attributeRow}>
                  <Text style={styles.attributeLabel}>{attr.trait_type}:</Text>
                  <Text style={styles.attributeValue}>{attr.value}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {!certificate.isMinted && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.mintActionButton} onPress={onMint}>
              <Award size={20} color="#ffffff" />
              <Text style={styles.mintActionText}>Mint as NFT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  certificatePreview: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    marginVertical: 16,
  },
  certificateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? '#374151' : '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  certificateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  tutorName: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
  },
  nftInfo: {
    alignItems: 'center',
    backgroundColor: isDark ? '#065f46' : '#d1fae5',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  nftLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#10b981' : '#047857',
    marginBottom: 4,
  },
  nftDetails: {
    fontSize: 12,
    color: isDark ? '#6ee7b7' : '#059669',
    marginBottom: 12,
  },
  viewOnChainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  viewOnChainText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#111827',
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  attributeLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#111827',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
  },
  mintActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  mintActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mintButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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