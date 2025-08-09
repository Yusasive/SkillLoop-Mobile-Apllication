import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { CreditCard as Edit, Star, Award, Clock } from 'lucide-react-native';
import { User } from '@/store/types';

interface ProfileHeaderProps {
  user: User | null;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  const colorScheme = useColorScheme();

  if (!user) return null;

  const joinedDate = new Date(user.joinedDate).toLocaleDateString([], { 
    month: 'long', 
    year: 'numeric' 
  });

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Award size={16} color="#ffffff" />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.bio && (
            <Text style={styles.userBio} numberOfLines={2}>{user.bio}</Text>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={16} color="#f59e0b" />
              <Text style={styles.statText}>{user.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={16} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Text style={styles.statText}>{user.completedSessions} sessions</Text>
            </View>
          </View>
          
          <Text style={styles.joinedText}>Joined {joinedDate}</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Edit size={20} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#1f2937' : '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  joinedText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
});