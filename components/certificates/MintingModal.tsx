import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ActivityIndicator } from 'react-native';
import { X, Award, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { mintCertificate } from '@/store/slices/certificatesSlice';
import { Certificate } from '@/store/types';

interface MintingModalProps {
  visible: boolean;
  certificate: Certificate | null;
  onClose: () => void;
}

export const MintingModal: React.FC<MintingModalProps> = ({
  visible,
  certificate,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [mintingState, setMintingState] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleMint = async () => {
    if (!certificate) return;

    setMintingState('minting');
    try {
      await dispatch(mintCertificate(certificate.id) as any);
      setMintingState('success');
      setTimeout(() => {
        onClose();
        setMintingState('idle');
      }, 2000);
    } catch (error: any) {
      setMintingState('error');
      setErrorMessage(error.message || 'Failed to mint certificate');
    }
  };

  const handleClose = () => {
    if (mintingState !== 'minting') {
      onClose();
      setMintingState('idle');
      setErrorMessage('');
    }
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Mint NFT Certificate</Text>
            {mintingState !== 'minting' && (
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.content}>
            {mintingState === 'idle' && (
              <>
                <View style={styles.certificatePreview}>
                  <Award size={48} color="#f59e0b" />
                  <Text style={styles.certificateTitle}>{certificate?.metadata.title}</Text>
                  <Text style={styles.tutorName}>by {certificate?.tutorName}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>What is NFT Minting?</Text>
                  <Text style={styles.infoText}>
                    Minting converts your certificate into a unique NFT on the blockchain, 
                    providing permanent proof of your achievement that you own and can share.
                  </Text>
                </View>

                <View style={styles.benefitsSection}>
                  <Text style={styles.benefitsTitle}>Benefits:</Text>
                  <Text style={styles.benefitItem}>• Permanent blockchain verification</Text>
                  <Text style={styles.benefitItem}>• Transferable ownership</Text>
                  <Text style={styles.benefitItem}>• Portfolio showcase</Text>
                  <Text style={styles.benefitItem}>• Industry recognition</Text>
                </View>

                <TouchableOpacity style={styles.mintButton} onPress={handleMint}>
                  <Award size={20} color="#ffffff" />
                  <Text style={styles.mintButtonText}>Mint Certificate</Text>
                </TouchableOpacity>
              </>
            )}

            {mintingState === 'minting' && (
              <View style={styles.mintingState}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.mintingTitle}>Minting Your Certificate</Text>
                <Text style={styles.mintingText}>
                  Please wait while we create your NFT certificate on the blockchain...
                </Text>
              </View>
            )}

            {mintingState === 'success' && (
              <View style={styles.successState}>
                <CheckCircle size={64} color="#10b981" />
                <Text style={styles.successTitle}>Certificate Minted!</Text>
                <Text style={styles.successText}>
                  Your certificate has been successfully minted as an NFT. 
                  You can now view it in your collection.
                </Text>
              </View>
            )}

            {mintingState === 'error' && (
              <View style={styles.errorState}>
                <AlertCircle size={64} color="#ef4444" />
                <Text style={styles.errorTitle}>Minting Failed</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleMint}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  closeButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  certificatePreview: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    borderRadius: 12,
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    marginBottom: 4,
  },
  mintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  mintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mintingState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  mintingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  mintingText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});