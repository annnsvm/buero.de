import { Link } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import { Container } from '@/components/layout';

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-1 flex-col bg-[var(--color-soapstone-base)] text-[var(--color-text-primary)] antialiased">
      <section
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(231,110,80,0.12),_transparent_58%)] px-4 py-16 sm:py-20 lg:py-24"
        aria-label="Not Found Page"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(231,110,80,0.14)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 bottom-8 h-40 w-40 rounded-full bg-[var(--opacity-neutral-darkest-5)] blur-2xl"
        />

        <Container>
          <div className="mx-auto max-w-[52rem] rounded-[28px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)]/95 p-7 text-center shadow-[0_20px_60px_-20px_rgba(1,1,1,0.12)] backdrop-blur-sm sm:p-10 lg:p-12">
            <p className="mx-auto mb-5 inline-flex rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-5 py-1.5 text-sm font-semibold tracking-[0.08em] text-[var(--color-primary)] uppercase">
              Error 404
            </p>

            <h1 className="text-balance text-[2rem] leading-[1.2] font-[700] text-[var(--color-neutral-darker)] sm:text-[2.75rem] lg:text-[3.2rem]">
              Oops, this page took a wrong turn.
            </h1>

            <p className="mx-auto mt-4 max-w-[40rem] text-pretty text-[1rem] leading-[1.7] text-[var(--color-text-secondary)] sm:text-[1.125rem]">
              The page might have moved, been removed, or the link is outdated. Let&apos;s get you
              back to learning in just one click.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to={ROUTES.HOME}
                aria-label="Go to home page"
                className="inline-flex items-center justify-center rounded-[100px] border border-transparent bg-[var(--color-primary)] px-6 py-2.5 text-[var(--color-primary-foreground)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Go to Home
              </Link>
              <Link
                to={ROUTES.COURSES}
                aria-label="Go to courses page"
                className="inline-flex items-center justify-center rounded-[100px] border border-[var(--opacity-neutral-darkest-15)] bg-transparent px-6 py-2.5 text-[var(--color-text-primary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default NotFoundPage;
