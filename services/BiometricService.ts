import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export class BiometricService {
  private static readonly BIOMETRIC_KEY = 'skillloop_biometric_enabled';
  private static readonly AUTH_TOKEN_KEY = 'skillloop_auth_token';

  static async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async getSupportedTypes(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }

  static async authenticate(
    reason: string = 'Authenticate to access SkillLoop',
  ): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  static async enableBiometric(): Promise<void> {
    await SecureStore.setItemAsync(this.BIOMETRIC_KEY, 'true');
  }

  static async disableBiometric(): Promise<void> {
    await SecureStore.deleteItemAsync(this.BIOMETRIC_KEY);
  }

  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.BIOMETRIC_KEY);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  static async authenticateForAppAccess(): Promise<boolean> {
    const isBiometricEnabled = await this.isBiometricEnabled();
    const isAvailable = await this.isAvailable();

    if (!isBiometricEnabled || !isAvailable) {
      return true; // Skip biometric if not enabled or available
    }

    return await this.authenticate('Unlock SkillLoop');
  }

  static async storeAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token);
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.AUTH_TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  static async clearAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync(this.AUTH_TOKEN_KEY);
  }

  static async authenticateForAppAccess(): Promise<boolean> {
    const isBiometricEnabled = await this.isBiometricEnabled();
    const isAvailable = await this.isAvailable();

    if (!isBiometricEnabled || !isAvailable) {
      return true; // Skip biometric if not enabled or available
    }

    return await this.authenticate('Unlock SkillLoop');
  }
}
