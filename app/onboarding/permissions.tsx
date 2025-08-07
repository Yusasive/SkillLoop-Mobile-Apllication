import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Camera, Mic, CheckCircle, X } from 'lucide-react-native';
import { NotificationService } from '@/services/NotificationService';

interface Permission {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  required: boolean;
  granted: boolean;
}

export default function PermissionsScreen() {
  const colorScheme = useColorScheme();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Get notified about session updates, messages, and important events',
      required: false,
      granted: false,
    },
    {
      id: 'camera',
      icon: Camera,
      title: 'Camera Access',
      description: 'Take photos for your profile and share content during sessions',
      required: false,
      granted: false,
    },
    {
      id: 'microphone',
      icon: Mic,
      title: 'Microphone Access',
      description: 'Enable audio communication during video learning sessions',
      required: true,
      granted: false,
    },
  ]);

  const requestPermission = async (permissionId: string) => {
    try {
      let granted = false;
      
      switch (permissionId) {
        case 'notifications':
          const token = await NotificationService.setupPushNotifications();
          granted = !!token;
          break;
        case 'camera':
          // Request camera permission
          granted = true; // Placeholder
          break;
        case 'microphone':
          // Request microphone permission
          granted = true; // Placeholder
          break;
      }

      setPermissions(prev => 
        prev.map(p => 
          p.id === permissionId ? { ...p, granted } : p
        )
      );
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const allRequiredGranted = permissions
    .filter(p => p.required)
    .every(p => p.granted);

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
        <Text style={styles.stepText}>4 of 4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>App Permissions</Text>
        <Text style={styles.description}>
          SkillLoop needs these permissions to provide the best learning experience
        </Text>

        <View style={styles.permissionsContainer}>
          {permissions.map((permission) => {
            const IconComponent = permission.icon;
            return (
              <View key={permission.id} style={styles.permissionCard}>
                <View style={styles.permissionHeader}>
                  <View style={styles.permissionIcon}>
                    <IconComponent size={24} color="#3b82f6" />
                  </View>
                  <View style={styles.permissionInfo}>
                    <View style={styles.permissionTitleRow}>
                      <Text style={styles.permissionTitle}>{permission.title}</Text>
                      {permission.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.permissionDescription}>
                      {permission.description}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.permissionButton,
                    permission.granted && styles.grantedButton,
                  ]}
                  onPress={() => requestPermission(permission.id)}
                  disabled={permission.granted}
                >
                  {permission.granted ? (
                    <>
                      <CheckCircle size={16} color="#ffffff" />
                      <Text style={styles.grantedButtonText}>Granted</Text>
                    </>
                  ) : (
                    <Text style={styles.permissionButtonText}>Allow</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            You can change these permissions later in your device settings
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !allRequiredGranted && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!allRequiredGranted}
        >
          <Text style={styles.continueButtonText}>Start Learning</Text>
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
    paddingTop: 20,
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
  permissionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  permissionCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  requiredBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  requiredText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  permissionDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  grantedButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    gap: 6,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  grantedButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
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