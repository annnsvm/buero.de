import type { Page } from '@playwright/test';

/** Sample rows aligned with `mapApiCourseToCourseCard` expectations (snake_case optional). */
const sampleCourses = [
  {
    id: 'e2e-course-alpha',
    title: 'E2E Course Alpha',
    description: 'Alpha description for catalog search',
    level: 'A2',
    language: 'de',
    tags: ['Beginner', 'A2'],
    price: 19.99,
    is_published: true,
    duration_hours: 1,
    videoLessonCount: 1,
    avgVideoLessonMinutes: 6,
  },
  {
    id: 'e2e-course-beta',
    title: 'E2E Course Beta',
    description: 'Beta description',
    level: 'B2',
    language: 'de',
    tags: ['Language', 'B2'],
    price: 29.99,
    is_published: true,
    duration_hours: 2,
    videoLessonCount: 2,
    avgVideoLessonMinutes: 8,
  },
];

/**
 * Intercepts catalog API calls so E2E does not require a running backend.
 * Assumes requests target pathname `/api/courses` (see `apiInstance` + `API_ENDPOINTS.courses`).
 */
export const installCatalogApiMocks = async (page: Page) => {
  await page.route(
    (url) => url.pathname === '/api/subscriptions/me',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    },
  );

  await page.route(
    (url) => url.pathname === '/api/courses/me',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    },
  );

  await page.route(
    (url) => url.pathname === '/api/courses/manage',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    },
  );

  await page.route(
    (url) => url.pathname === '/api/courses',
    async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }

      const requestUrl = new URL(route.request().url());
      const tags = requestUrl.searchParams.get('tags');
      const level = requestUrl.searchParams.get('level');

      let rows: typeof sampleCourses = [...sampleCourses];

      if (tags === 'Language') {
        rows = rows.filter((c) => c.tags.includes('Language'));
      }
      if (tags === 'Beginner') {
        rows = rows.filter((c) => c.tags.includes('Beginner'));
      }
      if (level === 'B1') {
        rows = rows.filter((c) => c.level === 'B1');
      }
      if (level === 'B2') {
        rows = rows.filter((c) => c.level === 'B2');
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(rows),
      });
    },
  );
};
