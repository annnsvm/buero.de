import React from 'react';
import Icon from '../../Icon';
import { ModuleMaterialProps } from '@/types/components/ui/ModuleMaterial.types';

const ModuleMaterial: React.FC<ModuleMaterialProps> = ({ material, onSelectMaterial }) => {
  const { type, id, title, content } = material;
  const durationLabel =
    type === 'video' && typeof content?.duration === 'string'
      ? content.duration
      : type === 'video'
        ? 'Video'
        : type.replace('_', ' ');

  switch (type) {
    case 'video': {
      return (
        <li key={id}>
          <button
            type="button"
            onClick={() => onSelectMaterial(id)}
            className="flex w-full items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <Icon name="icon-play_arrow" size={18} color="var(--color-white)" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{title}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">{durationLabel}</span>
              </div>
            </div>
          </button>
        </li>
      );
    }
    default: {
      return (
        <li key={id}>
          <button
            type="button"
            onClick={() => onSelectMaterial(id)}
            className="flex w-full items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-section)]">
                <Icon name="icon-book" size={18} color="var(--color-text-primary)" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {title || 'Untitled material'}
                </span>
                <span className="text-xs capitalize text-[var(--color-text-secondary)]">{durationLabel}</span>
              </div>
            </div>
          </button>
        </li>
      );
    }
  }
};

export default ModuleMaterial;
