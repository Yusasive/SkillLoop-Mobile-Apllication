declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_APP_URL: string;
      EXPO_PUBLIC_RPC_URL: string;
      EXPO_PUBLIC_ESCROW_CONTRACT_ADDRESS: string;
      EXPO_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS: string;
      EXPO_PUBLIC_SKL_CONTRACT_ADDRESS: string;
      EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
      EXPO_PUBLIC_ENVIRONMENT: 'development' | 'staging' | 'production';
      EXPO_PUBLIC_SENTRY_DSN?: string;
      EXPO_PUBLIC_ANALYTICS_API_KEY?: string;
    }
  }
}

export {};