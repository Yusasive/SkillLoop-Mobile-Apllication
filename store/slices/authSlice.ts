import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@/services/AuthService';
import { WalletService } from '@/services/WalletService';

interface User {
  id: string;
  walletAddress: string;
  email?: string;
  name: string;
  avatar?: string;
  bio?: string;
  teachingSkills: string[];
  learningSkills: string[];
  rating: number;
  completedSessions: number;
  joinedDate: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  biometricEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
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
      return rejectWithValue(error.message);
    }
  }
);

export const enableBiometrics = createAsyncThunk(
  'auth/enableBiometrics',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.enableBiometricAuth();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authenticateWithBiometrics = createAsyncThunk(
  'auth/authenticateWithBiometrics',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.authenticateWithBiometrics();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await AuthService.updateProfile(profileData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
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
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;