import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { rootReducer } from '@/redux/rootReducer';
import { startSignupThunk, verifySignupThunk } from '@/redux/slices/auth/authThunks';
import { setStore } from '@/redux/storeRef';

import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';

describe('signup verification', () => {
  it('does not authenticate after starting registration', async () => {
    server.use(
      http.post(`${TEST_API_BASE_URL}/auth/register`, () =>
        HttpResponse.json({
          status: 'verification_required',
          email: 'new@test.com',
        }),
      ),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);

    await store.dispatch(
      startSignupThunk({
        name: 'New User',
        email: 'new@test.com',
        password: 'SecretPass1',
        role: 'student',
        language: 'en',
        locale: 'en',
      }),
    );

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().user.currentUser).toBeNull();
  });

  it('authenticates after a valid verification code', async () => {
    server.use(
      http.post(`${TEST_API_BASE_URL}/auth/verify-registration`, () =>
        HttpResponse.json({
          user: {
            id: 'u-new',
            email: 'new@test.com',
            name: 'New User',
            role: 'student',
            language: 'en',
          },
        }),
      ),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);

    await store.dispatch(
      verifySignupThunk({
        email: 'new@test.com',
        code: '123456',
      }),
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().user.currentUser?.email).toBe('new@test.com');
  });
});
