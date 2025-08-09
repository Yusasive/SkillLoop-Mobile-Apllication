import { AccessibilityInfo, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export interface AccessibilitySettings {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isHighContrastEnabled: boolean;
  preferredContentSizeCategory: string;
}

export interface AccessibilityAnnouncement {
  message: string;
  priority: 'low' | 'medium' | 'high';
  interrupt?: boolean;
}

class AccessibilityService {
  private settings: AccessibilitySettings = {
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isHighContrastEnabled: false,
    preferredContentSizeCategory: 'medium',
  };

  private soundObject: Audio.Sound | null = null;
  private announcementQueue: AccessibilityAnnouncement[] = [];
  private isProcessingAnnouncements = false;

  // Store subscriptions so we can clean them up
  private subscriptions: { remove: () => void }[] = [];

  constructor() {
    this.initializeAccessibility();
  }

  private async initializeAccessibility() {
    try {
      const isScreenReaderEnabled =
        await AccessibilityInfo.isScreenReaderEnabled();
      const isReduceMotionEnabled =
        await AccessibilityInfo.isReduceMotionEnabled();
      const isReduceTransparencyEnabled =
        await AccessibilityInfo.isReduceTransparencyEnabled();

      this.settings = {
        ...this.settings,
        isScreenReaderEnabled,
        isReduceMotionEnabled,
        isReduceTransparencyEnabled,
      };

      // Updated event listener usage
      this.subscriptions.push(
        AccessibilityInfo.addEventListener(
          'screenReaderChanged',
          this.handleScreenReaderChange,
        ),
      );
      this.subscriptions.push(
        AccessibilityInfo.addEventListener(
          'reduceMotionChanged',
          this.handleReduceMotionChange,
        ),
      );
      this.subscriptions.push(
        AccessibilityInfo.addEventListener(
          'reduceTransparencyChanged',
          this.handleReduceTransparencyChange,
        ),
      );

      console.log('Accessibility service initialized:', this.settings);
    } catch (error) {
      console.error('Failed to initialize accessibility service:', error);
    }
  }

  private handleScreenReaderChange = (isEnabled: boolean) => {
    this.settings.isScreenReaderEnabled = isEnabled;
    this.announceToScreenReader(
      'Screen reader ' + (isEnabled ? 'enabled' : 'disabled'),
    );
  };

  private handleReduceMotionChange = (isEnabled: boolean) => {
    this.settings.isReduceMotionEnabled = isEnabled;
  };

  private handleReduceTransparencyChange = (isEnabled: boolean) => {
    this.settings.isReduceTransparencyEnabled = isEnabled;
  };

  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  isScreenReaderEnabled(): boolean {
    return this.settings.isScreenReaderEnabled;
  }

  shouldReduceMotion(): boolean {
    return this.settings.isReduceMotionEnabled;
  }

  shouldReduceTransparency(): boolean {
    return this.settings.isReduceTransparencyEnabled;
  }

  announceToScreenReader(
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    interrupt: boolean = false,
  ) {
    if (!this.settings.isScreenReaderEnabled) return;

    const announcement: AccessibilityAnnouncement = {
      message,
      priority,
      interrupt,
    };

    if (interrupt || priority === 'high') {
      this.announcementQueue.unshift(announcement);
    } else {
      this.announcementQueue.push(announcement);
    }

    this.processAnnouncementQueue();
  }

  private async processAnnouncementQueue() {
    if (this.isProcessingAnnouncements || this.announcementQueue.length === 0) {
      return;
    }

    this.isProcessingAnnouncements = true;

    while (this.announcementQueue.length > 0) {
      const announcement = this.announcementQueue.shift();
      if (announcement) {
        await this.makeAnnouncement(announcement);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    this.isProcessingAnnouncements = false;
  }

  private async makeAnnouncement(announcement: AccessibilityAnnouncement) {
    try {
      AccessibilityInfo.announceForAccessibility(announcement.message);
    } catch (error) {
      console.error('Failed to make accessibility announcement:', error);
    }
  }

  async provideHapticFeedback(
    type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'medium',
  ) {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          break;
        case 'error':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
          break;
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  async playAudioFeedback(
    type: 'click' | 'success' | 'error' | 'notification',
  ) {
    try {
      const soundMap = {
        click: require('../../assets/sounds/click.mp3'),
        success: require('../../assets/sounds/success.mp3'),
        error: require('../../assets/sounds/error.mp3'),
        notification: require('../../assets/sounds/notification.mp3'),
      };

      if (this.soundObject) {
        await this.soundObject.unloadAsync();
      }

      // Uncomment to enable audio
      this.soundObject = new Audio.Sound();
      await this.soundObject.loadAsync(soundMap[type]);
      await this.soundObject.playAsync();
    } catch (error) {
      console.error('Audio feedback failed:', error);
    }
  }

  generateAccessibilityLabel(
    label: string,
    value?: string,
    hint?: string,
  ): string {
    let accessibilityLabel = label;

    if (value) {
      accessibilityLabel += `, ${value}`;
    }

    if (hint) {
      accessibilityLabel += `. ${hint}`;
    }

    return accessibilityLabel;
  }

  getAccessibilityRole(elementType: string): string {
    const roleMap: { [key: string]: string } = {
      button: 'button',
      link: 'link',
      image: 'image',
      text: 'text',
      header: 'header',
      list: 'list',
      listItem: 'listitem',
      tab: 'tab',
      tabList: 'tablist',
      search: 'search',
      progressBar: 'progressbar',
      slider: 'slider',
      switch: 'switch',
      checkbox: 'checkbox',
      radio: 'radio',
      textInput: 'textbox',
    };

    return roleMap[elementType] || 'none';
  }

  setAccessibilityFocus(ref: any) {
    if (this.settings.isScreenReaderEnabled && ref?.current) {
      AccessibilityInfo.setAccessibilityFocus(ref.current);
    }
  }

  getContrastRatio(color1: string, color2: string): number {
    return 4.5; // Placeholder
  }

  ensureMinimumContrast(foreground: string, background: string): string {
    const contrastRatio = this.getContrastRatio(foreground, background);
    const minimumRatio = 4.5;

    if (contrastRatio < minimumRatio) {
      return this.settings.isHighContrastEnabled ? '#000000' : foreground;
    }

    return foreground;
  }

  getScaledFontSize(baseFontSize: number): number {
    const scaleFactors: { [key: string]: number } = {
      'extra-small': 0.8,
      small: 0.9,
      medium: 1.0,
      large: 1.1,
      'extra-large': 1.2,
      'extra-extra-large': 1.3,
      'extra-extra-extra-large': 1.4,
    };

    const scaleFactor =
      scaleFactors[this.settings.preferredContentSizeCategory] || 1.0;
    return baseFontSize * scaleFactor;
  }

  cleanup() {
    // Remove subscriptions
    this.subscriptions.forEach((sub) => sub.remove());
    this.subscriptions = [];

    if (this.soundObject) {
      this.soundObject.unloadAsync();
    }
  }
}

export default new AccessibilityService();
