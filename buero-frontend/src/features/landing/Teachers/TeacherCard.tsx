import React from 'react';
import { Text } from '@/components/layout';
import TeacherPhoto from './TeacherPhoto';

export type TeacherCardProps = {
  photoSrc: string;
  photoAlt: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  details: string;
};

const TeacherCard: React.FC<TeacherCardProps> = ({
  photoSrc,
  photoAlt,
  initials,
  name,
  role,
  bio,
  details,
}) => {
  return (
    <article className="flex items-start gap-5 sm:gap-7">
      <div className="h-40 w-40 shrink-0 sm:h-48 sm:w-48">
        <TeacherPhoto src={photoSrc} alt={photoAlt} initials={initials} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-[1.25rem] leading-[1.25] font-semibold tracking-[-0.3px] text-[var(--color-cod-gray-base)] sm:text-[1.35rem]">
            {name}
          </h3>
          <p className="mt-0.5 text-[0.9rem] font-semibold text-[var(--color-accent-secondary)]">
            {role}
          </p>
        </div>
        <Text label={role} className="text-[1rem] sm:text-[1.05rem]">
          {bio}
        </Text>
        <p className="text-[0.9rem] leading-[1.5] text-[var(--color-text-secondary)] italic">
          {details}
        </p>
      </div>
    </article>
  );
};

export default TeacherCard;
