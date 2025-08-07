import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ScrollView, TextInput } from 'react-native';
import { X, Camera, Save } from 'lucide-react-native';

interface User {
  id: string;
  walletAddress: string;
  email?: string;
  name: string;
  avatar?: string;
  bio?: string;
  teachingSkills: string[];
  learningSkills: string[];
  rating: number;
  completedSessions: number;
  joinedDate: string;
  isVerified: boolean;
}

interface EditProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // Implement save logic
    console.log('Saving profile:', { name, bio, email });
    onClose();
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
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{name.charAt(0) || 'U'}</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarLabel}>Tap to change photo</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell others about yourself..."
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.walletSection}>
            <Text style={styles.sectionTitle}>Connected Wallet</Text>
            <View style={styles.walletCard}>
              <Text style={styles.walletAddress}>
                {user?.walletAddress ? 
                  `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                  'No wallet connected'
                }
              </Text>
              <TouchableOpacity style={styles.changeWalletButton}>
                <Text style={styles.changeWalletText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  saveButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
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
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#0f172a' : '#f8fafc',
  },
  avatarLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  formSection: {
    marginBottom: 24,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  walletSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 12,
  },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  walletAddress: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontFamily: 'monospace',
  },
  changeWalletButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeWalletText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});