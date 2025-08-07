import React, { useState } from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { WalletSection } from '@/components/profile/WalletSection';
import { StatsSection } from '@/components/profile/StatsSection';
import { SkillsSection } from '@/components/profile/SkillsSection';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { WalletModal } from '@/components/profile/WalletModal';
import { RootState } from '@/store';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { walletData } = useSelector((state: RootState) => state.wallet);

  const styles = createStyles(colorScheme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader 
          user={user}
          onEditPress={() => setShowEditModal(true)}
        />

        <WalletSection
          walletData={walletData}
          onManageWallet={() => setShowWalletModal(true)}
        />

        <StatsSection user={user} />

        <SkillsSection
          teachingSkills={user?.teachingSkills || []}
          learningSkills={user?.learningSkills || []}
          onEditSkills={() => setShowEditModal(true)}
        />

        <SettingsSection />
      </ScrollView>

      <EditProfileModal
        visible={showEditModal}
        user={user}
        onClose={() => setShowEditModal(false)}
      />

      <WalletModal
        visible={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        walletData={walletData}
      />
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});