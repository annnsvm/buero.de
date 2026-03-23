import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PurchaseCard } from '@/features/subscriptions';
import { ROUTES } from '@/helpers/routes';
import { ICON_NAMES } from '@/helpers/iconNames';
import { subscriptionApi } from '@/api/subscriptionApi';

type SyncState = 'idle' | 'loading' | 'ok' | 'error';

const SuccessPurchase: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [syncState, setSyncState] = useState<SyncState>(
    sessionId ? 'loading' : 'idle',
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    const run = async () => {
      try {
        await subscriptionApi.syncCheckoutSession(sessionId);
        if (!cancelled) setSyncState('ok');
      } catch {
        if (!cancelled) setSyncState('error');
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <>
      {sessionId && syncState === 'loading' && (
        <p className="px-4 pt-28 text-center text-sm text-[var(--color-text-secondary)]">
          Activating your course access…
        </p>
      )}
      {sessionId && syncState === 'error' && (
        <p className="px-4 pt-28 text-center text-sm text-[var(--color-error)]">
          Could not confirm access automatically. If the course is missing in My Learning, ensure
          Stripe webhooks reach your API or try again later.
        </p>
      )}
      <PurchaseCard
        redirectTo={ROUTES.MY_LEARNING}
        type="confirmed"
        title="Order Confirmed!"
        iconName={ICON_NAMES.CHECK}
        description='Thank you for your purchase. Your courses are now available in "My Learning".'
        buttonLabel="Go to My Learning"
      />
    </>
  );
};

export default SuccessPurchase;
