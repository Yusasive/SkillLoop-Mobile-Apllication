import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, User, Camera } from 'lucide-react-native';

export default function ProfileSetupScreen() {
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design',
    'Digital Marketing', 'Spanish', 'Guitar', 'Photography', 'Yoga'
  ];

  const toggleSkill = (skill: string, type: 'teaching' | 'learning') => {
    if (type === 'teaching') {
      setTeachingSkills(prev => 
        prev.includes(skill) 
          ? prev.filter(s => s !== skill)
          : [...prev, skill]
      );
    } else {
      setLearningSkills(prev => 
        prev.includes(skill) 
          ? prev.filter(s => s !== skill)
          : [...prev, skill]
      );
    }
  };

  const handleContinue = () => {
    // Save profile data
    router.push('/onboarding/tutorial');
  };

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
        <Text style={styles.stepText}>2 of 4</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.description}>
          Tell us about yourself to get personalized tutor recommendations
        </Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{name.charAt(0) || 'U'}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Display Name *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>What can you teach?</Text>
          <View style={styles.skillsGrid}>
            {popularSkills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillTag,
                  teachingSkills.includes(skill) && styles.selectedTeachingSkill,
                ]}
                onPress={() => toggleSkill(skill, 'teaching')}
              >
                <Text style={[
                  styles.skillTagText,
                  teachingSkills.includes(skill) && styles.selectedSkillText,
                ]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>What do you want to learn?</Text>
          <View style={styles.skillsGrid}>
            {popularSkills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillTag,
                  learningSkills.includes(skill) && styles.selectedLearningSkill,
                ]}
                onPress={() => toggleSkill(skill, 'learning')}
              >
                <Text style={[
                  styles.skillTagText,
                  learningSkills.includes(skill) && styles.selectedSkillText,
                ]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !name && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!name}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  stepText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#0f172a' : '#f8fafc',
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: isDark ? '#374151' : '#ffffff',
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  skillsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTeachingSkill: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  selectedLearningSkill: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  skillTagText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  selectedSkillText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});