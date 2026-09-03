import { describe, expect, it, beforeAll } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pain from '@/features/landing/Pain';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

const FIRST_BODY =
  'У Amt, у лікарні чи на роботі потрібно сказати щось просте. Слова знаєш - але в потрібний момент їх ніби немає.';
const SECOND_BODY =
  'Таблицю знаєш, вправи виконуєш. А зібрати власну фразу в розмові - ніби бачиш німецьку вперше.';

beforeAll(async () => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
  await i18nReady;
});

describe('Pain section', () => {
  it('keeps cards collapsed and opens only one body at a time', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Pain />);

    const first = screen.getByRole('button', { name: /Треба відповісти/i });
    const second = screen.getByRole('button', { name: /Правило є/i });

    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Знайоме відчуття?')).not.toBeInTheDocument();
    expect(screen.getByText(/Обери ситуацію, яка найбільше схожа на твою/)).toBeVisible();
    expect(screen.getByText(/Впізнали себе/)).toBeVisible();

    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveTextContent(FIRST_BODY);

    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveTextContent(SECOND_BODY);
  });
});
