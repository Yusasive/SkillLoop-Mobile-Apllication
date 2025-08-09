import { useEffect } from 'react';
import { useEnvironmentValidation } from './useEnvironmentValidation';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const envValidation = useEnvironmentValidation();

  useEffect(() => {
    if (__DEV__ && !envValidation.isLoading && !envValidation.isValid) {
      console.warn('⚠️  Environment Configuration Issues:');
      console.warn('Missing environment variables:', envValidation.missingKeys);
      console.warn('Please check your .env file configuration');
    }

    window.frameworkReady?.();
  }, [envValidation]);

  return envValidation;
}
