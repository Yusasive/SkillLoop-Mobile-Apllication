import { useEffect, useState } from 'react';
import Environment from '@/services/EnvironmentService';

interface EnvironmentValidation {
  isValid: boolean;
  missingKeys: string[];
  isLoading: boolean;
  error: string | null;
}

export const useEnvironmentValidation = (): EnvironmentValidation => {
  const [validation, setValidation] = useState<EnvironmentValidation>({
    isValid: false,
    missingKeys: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    try {
      const result = Environment.validateConfig();

      setValidation({
        isValid: result.isValid,
        missingKeys: result.missingKeys,
        isLoading: false,
        error: result.isValid ? null : 'Missing required environment variables',
      });

      if (!result.isValid) {
        console.warn('Missing environment variables:', result.missingKeys);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        missingKeys: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Environment validation failed',
      });
    }
  }, []);

  return validation;
};
