import React, { useState } from 'react';
import Icon from '../../Icon';
import ModuleMaterial from '../ModuleMaterial/ModuleMaterial';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ModuleMaterialType, ModulesProps } from '@/types/components/ui/ModuleMaterial.types';

const CourseModule: React.FC<ModulesProps> = ({ module }) => {
  const { id, title, orderIndex, materials } = module;
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1']));
  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <li>
      <div key={id} className="rounded-lg bg-[var(--color-surface-card)]">
        <button
          type="button"
          onClick={() => toggleModule(id)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div>
            <div className="flex flex-col font-bold text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-secondary)]">
                MODULE {(orderIndex ?? 0) + 1}
              </span>
              <span>{title}</span>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {materials.length} lessons
            </p>
          </div>
          <Icon
            name={expandedModules.has(id) ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
            size={20}
            className="text-[var(--color-text-secondary)]"
          />
        </button>
        {expandedModules.has(id) && (
          <ul className="mt-2 space-y-2">
            {materials.map((material: ModuleMaterialType) => (
              <ModuleMaterial material={material} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default CourseModule;
