import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';
import LinkBtn from '@/components/ui/Link';

const SuccessPurchase: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) navigate(ROUTES.PROFILE);

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  return (
    <Section className="pt-30 pb-10 sm:pb-20 lg:pt-35">
      <Container>
        <div className="rounded-[12px] flex flex-col items-center gap-3 sm:gap-4 lg:gap-6 border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-base)] px-6 py-10 lg:px-33 lg:py-15">
          <div className="relative h-[120px] w-[120px] rounded-full bg-[var(--color-primary)]">
            <Icon
              name={ICON_NAMES.CHECK}
              size={120}
              color="var(--color-white)"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={4}
            />
          </div>
          <h1 className="font-family-[var(--font-sans)] text-center text-[1rem] leading-[1.5] font-[700] lg:text-[1.625rem]">
            Order Confirmed!
          </h1>
          <p className="w-full max-w-[775px] text-center text-[.9rem] leading-[1.5] sm:text-[1rem] lg:text-[1.625rem]">
            Thank you for your purchase. Your courses are now available in "My Learning".
          </p>
          <p className="text-center text-[.8rem] leading-[1.5] sm:text-[1rem] lg:text-[1.125rem]">
            You will be redirected after {countdown} sec.
          </p>

          <LinkBtn to={ROUTES.PROFILE} variant="primary" className="w-full max-w-[206px]">
            Go to My Learning
          </LinkBtn>
        </div>
      </Container>
    </Section>
  );
};

export default SuccessPurchase;
