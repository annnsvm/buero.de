import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';

type LandingCtaProps = {
  label: string;
  to?: string;
  className?: string;
  align?: 'start' | 'center';
};

const LandingCta = ({
  label,
  to = ROUTES.COURSES,
  className = '',
  align = 'center',
}: LandingCtaProps) => {
  return (
    <div
      className={[
        'flex w-full',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      ].join(' ')}
    >
      <LinkBtn
        to={to}
        variant="primary"
        className="group inline-flex min-h-12 items-center justify-center gap-3 px-8 py-3.5 text-[1.05rem] font-semibold shadow-[0_12px_28px_rgba(231,110,80,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(231,110,80,0.42)] sm:min-h-13 sm:px-10 sm:text-[1.1rem]"
      >
        <span>{label}</span>
        <Icon
          name={ICON_NAMES.ARROW_RIGHT}
          color="var(--color-white)"
          size={16}
          strokeWidth={3}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </LinkBtn>
    </div>
  );
};

export default LandingCta;
