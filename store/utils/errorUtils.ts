/**
 * Utility functions for Redux slices
 */

/**
 * Safely extracts error message from unknown error type
 * @param error - The error caught in try-catch block
 * @param fallbackMessage - Fallback message if error cannot be extracted
 * @returns string error message
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = 'An unexpected error occurred',
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }

  return fallbackMessage;
};

/**
 * Creates a standardized error handler for async thunks
 * @param error - The error caught in try-catch block
 * @param rejectWithValue - The rejectWithValue function from async thunk
 * @param fallbackMessage - Fallback message if error cannot be extracted
 */
export const handleAsyncError = (
  error: unknown,
  rejectWithValue: any,
  fallbackMessage = 'Operation failed',
) => {
  return rejectWithValue(getErrorMessage(error, fallbackMessage));
};
