import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Wallet,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { connectWallet } from '@/store/slices/authSlice';

export default function WalletConnectScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnectWallet = async () => {
    setConnecting(true);
    setError('');

    try {
      await dispatch(connectWallet() as any);
      router.push('/onboarding/profile-setup');
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft
            size={24}
            color={colorScheme === 'dark' ? '#ffffff' : '#374151'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Wallet size={64} color="#3b82f6" />
        </View>

        <Text style={styles.title}>Connect Your Wallet</Text>
        <Text style={styles.description}>
          Connect your Web3 wallet to access SkillLoop&apos;s decentralized
          features, earn tokens, and mint NFT certificates.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10b981" />
            <Text style={styles.benefitText}>
              Secure blockchain authentication
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10b981" />
            <Text style={styles.benefitText}>Earn and manage SKL tokens</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10b981" />
            <Text style={styles.benefitText}>Mint NFT certificates</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10b981" />
            <Text style={styles.benefitText}>Decentralized identity</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.connectButton, connecting && styles.connectingButton]}
          onPress={handleConnectWallet}
          disabled={connecting}
        >
          {connecting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Wallet size={20} color="#ffffff" />
          )}
          <Text style={styles.connectButtonText}>
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/onboarding/profile-setup')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
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
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    backButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
      alignItems: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#111827',
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
    },
    benefitsContainer: {
      width: '100%',
      gap: 16,
      marginBottom: 32,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    benefitText: {
      fontSize: 16,
      color: isDark ? '#e5e7eb' : '#374151',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
      padding: 12,
      borderRadius: 8,
      gap: 8,
      width: '100%',
    },
    errorText: {
      fontSize: 14,
      color: '#ef4444',
      flex: 1,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
      gap: 12,
    },
    connectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3b82f6',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    connectingButton: {
      opacity: 0.7,
    },
    connectButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    skipButtonText: {
      fontSize: 16,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
  });
