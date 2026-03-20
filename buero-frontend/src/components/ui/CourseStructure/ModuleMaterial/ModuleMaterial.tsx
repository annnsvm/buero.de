import React from 'react';
import Icon from '../../Icon';
import { ModuleMaterialProps } from '@/types/components/ui/ModuleMaterial.types';
import { ICON_NAMES } from '@/helpers/iconNames';

const ModuleMaterial: React.FC<ModuleMaterialProps> = ({
  material,
  onSelectMaterial,
  onRequestDeleteMaterial,
}) => {
  const { type, id, title, content } = material;
  const durationLabel =
    type === 'video' && typeof content?.duration === 'string'
      ? content.duration
      : type === 'video'
        ? 'Video'
        : type.replace('_', ' ');

  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    onRequestDeleteMaterial?.(id);
  };

  const deleteAriaLabel =
    type === 'video'
      ? 'Delete video lesson'
      : type === 'quiz'
        ? 'Delete quiz'
        : 'Delete material';

  const renderMainButton = (iconName: string, iconWrapperClass: string, iconColor: string) => (
    <button
      type="button"
      onClick={() => onSelectMaterial(id)}
      className="flex min-w-0 flex-1 items-center justify-between py-2 text-left"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconWrapperClass}`}
        >
          <Icon name={iconName} size={18} color={iconColor} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">
            {title || 'Untitled material'}
          </span>
          <span className="text-xs capitalize text-[var(--color-text-secondary)]">{durationLabel}</span>
        </div>
      </div>
    </button>
  );

  switch (type) {
    case 'video': {
      return (
        <li>
          <div className="flex items-stretch gap-1">
            {renderMainButton(ICON_NAMES.PLAY_ARROW, 'bg-[var(--color-primary)]', 'var(--color-white)')}
            {onRequestDeleteMaterial ? (
              <button
                type="button"
                aria-label={deleteAriaLabel}
                tabIndex={0}
                className="flex shrink-0 items-center justify-center rounded-lg px-2 hover:bg-[var(--color-surface-section)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDeleteMaterial(id);
                }}
                onKeyDown={handleDeleteKeyDown}
              >
                <Icon name={ICON_NAMES.TRASH} size={18} className="text-[var(--color-text-secondary)]" />
              </button>
            ) : null}
          </div>
        </li>
      );
    }
    default: {
      return (
        <li>
          <div className="flex items-stretch gap-1">
            {renderMainButton(
              ICON_NAMES.BOOK,
              'bg-[var(--color-surface-section)]',
              'var(--color-text-primary)',
            )}
            {onRequestDeleteMaterial ? (
              <button
                type="button"
                aria-label={deleteAriaLabel}
                tabIndex={0}
                className="flex shrink-0 items-center justify-center rounded-lg px-2 hover:bg-[var(--color-surface-section)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDeleteMaterial(id);
                }}
                onKeyDown={handleDeleteKeyDown}
              >
                <Icon name={ICON_NAMES.TRASH} size={18} className="text-[var(--color-text-secondary)]" />
              </button>
            ) : null}
          </div>
        </li>
      );
    }
  }
};

export default ModuleMaterial;
