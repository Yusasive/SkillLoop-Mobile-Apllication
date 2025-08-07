import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletService } from '@/services/WalletService';
import { TokenService } from '@/services/TokenService';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'escrow_lock' | 'escrow_release';
  amount: string;
  token: string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  txHash?: string;
  sessionId?: string;
}

interface WalletData {
  address: string;
  sklBalance: string;
  ethBalance: string;
  transactions: Transaction[];
  connectedWallets: string[];
}

interface WalletState {
  walletData: WalletData | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  pendingTransactions: string[];
}

const initialState: WalletState = {
  walletData: null,
  loading: false,
  error: null,
  isConnected: false,
  pendingTransactions: [],
};

export const fetchWalletData = createAsyncThunk(
  'wallet/fetchWalletData',
  async (_, { rejectWithValue }) => {
    try {
      const [balance, transactions] = await Promise.all([
        TokenService.getBalance(),
        TokenService.getTransactionHistory(),
      ]);
      
      return {
        address: WalletService.getConnectedAddress(),
        sklBalance: balance.skl,
        ethBalance: balance.eth,
        transactions,
        connectedWallets: WalletService.getConnectedWallets(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendTokens = createAsyncThunk(
  'wallet/sendTokens',
  async ({ to, amount }: { to: string; amount: string }, { rejectWithValue }) => {
    try {
      const transaction = await TokenService.transfer(to, amount);
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const lockTokensInEscrow = createAsyncThunk(
  'wallet/lockTokensInEscrow',
  async ({ sessionId, amount }: { sessionId: string; amount: string }, { rejectWithValue }) => {
    try {
      const transaction = await TokenService.lockInEscrow(sessionId, amount);
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const releaseEscrowTokens = createAsyncThunk(
  'wallet/releaseEscrowTokens',
  async ({ sessionId }: { sessionId: string }, { rejectWithValue }) => {
    try {
      const transaction = await TokenService.releaseFromEscrow(sessionId);
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    addPendingTransaction: (state, action) => {
      state.pendingTransactions.push(action.payload);
    },
    removePendingTransaction: (state, action) => {
      state.pendingTransactions = state.pendingTransactions.filter(
        id => id !== action.payload
      );
    },
    updateTransactionStatus: (state, action) => {
      const { txHash, status } = action.payload;
      if (state.walletData?.transactions) {
        const transaction = state.walletData.transactions.find(tx => tx.txHash === txHash);
        if (transaction) {
          transaction.status = status;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet Data
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false;
        state.walletData = action.payload;
        state.isConnected = true;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Tokens
      .addCase(sendTokens.fulfilled, (state, action) => {
        if (state.walletData) {
          state.walletData.transactions.unshift(action.payload);
        }
      })
      // Lock Tokens in Escrow
      .addCase(lockTokensInEscrow.fulfilled, (state, action) => {
        if (state.walletData) {
          state.walletData.transactions.unshift(action.payload);
        }
      })
      // Release Escrow Tokens
      .addCase(releaseEscrowTokens.fulfilled, (state, action) => {
        if (state.walletData) {
          state.walletData.transactions.unshift(action.payload);
        }
      });
  },
});

export const { 
  setConnected, 
  addPendingTransaction, 
  removePendingTransaction, 
  updateTransactionStatus,
  clearError 
} = walletSlice.actions;

export default walletSlice.reducer;