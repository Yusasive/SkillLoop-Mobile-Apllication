import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Switch } from 'react-native';
import { 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Smartphone
} from 'lucide-react-native';

export const SettingsSection: React.FC = () => {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          type: 'switch' as const,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: Smartphone,
          label: 'Biometric Authentication',
          type: 'switch' as const,
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          type: 'navigation' as const,
          onPress: () => {},
        },
        {
          icon: Globe,
          label: 'Language',
          type: 'navigation' as const,
          value: 'English',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          icon: Shield,
          label: 'Privacy Settings',
          type: 'navigation' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          type: 'navigation' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: LogOut,
          label: 'Sign Out',
          type: 'navigation' as const,
          onPress: () => {},
          destructive: true,
        },
      ],
    },
  ];

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {settingsGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          
          <View style={styles.groupItems}>
            {group.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
              const isLast = itemIndex === group.items.length - 1;
              
              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    !isLast && styles.settingItemBorder,
                  ]}
                  onPress={item.onPress}
                  disabled={item.type === 'switch'}
                >
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.iconContainer,
                      item.destructive && styles.destructiveIcon,
                    ]}>
                      <IconComponent 
                        size={20} 
                        color={item.destructive ? '#ef4444' : '#3b82f6'} 
                      />
                    </View>
                    <Text style={[
                      styles.settingLabel,
                      item.destructive && styles.destructiveLabel,
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value as boolean}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#374151', true: '#3b82f6' }}
                        thumbColor="#ffffff"
                      />
                    ) : (
                      <View style={styles.navigationRight}>
                        {item.value && (
                          <Text style={styles.settingValue}>{item.value}</Text>
                        )}
                        <ChevronRight 
                          size={16} 
                          color={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'} 
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupItems: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#111827',
  },
  destructiveLabel: {
    color: '#ef4444',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});