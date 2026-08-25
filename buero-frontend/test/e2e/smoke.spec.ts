import { expect, test } from '@playwright/test';

test('home page renders hero', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByLabel('Hero Title')).toBeVisible();
});

test('home page shows product sections and interactive demos', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Навчайся у своєму темпі')).toBeVisible();
  await expect(page.getByText('Доступ назавжди').first()).toBeVisible();
  await expect(page.getByText('Перший модуль безкоштовно').first()).toBeVisible();
  await expect(page.getByText('Уроки 2–10 хв')).toHaveCount(0);

  await expect(page.getByRole('heading', { name: 'Почни безкоштовно' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Короткі й чіткі уроки' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Дивись. Практикуй. Запам’ятовуй.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Словник, який залишається' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Перевір, що запам’ятав' })).toBeVisible();

  await expect(page.getByText('ЗА МЕЖАМИ КЛАСУ')).toHaveCount(0);

  const flashcard = page.getByRole('button', { name: /Перевернути картку/i });
  await flashcard.scrollIntoViewIfNeeded();
  await flashcard.click();
  await expect(page.getByText('вимога / передумова')).toBeVisible();

  const correct = page.getByRole('option', { name: /вимога/i });
  await correct.scrollIntoViewIfNeeded();
  await correct.click();
  await expect(page.getByText(/Правильно/i)).toBeVisible();
});
