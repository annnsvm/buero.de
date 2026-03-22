import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from './rootReducer';
import { persistConfig } from './persistConfig';
import { setStore } from './storeRef';

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

setStore(store);

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
