import { Container, Section } from '@/components/layout';
import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { PurchaseCardProps } from '@/types/features/subscriptions/PurschaseCard.types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STRIPE_RETURN_KEY = 'stripe_return';

const cardStyle = {
  confirmed: 'bg-[var(--color-success)]',
  cancel: 'bg-[var(--color-burnt-siena-lighter)]',
};

const iconStyle = {
  confirmed: ' bg-[var(--color-primary)]',
  cancel: 'bg-[var(--color-accent-danger)]',
};

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  redirectTo,
  iconName,
  title,
  description,
  buttonLabel,
  type,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [allowed] = useState(() => sessionStorage.getItem(STRIPE_RETURN_KEY) === 'pending');
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) navigate(redirectTo);

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectTo, navigate]);

  useEffect(() => {
    if (!allowed) {
      navigate('/', { replace: true });
      return;
    }
    sessionStorage.removeItem(STRIPE_RETURN_KEY);
  }, [allowed, navigate]);

  if (!allowed) {
    return null;
  }

  return (
    <Section className="pt-30 pb-10 sm:pb-20 lg:pt-35">
      <Container>
        <div
          className={`flex flex-col items-center gap-3 rounded-[12px] border border-[var(--opacity-neutral-darkest-15)] px-6 py-10 sm:gap-4 lg:gap-6 lg:px-33 lg:py-15 ${cardStyle[type]}`}
        >
          <div className={`relative h-[120px] w-[120px] rounded-full ${iconStyle[type]}`}>
            <Icon
              name={iconName}
              size={120}
              color="var(--color-white)"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={4}
            />
          </div>
          <h1 className="font-family-[var(--font-sans)] text-center text-[1rem] leading-[1.5] font-[700] lg:text-[1.625rem]">
            {title}
          </h1>
          <p className="w-full max-w-[775px] text-center text-[.9rem] leading-[1.5] sm:text-[1rem] lg:text-[1.625rem]">
            {description}
          </p>
          <p className="text-center text-[.8rem] leading-[1.5] sm:text-[1rem] lg:text-[1.125rem]">
            You will be redirected after {countdown} sec.
          </p>

          <LinkBtn to={redirectTo} variant="primary" className="w-full max-w-[206px]">
            {buttonLabel}
          </LinkBtn>
        </div>
      </Container>
    </Section>
  );
};

export default PurchaseCard;
