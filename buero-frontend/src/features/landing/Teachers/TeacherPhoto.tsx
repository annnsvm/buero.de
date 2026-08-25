import React from 'react';
import AssetImage from '../shared/AssetImage';

type TeacherPhotoProps = {
  src: string;
  alt: string;
  initials: string;
};

const TeacherPhoto: React.FC<TeacherPhotoProps> = ({ src, alt, initials }) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--color-dawn-pink-base)]">
      <AssetImage
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        fallback={
          <div
            className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,var(--color-dawn-pink-light)_0%,var(--color-burnt-siena-lighter)_100%)]"
            aria-hidden="true"
          >
            <span className="font-[family-name:var(--font-heading)] text-[1.5rem] leading-none font-semibold text-[var(--color-burnt-siena-dark)]/40 sm:text-[1.75rem]">
              {initials}
            </span>
          </div>
        }
      />
    </div>
  );
};

export default TeacherPhoto;
