import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '@/services/ApiService';

export interface LearningRequest {
  id: string;
  title: string;
  description: string;
  skill: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  budget: {
    min: number;
    max: number;
    currency: 'SKL' | 'USD';
  };
  duration: number; // in hours
  deadline?: string;
  requirements: string[];
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  status:
    | 'open'
    | 'in_bidding'
    | 'assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  bidsCount: number;
  createdAt: string;
  updatedAt: string;
  assignedTutorId?: string;
  assignedTutorName?: string;
  sessionId?: string;
}

export interface Bid {
  id: string;
  requestId: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  tutorRating: number;
  tutorReviewCount: number;
  proposedRate: number;
  currency: 'SKL' | 'USD';
  estimatedDuration: number;
  proposal: string;
  deliverables: string[];
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  expiresAt?: string;
}

interface LearningRequestsState {
  requests: LearningRequest[];
  myRequests: LearningRequest[];
  bids: Bid[];
  myBids: Bid[];
  loading: boolean;
  error: string | null;
  filters: {
    skill: string;
    category: string;
    level: string;
    budgetRange: [number, number];
  };
}

const initialState: LearningRequestsState = {
  requests: [],
  myRequests: [],
  bids: [],
  myBids: [],
  loading: false,
  error: null,
  filters: {
    skill: '',
    category: '',
    level: '',
    budgetRange: [0, 1000],
  },
};

// Async thunks
export const fetchLearningRequests = createAsyncThunk(
  'learningRequests/fetchLearningRequests',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const data = await ApiService.get('/learning-requests', { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMyLearningRequests = createAsyncThunk(
  'learningRequests/fetchMyLearningRequests',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiService.get('/learning-requests/my-requests');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createLearningRequest = createAsyncThunk(
  'learningRequests/createLearningRequest',
  async (requestData: Partial<LearningRequest>, { rejectWithValue }) => {
    try {
      const data = await ApiService.post('/learning-requests', requestData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateLearningRequest = createAsyncThunk(
  'learningRequests/updateLearningRequest',
  async (
    { id, updates }: { id: string; updates: Partial<LearningRequest> },
    { rejectWithValue },
  ) => {
    try {
      const data = await ApiService.patch(`/learning-requests/${id}`, updates);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteLearningRequest = createAsyncThunk(
  'learningRequests/deleteLearningRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await ApiService.delete(`/learning-requests/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBidsForRequest = createAsyncThunk(
  'learningRequests/fetchBidsForRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const data = await ApiService.get(`/learning-requests/${requestId}/bids`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitBid = createAsyncThunk(
  'learningRequests/submitBid',
  async (bidData: Partial<Bid>, { rejectWithValue }) => {
    try {
      const data = await ApiService.post('/bids', bidData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBid = createAsyncThunk(
  'learningRequests/updateBid',
  async (
    { id, updates }: { id: string; updates: Partial<Bid> },
    { rejectWithValue },
  ) => {
    try {
      const data = await ApiService.patch(`/bids/${id}`, updates);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const acceptBid = createAsyncThunk(
  'learningRequests/acceptBid',
  async (
    { bidId, requestId }: { bidId: string; requestId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await ApiService.post(`/bids/${bidId}/accept`, {
        requestId,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const rejectBid = createAsyncThunk(
  'learningRequests/rejectBid',
  async (bidId: string, { rejectWithValue }) => {
    try {
      const data = await ApiService.post(`/bids/${bidId}/reject`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const learningRequestsSlice = createSlice({
  name: 'learningRequests',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Learning Requests
      .addCase(fetchLearningRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLearningRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch My Learning Requests
      .addCase(fetchMyLearningRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      // Create Learning Request
      .addCase(createLearningRequest.fulfilled, (state, action) => {
        state.myRequests.unshift(action.payload);
        state.requests.unshift(action.payload);
      })
      // Update Learning Request
      .addCase(updateLearningRequest.fulfilled, (state, action) => {
        const index = state.myRequests.findIndex(
          (req) => req.id === action.payload.id,
        );
        if (index !== -1) {
          state.myRequests[index] = action.payload;
        }
        const requestIndex = state.requests.findIndex(
          (req) => req.id === action.payload.id,
        );
        if (requestIndex !== -1) {
          state.requests[requestIndex] = action.payload;
        }
      })
      // Delete Learning Request
      .addCase(deleteLearningRequest.fulfilled, (state, action) => {
        state.myRequests = state.myRequests.filter(
          (req) => req.id !== action.payload,
        );
        state.requests = state.requests.filter(
          (req) => req.id !== action.payload,
        );
      })
      // Fetch Bids
      .addCase(fetchBidsForRequest.fulfilled, (state, action) => {
        state.bids = action.payload;
      })
      // Submit Bid
      .addCase(submitBid.fulfilled, (state, action) => {
        state.myBids.unshift(action.payload);
      })
      // Update Bid
      .addCase(updateBid.fulfilled, (state, action) => {
        const index = state.myBids.findIndex(
          (bid) => bid.id === action.payload.id,
        );
        if (index !== -1) {
          state.myBids[index] = action.payload;
        }
        const bidIndex = state.bids.findIndex(
          (bid) => bid.id === action.payload.id,
        );
        if (bidIndex !== -1) {
          state.bids[bidIndex] = action.payload;
        }
      })
      // Accept/Reject Bid
      .addCase(acceptBid.fulfilled, (state, action) => {
        const { bidId, requestId } = action.meta.arg;
        // Update bid status
        const bidIndex = state.bids.findIndex((bid) => bid.id === bidId);
        if (bidIndex !== -1) {
          state.bids[bidIndex].status = 'accepted';
        }
        // Update request status
        const requestIndex = state.requests.findIndex(
          (req) => req.id === requestId,
        );
        if (requestIndex !== -1) {
          state.requests[requestIndex].status = 'assigned';
        }
      })
      .addCase(rejectBid.fulfilled, (state, action) => {
        const bidIndex = state.bids.findIndex(
          (bid) => bid.id === action.meta.arg,
        );
        if (bidIndex !== -1) {
          state.bids[bidIndex].status = 'rejected';
        }
      });
  },
});

export const { setFilters, clearFilters, clearError } =
  learningRequestsSlice.actions;
export default learningRequestsSlice.reducer;
