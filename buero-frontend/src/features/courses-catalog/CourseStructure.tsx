import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';


export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessonsCount: number;
  lessons: CourseLesson[];
};

type CourseStructureProps = {
  modules: CourseModule[];
};

const CourseStructure: React.FC<CourseStructureProps> = ({ modules }) => {
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
    <div className="mt-6">
      <h3 className="text-base font-bold text-[var(--color-text-primary)]">Course Structure</h3>
      <div className="mt-4 space-y-2">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="rounded-lg bg-[var(--color-surface-card)]"
          >
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <div className="font-bold text-[var(--color-text-primary)] flex flex-col">
                  <span className="text-[var(--color-text-secondary)]">MODULE {mod.id}</span>
                  <span>{mod.title}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{mod.lessonsCount} lessons</p>
              </div>
              <Icon
                name={expandedModules.has(mod.id) ? 'icon-chevron-up' : 'icon-chevron-down'}
                size={20}
                className="text-[var(--color-text-secondary)]"
              />
            </button>
            {expandedModules.has(mod.id) && mod.lessons && mod.lessons.length > 0 && (
              <div className="px-8 py-2">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex justify-center items-center shrink-0">
                        <Icon
                          name="icon-play_arrow"
                          size={18}
                          color="var(--color-white)"
                        />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{lesson.title}</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStructure;