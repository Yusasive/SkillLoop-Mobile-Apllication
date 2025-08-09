import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Wallet, TrendingUp, Send, Plus } from 'lucide-react-native';
import { WalletData } from '@/store/types';

interface WalletSectionProps {
  walletData: WalletData | null;
  onManageWallet: () => void;
}

export const WalletSection: React.FC<WalletSectionProps> = ({ 
  walletData, 
  onManageWallet 
}) => {
  const colorScheme = useColorScheme();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Wallet size={20} color="#3b82f6" />
          <Text style={styles.title}>Wallet</Text>
        </View>
        <TouchableOpacity onPress={onManageWallet}>
          <Text style={styles.manageText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {walletData ? (
        <>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity style={styles.addFundsButton}>
                <Plus size={16} color="#3b82f6" />
                <Text style={styles.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.balances}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceAmount}>{parseFloat(walletData.sklBalance).toFixed(2)}</Text>
                <Text style={styles.balanceToken}>SKL</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceAmount}>{parseFloat(walletData.ethBalance).toFixed(4)}</Text>
                <Text style={styles.balanceToken}>ETH</Text>
              </View>
            </View>
            
            <Text style={styles.walletAddress}>
              {formatAddress(walletData.address)}
            </Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Send size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <TrendingUp size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noWalletCard}>
          <Wallet size={48} color={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'} />
          <Text style={styles.noWalletTitle}>No Wallet Connected</Text>
          <Text style={styles.noWalletText}>
            Connect your wallet to manage tokens and earn certificates
          </Text>
          <TouchableOpacity style={styles.connectButton} onPress={onManageWallet}>
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  manageText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addFundsText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  balances: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  balanceToken: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  walletAddress: {
    fontSize: 12,
    color: isDark ? '#6b7280' : '#9ca3af',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noWalletCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noWalletTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noWalletText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});