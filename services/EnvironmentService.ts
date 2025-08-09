import Constants from 'expo-constants';

interface Environment {
  API_URL: string;
  APP_URL: string;
  RPC_URL: string;
  ESCROW_CONTRACT_ADDRESS: string;
  CERTIFICATE_CONTRACT_ADDRESS: string;
  SKL_CONTRACT_ADDRESS: string;
  WALLETCONNECT_PROJECT_ID: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  SENTRY_DSN?: string;
  ANALYTICS_API_KEY?: string;
}

class EnvironmentService {
  private static instance: EnvironmentService;
  private config: Environment;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  private loadConfig(): Environment {
    const expoConfig = Constants.expoConfig?.extra || {};

    return {
      API_URL:
        process.env.EXPO_PUBLIC_API_URL ||
        expoConfig.API_URL ||
        'https://api.skillloop.app',
      APP_URL:
        process.env.EXPO_PUBLIC_APP_URL ||
        expoConfig.APP_URL ||
        'https://skillloop.app',
      RPC_URL: process.env.EXPO_PUBLIC_RPC_URL || expoConfig.RPC_URL || '',
      ESCROW_CONTRACT_ADDRESS:
        process.env.EXPO_PUBLIC_ESCROW_CONTRACT_ADDRESS ||
        expoConfig.ESCROW_CONTRACT_ADDRESS ||
        '',
      CERTIFICATE_CONTRACT_ADDRESS:
        process.env.EXPO_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS ||
        expoConfig.CERTIFICATE_CONTRACT_ADDRESS ||
        '',
      SKL_CONTRACT_ADDRESS:
        process.env.EXPO_PUBLIC_SKL_CONTRACT_ADDRESS ||
        expoConfig.SKL_CONTRACT_ADDRESS ||
        '',
      WALLETCONNECT_PROJECT_ID:
        process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ||
        expoConfig.WALLETCONNECT_PROJECT_ID ||
        '',
      ENVIRONMENT: (process.env.EXPO_PUBLIC_ENVIRONMENT ||
        expoConfig.ENVIRONMENT ||
        'development') as Environment['ENVIRONMENT'],
      SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || expoConfig.SENTRY_DSN,
      ANALYTICS_API_KEY:
        process.env.EXPO_PUBLIC_ANALYTICS_API_KEY ||
        expoConfig.ANALYTICS_API_KEY,
    };
  }

  get(key: keyof Environment): string {
    const value = this.config[key];
    if (!value && this.isRequired(key)) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value || '';
  }

  getAll(): Environment {
    return { ...this.config };
  }

  isDevelopment(): boolean {
    return this.config.ENVIRONMENT === 'development';
  }

  isProduction(): boolean {
    return this.config.ENVIRONMENT === 'production';
  }

  isStaging(): boolean {
    return this.config.ENVIRONMENT === 'staging';
  }

  private isRequired(key: keyof Environment): boolean {
    const requiredKeys: (keyof Environment)[] = [
      'API_URL',
      'RPC_URL',
      'ESCROW_CONTRACT_ADDRESS',
      'CERTIFICATE_CONTRACT_ADDRESS',
      'SKL_CONTRACT_ADDRESS',
      'WALLETCONNECT_PROJECT_ID',
    ];
    return requiredKeys.includes(key);
  }

  validateConfig(): { isValid: boolean; missingKeys: string[] } {
    const requiredKeys: (keyof Environment)[] = [
      'API_URL',
      'RPC_URL',
      'ESCROW_CONTRACT_ADDRESS',
      'CERTIFICATE_CONTRACT_ADDRESS',
      'SKL_CONTRACT_ADDRESS',
      'WALLETCONNECT_PROJECT_ID',
    ];

    const missingKeys = requiredKeys.filter((key) => !this.config[key]);

    return {
      isValid: missingKeys.length === 0,
      missingKeys,
    };
  }
}

export const Environment = EnvironmentService.getInstance();
export default Environment;
