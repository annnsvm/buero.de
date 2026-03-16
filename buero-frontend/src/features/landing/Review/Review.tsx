import type { FC } from 'react';
import { Section,Container ,Title, Text, SectionTitle} from "@/components/layout";

import { reviews } from './reviews';

const Review: FC = () => {
  return (
    <Section className="bg-[var(--color-soapstone-base)] px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 xl:px-16 2xl:px-20">
      <Container className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <SectionTitle label="What learners say" className="mb-4 ">
            WHAT LEARNERS SAY
          </SectionTitle>
          <Title className="mb-6 sm:max-w-[700px] lg:max-w-[869px]">
            Real stories from real expats
          </Title>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 md:gap-6 lg:mt-14 lg:grid-cols-3 lg:items-stretch">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex h-full min-h-[240px] flex-col justify-between rounded-[20px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-5  sm:min-h-[260px] sm:rounded-[22px] sm:p-6 md:min-h-[280px]"
            >
              <Text label="Review text" className="mb-10">
                <span aria-hidden="true">&quot;</span>
                {review.quote}
                <span aria-hidden="true">&quot;</span>
              </Text>

              <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold leading-tight text-black sm:text-[18px]">
                    {review.name}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-[color:var(--color-border-strong] sm:mt-2 sm:text-[18px] sm:leading-tight">
                    {review.meta}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Review;
