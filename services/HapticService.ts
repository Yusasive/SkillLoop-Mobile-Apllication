import * as Haptics from 'expo-haptics';

export enum HapticType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SELECTION = 'selection',
}

export class HapticService {
  static async trigger(type: HapticType): Promise<void> {
    try {
      switch (type) {
        case HapticType.SUCCESS:
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          break;
        case HapticType.WARNING:
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          );
          break;
        case HapticType.ERROR:
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
          break;
        case HapticType.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case HapticType.MEDIUM:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case HapticType.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case HapticType.SELECTION:
          await Haptics.selectionAsync();
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  static async success(): Promise<void> {
    await this.trigger(HapticType.SUCCESS);
  }

  static async warning(): Promise<void> {
    await this.trigger(HapticType.WARNING);
  }

  static async error(): Promise<void> {
    await this.trigger(HapticType.ERROR);
  }

  static async selection(): Promise<void> {
    await this.trigger(HapticType.SELECTION);
  }

  static async light(): Promise<void> {
    await this.trigger(HapticType.LIGHT);
  }

  static async medium(): Promise<void> {
    await this.trigger(HapticType.MEDIUM);
  }

  static async heavy(): Promise<void> {
    await this.trigger(HapticType.HEAVY);
  }
}
