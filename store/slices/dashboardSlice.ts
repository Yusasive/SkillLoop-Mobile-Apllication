import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '@/services/ApiService';
import { Session, Tutor } from '../types';

interface Activity {
  id: string;
  type: 'session_completed' | 'certificate_earned' | 'skill_learned' | 'tutor_rated';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface Progress {
  totalSessions: number;
  completedSessions: number;
  hoursLearned: number;
  skillsLearned: number;
  certificatesEarned: number;
  currentStreak: number;
}

interface DashboardData {
  upcomingSessions: Session[];
  recentActivity: Activity[];
  recommendedTutors: Tutor[];
  progress: Progress;
}

interface DashboardState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  dashboardData: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiService.get('/dashboard');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateSessionStatus: (state, action) => {
      const { sessionId, status } = action.payload;
      if (state.dashboardData?.upcomingSessions) {
        const session = state.dashboardData.upcomingSessions.find(s => s.id === sessionId);
        if (session) {
          session.status = status;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateSessionStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;