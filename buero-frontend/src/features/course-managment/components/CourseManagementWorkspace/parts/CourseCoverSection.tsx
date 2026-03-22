import React from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { CourseCoverSectionProps } from '@/types/features/courseManagment/CourseCoverSection.types';

const CourseCoverSection: React.FC<CourseCoverSectionProps> = ({
  coverPreviewUrl,
  disabled,
  onPick,
  onClear,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const previewUrl = URL.createObjectURL(file);
    onPick(file, previewUrl);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  return (
    <section aria-label="Course cover">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="sr-only"
        aria-label="Upload course cover"
        disabled={disabled}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Add course image"
        className={`relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-neutral-lighter)] ${
          disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
        }`}
      >
        {coverPreviewUrl ? (
          <>
            <img src={coverPreviewUrl} alt="Course cover" className="h-full w-full object-cover" />
            {!disabled ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  if (inputRef.current) inputRef.current.value = '';
                }}
                aria-label="Remove image"
                className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70"
              >
                Remove
              </button>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
            <Icon name={ICON_NAMES.ADD_PHOTO} size={180} ariaHidden />
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Upload course image</p>
            <p className="text-xs">Click to choose a file</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCoverSection;

