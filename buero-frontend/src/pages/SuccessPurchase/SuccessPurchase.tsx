import React from 'react';
import { PurchaseCard } from '@/features/subscriptions';
import { ROUTES } from '@/helpers/routes';
import { ICON_NAMES } from '@/helpers/iconNames';

const SuccessPurchase: React.FC = () => {
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
