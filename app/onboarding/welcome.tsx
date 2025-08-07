import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GraduationCap, Users, Award, ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();

  const features = [
    {
      icon: Users,
      title: 'Connect with Expert Tutors',
      description: 'Find verified tutors for any skill you want to learn',
    },
    {
      icon: GraduationCap,
      title: 'Learn at Your Own Pace',
      description: 'Book sessions that fit your schedule and learning style',
    },
    {
      icon: Award,
      title: 'Earn NFT Certificates',
      description: 'Get blockchain-verified certificates for your achievements',
    },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <GraduationCap size={64} color="#3b82f6" />
          </View>
          <Text style={styles.appName}>SkillLoop</Text>
          <Text style={styles.tagline}>Decentralized Peer-to-Peer Learning</Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <IconComponent size={24} color="#3b82f6" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => router.push('/onboarding/wallet-connect')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
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
    paddingTop: 40,
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
  tagline: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  },
  featuresSection: {
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});