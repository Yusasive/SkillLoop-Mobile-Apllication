import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ScrollView, TextInput } from 'react-native';
import { X, Wallet, Send, TrendingUp, Plus, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

interface WalletData {
  address: string;
  sklBalance: string;
  ethBalance: string;
  transactions: any[];
  connectedWallets: string[];
}

interface WalletModalProps {
  visible: boolean;
  onClose: () => void;
  walletData: WalletData | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  visible,
  onClose,
  walletData,
}) => {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const copyAddress = async () => {
    if (walletData?.address) {
      await Clipboard.setStringAsync(walletData.address);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Wallet },
    { id: 'send' as const, label: 'Send', icon: Send },
    { id: 'history' as const, label: 'History', icon: TrendingUp },
  ];

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
          <Text style={styles.title}>Wallet</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <IconComponent 
                  size={20} 
                  color={activeTab === tab.id ? '#3b82f6' : (colorScheme === 'dark' ? '#9ca3af' : '#6b7280')} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && walletData && (
            <View style={styles.overviewContent}>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceTitle}>Total Balance</Text>
                <View style={styles.balances}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceAmount}>
                      {parseFloat(walletData.sklBalance).toFixed(2)}
                    </Text>
                    <Text style={styles.balanceToken}>SKL</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceAmount}>
                      {parseFloat(walletData.ethBalance).toFixed(4)}
                    </Text>
                    <Text style={styles.balanceToken}>ETH</Text>
                  </View>
                </View>
              </View>

              <View style={styles.addressCard}>
                <Text style={styles.addressLabel}>Wallet Address</Text>
                <TouchableOpacity style={styles.addressRow} onPress={copyAddress}>
                  <Text style={styles.addressText}>
                    {formatAddress(walletData.address)}
                  </Text>
                  <Copy size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>

              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setActiveTab('send')}
                >
                  <Send size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Send</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Plus size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Add Funds</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'send' && (
            <View style={styles.sendContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recipient Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={sendAddress}
                  onChangeText={setSendAddress}
                  placeholder="0x..."
                  placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount (SKL)</Text>
                <TextInput
                  style={styles.textInput}
                  value={sendAmount}
                  onChangeText={setSendAmount}
                  placeholder="0.00"
                  placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send Tokens</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'history' && (
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Recent Transactions</Text>
              <View style={styles.historyPlaceholder}>
                <Text style={styles.historyPlaceholderText}>
                  Transaction history will appear here
                </Text>
              </View>
            </View>
          )}
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
  placeholder: {
    width: 32,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  overviewContent: {
    paddingVertical: 20,
  },
  balanceCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
  },
  balances: {
    flexDirection: 'row',
    gap: 32,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  balanceToken: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 16,
    color: isDark ? '#ffffff' : '#111827',
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
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendContent: {
    paddingVertical: 20,
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
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContent: {
    paddingVertical: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  historyPlaceholder: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyPlaceholderText: {
    color: isDark ? '#9ca3af' : '#6b7280',
    fontSize: 14,
  },
});