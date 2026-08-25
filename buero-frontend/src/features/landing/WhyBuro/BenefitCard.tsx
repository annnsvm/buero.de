import { Icon } from '@/components/ui';
import { Text } from '@/components/layout';
import type { BenefitCardProps } from '@/types/features/home/WhyBuro.types';

const BenefitCard = ({ iconName, title, children }: BenefitCardProps) => {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[20px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(1,1,1,0.06)] sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-burnt-siena-lightest)]">
        <Icon name={iconName} size={24} color="var(--color-burnt-siena-dark)" />
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-[1.2rem] leading-[1.3] font-semibold tracking-[-0.26px] text-[var(--color-cod-gray-base)] sm:text-[1.4rem]">
        {title}
      </h3>
      <Text label={title} className="text-[1.05rem] text-[var(--color-text-primary)]">
        {children}
      </Text>
    </article>
  );
};

export default BenefitCard;
