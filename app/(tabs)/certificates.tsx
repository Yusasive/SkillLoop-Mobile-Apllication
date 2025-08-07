import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { CertificatesHeader } from '@/components/certificates/CertificatesHeader';
import { CertificatesGrid } from '@/components/certificates/CertificatesGrid';
import { CertificateDetailModal } from '@/components/certificates/CertificateDetailModal';
import { MintingModal } from '@/components/certificates/MintingModal';
import { EmptyState } from '@/components/common/EmptyState';
import { RootState } from '@/store';
import { fetchCertificates } from '@/store/slices/certificatesSlice';
import { Award } from 'lucide-react-native';

export default function CertificatesScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showMintingModal, setShowMintingModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { certificates, loading, mintingCertificates } = useSelector(
    (state: RootState) => state.certificates
  );

  useEffect(() => {
    dispatch(fetchCertificates() as any);
  }, [dispatch]);

  const styles = createStyles(colorScheme === 'dark');

  if (!loading && certificates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CertificatesHeader 
          onViewModeChange={setViewMode}
          currentViewMode={viewMode}
          certificateCount={0}
        />
        <EmptyState
          icon={Award}
          title="No Certificates Yet"
          description="Complete learning sessions to earn your first NFT certificate"
          actionText="Browse Tutors"
          onAction={() => {/* Navigate to discover */}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CertificatesHeader 
        onViewModeChange={setViewMode}
        currentViewMode={viewMode}
        certificateCount={certificates.length}
      />

      <View style={styles.content}>
        <CertificatesGrid
          certificates={certificates}
          loading={loading}
          viewMode={viewMode}
          onCertificatePress={setSelectedCertificate}
          mintingCertificates={mintingCertificates}
          onMintPress={(certificate) => {
            setSelectedCertificate(certificate);
            setShowMintingModal(true);
          }}
        />
      </View>

      <CertificateDetailModal
        certificate={selectedCertificate}
        visible={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        onMint={() => setShowMintingModal(true)}
      />

      <MintingModal
        visible={showMintingModal}
        certificate={selectedCertificate}
        onClose={() => setShowMintingModal(false)}
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