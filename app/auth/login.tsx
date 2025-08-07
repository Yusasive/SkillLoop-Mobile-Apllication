import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Wallet, Smartphone, GraduationCap, ArrowRight } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { connectWallet, authenticateWithBiometrics } from '@/store/slices/authSlice';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [authenticatingBiometric, setAuthenticatingBiometric] = useState(false);

  const handleWalletConnect = async () => {
    setConnectingWallet(true);
    try {
      await dispatch(connectWallet() as any);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleBiometricAuth = async () => {
    setAuthenticatingBiometric(true);
    try {
      await dispatch(authenticateWithBiometrics() as any);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    } finally {
      setAuthenticatingBiometric(false);
    }
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <GraduationCap size={64} color="#3b82f6" />
          </View>
          <Text style={styles.appName}>SkillLoop</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        <View style={styles.authOptions}>
          <TouchableOpacity 
            style={[styles.authButton, styles.walletButton]}
            onPress={handleWalletConnect}
            disabled={connectingWallet}
          >
            {connectingWallet ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Wallet size={24} color="#ffffff" />
            )}
            <View style={styles.authButtonContent}>
              <Text style={styles.authButtonTitle}>Connect with Wallet</Text>
              <Text style={styles.authButtonSubtitle}>
                Use MetaMask, Trust Wallet, or other Web3 wallets
              </Text>
            </View>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.biometricButton]}
            onPress={handleBiometricAuth}
            disabled={authenticatingBiometric}
          >
            {authenticatingBiometric ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Smartphone size={24} color="#3b82f6" />
            )}
            <View style={styles.authButtonContent}>
              <Text style={[styles.authButtonTitle, styles.biometricTitle]}>
                Use Biometric Authentication
              </Text>
              <Text style={[styles.authButtonSubtitle, styles.biometricSubtitle]}>
                Quick access with Face ID or Touch ID
              </Text>
            </View>
            <ArrowRight size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/onboarding/welcome')}>
          <Text style={styles.newUserText}>
            New to SkillLoop? <Text style={styles.signUpText}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  authOptions: {
    gap: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  walletButton: {
    backgroundColor: '#3b82f6',
  },
  biometricButton: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  authButtonContent: {
    flex: 1,
  },
  authButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  biometricTitle: {
    color: isDark ? '#ffffff' : '#111827',
  },
  authButtonSubtitle: {
    fontSize: 12,
    color: '#e5e7eb',
  },
  biometricSubtitle: {
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  newUserText: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  signUpText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});