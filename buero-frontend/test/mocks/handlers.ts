import { http, HttpResponse } from 'msw';

import { TEST_API_BASE_URL } from '../constants';

export const defaultHandlers = [
  http.get(`${TEST_API_BASE_URL}/courses`, () => HttpResponse.json([])),
  http.get(`${TEST_API_BASE_URL}/courses/manage`, () => HttpResponse.json([])),
  http.get(`${TEST_API_BASE_URL}/courses/me`, () => HttpResponse.json([])),
  http.get(`${TEST_API_BASE_URL}/subscriptions/me`, () => HttpResponse.json([])),
];
