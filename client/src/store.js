import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account';

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});
