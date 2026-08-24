import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PurchaseCard } from '@/features/subscriptions';
import { ROUTES } from '@/helpers/routes';
import { ICON_NAMES } from '@/helpers/iconNames';
import { subscriptionApi } from '@/api/subscriptionApi';
import {
  clearPendingOrderReference,
  readPendingOrderReference,
} from '@/helpers/sessionPendingAuth';

type SyncState = 'loading' | 'paid' | 'failed' | 'unknown';

/** WayForPay може підтвердити платіж повільніше, ніж студент повернеться на сайт. */
const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 4;

const SuccessPurchase: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // WayForPay не гарантує orderReference у returnUrl, тож дублюємо його в sessionStorage
  const [orderReference] = useState(
    () => searchParams.get('orderReference') ?? readPendingOrderReference(),
  );
  const [syncState, setSyncState] = useState<SyncState>(
    orderReference ? 'loading' : 'unknown',
  );

  useEffect(() => {
    if (!orderReference) return;
    // Тримаємо orderReference в URL, щоб перезавантаження сторінки не втрачало контекст
    if (searchParams.get('orderReference') !== orderReference) {
      setSearchParams({ orderReference }, { replace: true });
    }
  }, [orderReference, searchParams, setSearchParams]);

  useEffect(() => {
    if (!orderReference) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = async (attempt: number) => {
      try {
        const result = await subscriptionApi.syncCheckoutSession(orderReference);
        if (cancelled) return;

        if (result.ok) {
          clearPendingOrderReference();
          setSyncState('paid');
          return;
        }

        if (result.status === 'pending' && attempt < MAX_RETRIES) {
          timer = setTimeout(() => void run(attempt + 1), RETRY_DELAY_MS);
          return;
        }

        if (result.status === 'pending') {
          setSyncState('unknown');
          return;
        }

        clearPendingOrderReference();
        setSyncState('failed');
      } catch {
        if (!cancelled) setSyncState('unknown');
      }
    };

    void run(1);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderReference]);

  if (syncState === 'loading') {
    return (
      <p className="px-4 pt-40 pb-40 text-center text-sm text-[var(--color-text-secondary)]">
        Confirming your payment…
      </p>
    );
  }

  if (syncState === 'failed') {
    return (
      <PurchaseCard
        redirectTo={ROUTES.COURSES}
        type="cancel"
        title="Payment was not completed"
        iconName={ICON_NAMES.CHECK}
        description="Your bank declined the payment, so the course was not purchased and no money was charged. You can try again with another card."
        buttonLabel="Back to Courses"
      />
    );
  }

  if (syncState === 'unknown') {
    return (
      <PurchaseCard
        redirectTo={ROUTES.MY_LEARNING}
        type="cancel"
        title="Payment is still being processed"
        iconName={ICON_NAMES.CHECK}
        description="We could not confirm your payment yet. If the course does not appear in My Learning within a few minutes, please contact support."
        buttonLabel="Go to My Learning"
      />
    );
  }

  return (
    <PurchaseCard
      redirectTo={ROUTES.MY_LEARNING}
      type="confirmed"
      title="Order Confirmed!"
      iconName={ICON_NAMES.CHECK}
      description='Thank you for your purchase. Your courses are now available in "My Learning".'
      buttonLabel="Go to My Learning"
    />
  );
};

export default SuccessPurchase;
