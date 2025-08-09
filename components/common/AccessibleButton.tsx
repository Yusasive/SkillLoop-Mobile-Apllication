import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import AccessibilityService from '../../services/AccessibilityService';

interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  accessibilityHint?: string;
  onPressAnnouncement?: string;
}

const AccessibleButton = forwardRef<TouchableOpacity, AccessibleButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'medium',
      icon,
      iconPosition = 'left',
      loading = false,
      accessibilityHint,
      onPressAnnouncement,
      onPress,
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const colorScheme = useColorScheme();
    const styles = createStyles(colorScheme === 'dark');
    const accessibilitySettings = AccessibilityService.getSettings();

    const handlePress = async (event: any) => {
      if (loading || disabled) return;

      // Provide haptic feedback
      await AccessibilityService.provideHapticFeedback('light');

      // Announce action if specified
      if (onPressAnnouncement) {
        AccessibilityService.announceToScreenReader(onPressAnnouncement);
      }

      onPress?.(event);
    };

    const getButtonStyle = () => {
      const baseStyle = [styles.button, styles[variant], styles[size]];

      if (disabled || loading) {
        baseStyle.push(styles.disabled);
      }

      // High contrast adjustments
      if (accessibilitySettings.isHighContrastEnabled) {
        baseStyle.push(styles.highContrast);
      }

      return baseStyle;
    };

    const getTextStyle = () => {
      const baseTextStyle = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
      ];

      if (disabled || loading) {
        baseTextStyle.push(styles.disabledText);
      }

      return baseTextStyle;
    };

    const accessibilityLabel = AccessibilityService.generateAccessibilityLabel(
      title,
      loading ? 'loading' : undefined,
      accessibilityHint,
    );

    return (
      <TouchableOpacity
        ref={ref}
        style={[getButtonStyle(), style]}
        onPress={handlePress}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        {...props}
      >
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}

          <Text style={getTextStyle()}>{loading ? 'Loading...' : title}</Text>

          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

AccessibleButton.displayName = 'AccessibleButton';

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Variants
    primary: {
      backgroundColor: '#3b82f6',
    },
    secondary: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      borderColor: isDark ? '#6b7280' : '#d1d5db',
    },
    danger: {
      backgroundColor: '#ef4444',
    },
    ghost: {
      backgroundColor: 'transparent',
    },

    // Sizes
    small: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 32,
    },
    medium: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: 44,
    },
    large: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      minHeight: 52,
    },

    // Text styles
    text: {
      fontWeight: '600',
      textAlign: 'center',
    },
    primaryText: {
      color: '#ffffff',
    },
    secondaryText: {
      color: isDark ? '#ffffff' : '#111827',
    },
    dangerText: {
      color: '#ffffff',
    },
    ghostText: {
      color: isDark ? '#ffffff' : '#111827',
    },

    // Text sizes
    smallText: {
      fontSize: 14,
    },
    mediumText: {
      fontSize: 16,
    },
    largeText: {
      fontSize: 18,
    },

    // States
    disabled: {
      opacity: 0.5,
    },
    disabledText: {
      opacity: 0.7,
    },

    // High contrast
    highContrast: {
      borderWidth: 2,
      borderColor: isDark ? '#ffffff' : '#000000',
    },

    // Icons
    iconLeft: {
      marginRight: 8,
    },
    iconRight: {
      marginLeft: 8,
    },
  });

export default AccessibleButton;
