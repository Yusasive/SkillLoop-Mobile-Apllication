import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { ApiService } from './ApiService';

export class AuthService {
  private static readonly BIOMETRIC_KEY = 'biometric_enabled';
  private static readonly USER_CREDENTIALS_KEY = 'user_credentials';

  static async authenticateWithWallet(walletAddress: string) {
    try {
      const response = await ApiService.post('/auth/wallet', { walletAddress });
      
      // Store authentication token
      await AsyncStorage.setItem('auth_token', response.token);
      
      return response.user;
    } catch (error) {
      throw new Error('Failed to authenticate with wallet');
    }
  }

  static async enableBiometricAuth() {
    try {
      // Check if biometrics are available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        throw new Error('Biometric authentication not available');
      }

      // Authenticate user
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication for SkillLoop',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await AsyncStorage.setItem(this.BIOMETRIC_KEY, 'true');
        return true;
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (error) {
      throw error;
    }
  }

  static async authenticateWithBiometrics() {
    try {
      const biometricEnabled = await AsyncStorage.getItem(this.BIOMETRIC_KEY);
      if (biometricEnabled !== 'true') {
        throw new Error('Biometric authentication not enabled');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access SkillLoop',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Retrieve stored credentials
        const credentials = await SecureStore.getItemAsync(this.USER_CREDENTIALS_KEY);
        if (credentials) {
          const { token } = JSON.parse(credentials);
          await AsyncStorage.setItem('auth_token', token);
          
          // Validate token and get user data
          const user = await ApiService.get('/auth/me');
          return user;
        }
      }
      
      throw new Error('Biometric authentication failed');
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(profileData: any) {
    try {
      const response = await ApiService.patch('/user/profile', profileData);
      return response.user;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  static async logout() {
    try {
      await AsyncStorage.multiRemove([
        'auth_token',
        this.BIOMETRIC_KEY,
      ]);
      await SecureStore.deleteItemAsync(this.USER_CREDENTIALS_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async getStoredToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }
}