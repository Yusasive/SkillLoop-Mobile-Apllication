import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '@/services/ApiService';

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  isOnline: boolean;
  responseTime: string;
  completedSessions: number;
  languages: string[];
  verified: boolean;
}

interface Filters {
  category: string;
  minRating: number;
  maxRate: number;
  availability: 'any' | 'now' | 'today' | 'week';
  languages: string[];
  verified: boolean;
}

interface DiscoverState {
  tutors: Tutor[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Filters;
  hasMore: boolean;
  page: number;
}

const initialState: DiscoverState = {
  tutors: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: 'all',
    minRating: 0,
    maxRate: 1000,
    availability: 'any',
    languages: [],
    verified: false,
  },
  hasMore: true,
  page: 1,
};

export const searchTutors = createAsyncThunk(
  'discover/searchTutors',
  async (params?: { query?: string; reset?: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { discover: DiscoverState };
      const { filters, page } = state.discover;
      
      const searchParams = {
        query: params?.query || state.discover.searchQuery,
        ...filters,
        page: params?.reset ? 1 : page,
      };
      
      const data = await ApiService.get('/tutors/search', searchParams);
      return { tutors: data.tutors, hasMore: data.hasMore, reset: params?.reset };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadMoreTutors = createAsyncThunk(
  'discover/loadMoreTutors',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { discover: DiscoverState };
      const { filters, searchQuery, page } = state.discover;
      
      const searchParams = {
        query: searchQuery,
        ...filters,
        page: page + 1,
      };
      
      const data = await ApiService.get('/tutors/search', searchParams);
      return { tutors: data.tutors, hasMore: data.hasMore };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Tutors
      .addCase(searchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTutors.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.reset) {
          state.tutors = action.payload.tutors;
          state.page = 1;
        } else {
          state.tutors = [...state.tutors, ...action.payload.tutors];
        }
        state.hasMore = action.payload.hasMore;
      })
      .addCase(searchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load More Tutors
      .addCase(loadMoreTutors.fulfilled, (state, action) => {
        state.tutors = [...state.tutors, ...action.payload.tutors];
        state.hasMore = action.payload.hasMore;
        state.page += 1;
      });
  },
});

export const { setSearchQuery, setFilters, clearFilters, clearError } = discoverSlice.actions;
export default discoverSlice.reducer;