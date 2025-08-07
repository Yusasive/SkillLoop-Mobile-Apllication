import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Search, Calendar, Award, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const tutorialSteps = [
  {
    icon: Search,
    title: 'Discover Tutors',
    description: 'Browse through verified tutors and find the perfect match for your learning goals.',
    color: '#3b82f6',
  },
  {
    icon: Calendar,
    title: 'Book Sessions',
    description: 'Schedule learning sessions at your convenience with flexible timing options.',
    color: '#10b981',
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Complete sessions and mint NFT certificates to showcase your achievements.',
    color: '#f59e0b',
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Connect with learners and tutors in our decentralized learning ecosystem.',
    color: '#8b5cf6',
  },
];

export default function TutorialScreen() {
  const colorScheme = useColorScheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/onboarding/permissions');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/permissions');
  };

  const currentTutorial = tutorialSteps[currentStep];
  const IconComponent = currentTutorial.icon;

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {tutorialSteps.length}
          </Text>
        </View>

        <View style={styles.tutorialContent}>
          <View style={[styles.iconContainer, { backgroundColor: currentTutorial.color + '20' }]}>
            <IconComponent size={64} color={currentTutorial.color} />
          </View>

          <Text style={styles.tutorialTitle}>{currentTutorial.title}</Text>
          <Text style={styles.tutorialDescription}>{currentTutorial.description}</Text>
        </View>

        <View style={styles.dotsContainer}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#ffffff" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
  skipText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: 48,
  },
  progressBar: {
    height: 4,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  },
  tutorialContent: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  tutorialDescription: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isDark ? '#374151' : '#d1d5db',
  },
  activeDot: {
    backgroundColor: '#3b82f6',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});