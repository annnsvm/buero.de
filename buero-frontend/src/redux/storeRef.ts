import type { Store } from '@reduxjs/toolkit';

/**
 * Розриває циклічну залежність: store → rootReducer → slices → api → store.
 * apiInstance не імпортує `store` напряму, лише звертається до `getStore()` після
 * `configureStore` + `setStore`.
 */
let storeRef: Store | null = null;

export const setStore = (store: Store): void => {
  storeRef = store;
};

export const getStore = (): Store => {
  if (!storeRef) {
    throw new Error('Redux store is not initialized yet');
  }
  return storeRef;
};
