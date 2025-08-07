import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '@/services/ApiService';

interface Session {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  studentId: string;
  studentName: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  hourlyRate: string;
  totalAmount: string;
  escrowAmount?: string;
  notes?: string;
  progress?: SessionProgress[];
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionProgress {
  id: string;
  milestone: string;
  completed: boolean;
  completedAt?: string;
}

interface BookingData {
  tutorId: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  notes?: string;
}

interface SessionsState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  bookingLoading: boolean;
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
  error: null,
  bookingLoading: false,
};

export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiService.get('/sessions');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookSession = createAsyncThunk(
  'sessions/bookSession',
  async (bookingData: BookingData, { rejectWithValue }) => {
    try {
      const session = await ApiService.post('/sessions', bookingData);
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSession = createAsyncThunk(
  'sessions/cancelSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await ApiService.patch(`/sessions/${sessionId}/cancel`);
      return sessionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startSession = createAsyncThunk(
  'sessions/startSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const session = await ApiService.patch(`/sessions/${sessionId}/start`);
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeSession = createAsyncThunk(
  'sessions/completeSession',
  async ({ sessionId, progress }: { sessionId: string; progress: SessionProgress[] }, { rejectWithValue }) => {
    try {
      const session = await ApiService.patch(`/sessions/${sessionId}/complete`, { progress });
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rateSession = createAsyncThunk(
  'sessions/rateSession',
  async ({ sessionId, rating, review }: { sessionId: string; rating: number; review?: string }, { rejectWithValue }) => {
    try {
      const session = await ApiService.patch(`/sessions/${sessionId}/rate`, { rating, review });
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateSessionProgress: (state, action) => {
      const { sessionId, progress } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.progress = progress;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Book Session
      .addCase(bookSession.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(bookSession.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.sessions.unshift(action.payload);
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Session
      .addCase(cancelSession.fulfilled, (state, action) => {
        const session = state.sessions.find(s => s.id === action.payload);
        if (session) {
          session.status = 'cancelled';
        }
      })
      // Start Session
      .addCase(startSession.fulfilled, (state, action) => {
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = action.payload;
        }
      })
      // Complete Session
      .addCase(completeSession.fulfilled, (state, action) => {
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = action.payload;
        }
      })
      // Rate Session
      .addCase(rateSession.fulfilled, (state, action) => {
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = action.payload;
        }
      });
  },
});

export const { clearError, updateSessionProgress } = sessionsSlice.actions;
export default sessionsSlice.reducer;