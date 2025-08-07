import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import walletSlice from './slices/walletSlice';
import dashboardSlice from './slices/dashboardSlice';
import discoverSlice from './slices/discoverSlice';
import sessionsSlice from './slices/sessionsSlice';
import certificatesSlice from './slices/certificatesSlice';
import notificationsSlice from './slices/notificationsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'wallet'], // Only persist auth and wallet state
};

const rootReducer = combineReducers({
  auth: authSlice,
  wallet: walletSlice,
  dashboard: dashboardSlice,
  discover: discoverSlice,
  sessions: sessionsSlice,
  certificates: certificatesSlice,
  notifications: notificationsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;