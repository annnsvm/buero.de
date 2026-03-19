import React from 'react';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';
import { PurchaseCard } from '@/features/subscriptions';

const CancelPurchase: React.FC = () => {
  return (
    <PurchaseCard
      redirectTo={ROUTES.MY_LEARNING}
      type="cancel"
      title="Order Cancelled!"
      iconName={ICON_NAMES.CHECK}
      description="Your order has been canceled. Try order again."
      buttonLabel="Go to All Courses"
    />
  );
};

export default CancelPurchase;
