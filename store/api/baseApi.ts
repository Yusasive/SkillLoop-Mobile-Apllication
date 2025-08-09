import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import Environment from '../../services/EnvironmentService';

const baseQuery = fetchBaseQuery({
  baseUrl: Environment.get('API_URL'),
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle token refresh or logout
    api.dispatch({ type: 'auth/logout' });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Session',
    'Certificate',
    'Tutor',
    'LearningRequest',
    'Bid',
    'Transaction',
    'Notification',
  ],
  endpoints: () => ({}),
});

export const { middleware: apiMiddleware, reducer: apiReducer } = baseApi;
