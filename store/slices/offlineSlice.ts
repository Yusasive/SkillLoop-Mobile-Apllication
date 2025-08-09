import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import OfflineQueueService, { QueuedAction } from '@/services/OfflineQueueService';

interface OfflineState {
  isOnline: boolean;
  queue: QueuedAction[];
  isProcessing: boolean;
  lastSyncTime: string | null;
}

const initialState: OfflineState = {
  isOnline: true,
  queue: [],
  isProcessing: false,
  lastSyncTime: null,
};

export const syncOfflineActions = createAsyncThunk(
  'offline/syncOfflineActions',
  async (_, { rejectWithValue }) => {
    try {
      const queueService = OfflineQueueService.getInstance();
      const status = queueService.getQueueStatus();
      
      if (status.isOnline && status.queueSize > 0) {
        // Process queue will be handled by the service
        return {
          synced: true,
          syncTime: new Date().toISOString(),
        };
      }
      
      return { synced: false, syncTime: null };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Sync failed');
    }
  }
);

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter(item => item.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncOfflineActions.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(syncOfflineActions.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload.synced) {
          state.lastSyncTime = action.payload.syncTime;
          state.queue = [];
        }
      })
      .addCase(syncOfflineActions.rejected, (state) => {
        state.isProcessing = false;
      });
  },
});

export const { 
  setOnlineStatus, 
  addToQueue, 
  removeFromQueue, 
  clearQueue, 
  setProcessing 
} = offlineSlice.actions;

export default offlineSlice.reducer;