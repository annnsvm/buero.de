import React from 'react';
import Icon from '../../Icon';
import { ModuleMaterialProps } from '@/types/components/ui/ModuleMaterial.types';

const ModuleMaterial: React.FC<ModuleMaterialProps> = (material) => {
  const { type, id, title, content } = material.material;
  switch (type) {
    case 'video': {
      return (
        <li key={id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]">
              <Icon name="icon-play_arrow" size={18} color="var(--color-white)" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{title}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">4h 30m</span>
            </div>
          </div>
        </li>
      );
    }
    case 'quiz': {
      if (content) {
        return <p>This is content</p>;
      }
      return null;
    }
    default: {
      return null;
    }
  }
};

export default ModuleMaterial;
