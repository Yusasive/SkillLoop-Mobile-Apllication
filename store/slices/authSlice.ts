import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../services/AuthService';
import { WalletService } from '../../services/WalletService';
import { handleAsyncError } from '../utils/errorUtils';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  biometricEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  biometricEnabled: false,
};

export const connectWallet = createAsyncThunk(
  'auth/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      const walletAddress = await WalletService.connect();
      const user = await AuthService.authenticateWithWallet(walletAddress);
      return { user, walletAddress };
    } catch (error) {
      return handleAsyncError(
        error,
        rejectWithValue,
        'Failed to connect wallet',
      );
    }
  },
);

export const enableBiometrics = createAsyncThunk(
  'auth/enableBiometrics',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.enableBiometricAuth();
      return true;
    } catch (error) {
      return handleAsyncError(
        error,
        rejectWithValue,
        'Failed to enable biometrics',
      );
    }
  },
);

export const authenticateWithBiometrics = createAsyncThunk(
  'auth/authenticateWithBiometrics',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.authenticateWithBiometrics();
      return user;
    } catch (error) {
      return handleAsyncError(
        error,
        rejectWithValue,
        'Failed to authenticate with biometrics',
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await AuthService.updateProfile(profileData);
      return updatedUser;
    } catch (error) {
      return handleAsyncError(
        error,
        rejectWithValue,
        'Failed to update profile',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.biometricEnabled = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect Wallet
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Set token if available in response
        state.token = action.payload.user.id; // or however your token is structured
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Enable Biometrics
      .addCase(enableBiometrics.fulfilled, (state) => {
        state.biometricEnabled = true;
      })
      // Authenticate with Biometrics
      .addCase(authenticateWithBiometrics.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.token = action.payload.id; // Set token from user data
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
