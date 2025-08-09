import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  persistCombineReducers,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authSlice from './slices/authSlice';
import walletSlice from './slices/walletSlice';
import dashboardSlice from './slices/dashboardSlice';
import discoverSlice from './slices/discoverSlice';
import sessionsSlice from './slices/sessionsSlice';
import certificatesSlice from './slices/certificatesSlice';
import notificationsSlice from './slices/notificationsSlice';
import learningRequestsSlice from './slices/learningRequestsSlice';
import { baseApi, apiMiddleware } from './api/baseApi';
import offlineSlice from './slices/offlineSlice';

// Individual persist configs for different slices
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'token', 'isAuthenticated'],
};

const walletPersistConfig = {
  key: 'wallet',
  storage: AsyncStorage,
  whitelist: ['walletData', 'isConnected'],
  blacklist: ['loading', 'error'],
};

const sessionsPersistConfig = {
  key: 'sessions',
  storage: AsyncStorage,
  whitelist: ['sessions', 'upcomingSessions'],
  blacklist: ['loading', 'error'],
};

const certificatesPersistConfig = {
  key: 'certificates',
  storage: AsyncStorage,
  whitelist: ['certificates'],
  blacklist: ['loading', 'error', 'mintingCertificates'],
};

const discoverPersistConfig = {
  key: 'discover',
  storage: AsyncStorage,
  whitelist: ['tutors', 'filters'],
  blacklist: ['loading', 'error'],
  transform: [
    {
      // Transform to only persist tutors for a limited time
      in: (inboundState: any) => ({
        ...inboundState,
        lastUpdated: Date.now(),
      }),
      out: (outboundState: any) => {
        const ONE_HOUR = 60 * 60 * 1000;
        if (
          outboundState.lastUpdated &&
          Date.now() - outboundState.lastUpdated > ONE_HOUR
        ) {
          return { ...outboundState, tutors: [] };
        }
        return outboundState;
      },
    },
  ],
};

const learningRequestsPersistConfig = {
  key: 'learningRequests',
  storage: AsyncStorage,
  whitelist: ['myRequests', 'myBids'],
  blacklist: ['requests', 'bids', 'loading', 'error'],
};

const offlinePersistConfig = {
  key: 'offline',
  storage: AsyncStorage,
  whitelist: ['queue', 'isOnline'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  wallet: persistReducer(walletPersistConfig, walletSlice),
  dashboard: dashboardSlice,
  discover: persistReducer(discoverPersistConfig, discoverSlice),
  sessions: persistReducer(sessionsPersistConfig, sessionsSlice),
  certificates: persistReducer(certificatesPersistConfig, certificatesSlice),
  notifications: notificationsSlice,
  learningRequests: persistReducer(
    learningRequestsPersistConfig,
    learningRequestsSlice,
  ),
  offline: persistReducer(offlinePersistConfig, offlineSlice),
  api: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }).concat(apiMiddleware),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
