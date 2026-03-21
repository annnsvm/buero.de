import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';

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
  onSelectLesson?: (payload: { moduleId: string; materialId: string }) => void;
  selectedMaterialId?: string | null;
};

const CourseStructure: React.FC<CourseStructureProps> = ({
  modules,
  onSelectLesson,
  selectedMaterialId,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const first = modules[0]?.id;
    return first ? new Set([first]) : new Set();
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!selectedMaterialId) return;
    const parentModule = modules.find((m) =>
      m.lessons?.some((lesson) => lesson.id === selectedMaterialId),
    );
    if (!parentModule) return;
    setExpandedModules((prev) => {
      if (prev.has(parentModule.id)) return prev;
      const next = new Set(prev);
      next.add(parentModule.id);
      return next;
    });
  }, [selectedMaterialId, modules]);

  return (
    <div className="mt-6">
      <h3 className="text-base font-bold text-[var(--color-text-primary)]">Course Structure</h3>
      <div className="mt-4 space-y-2">
        {modules.map((mod, modIdx) => (
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
                  <span className="text-[var(--color-text-secondary)]">MODULE {modIdx + 1}</span>
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
                    <button
                      type="button"
                      onClick={() =>
                        onSelectLesson?.({ moduleId: mod.id, materialId: lesson.id })
                      }
                      className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                        selectedMaterialId === lesson.id
                          ? 'bg-[var(--color-dawn-pink-light)]'
                          : ''
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                        <Icon
                          name="icon-play_arrow"
                          size={18}
                          color="var(--color-white)"
                        />
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {lesson.title}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{lesson.duration}</span>
                      </div>
                    </button>
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