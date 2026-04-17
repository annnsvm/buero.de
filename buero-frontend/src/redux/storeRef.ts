import type { Store } from '@reduxjs/toolkit';

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
