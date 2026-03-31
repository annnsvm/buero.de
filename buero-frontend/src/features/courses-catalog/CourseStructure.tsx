import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';

export type CourseMaterial = {
  id: string;
  moduleId: string;
  type: string;
  title: string;
  duration?: string;
  orderIndex?: number;
};

export type CourseModule = {
  id: string;
  title: string;
  orderIndex?: number;
  materials: CourseMaterial[];
}; 

type CourseStructureProps = {
  modules: CourseModule[];
  onSelectLesson?: (payload: { moduleId: string; materialId: string }) => void;
  selectedMaterialId?: string | null;
  completedMaterialIds?: ReadonlySet<string>;
};

const CourseStructure: React.FC<CourseStructureProps> = ({
  modules,
  onSelectLesson,
  selectedMaterialId,
  completedMaterialIds,
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
      m.materials?.some((material) => material.id === selectedMaterialId),
    );
    if (!parentModule) return;
    setExpandedModules((prev) => {
      if (prev.has(parentModule.id)) return prev;
      const next = new Set(prev);
      next.add(parentModule.id);
      return next;
    });
  }, [selectedMaterialId, modules]);

  if (!modules || modules.length === 0) return null;

  const sortedModules = [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="space-y-6 py-2">
      {sortedModules.map((mod, modIdx) => {
        const completedCount = mod.materials?.filter(
          (m) => completedMaterialIds?.has(m.id),
        ).length ?? 0;
        const totalCount = mod.materials?.length ?? 0;

        return (
          <div key={mod.id}>
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between px-2 py-1 text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-dark)]">
                  MODULE&nbsp;&nbsp;{modIdx + 1}
                </span>
                <span className="mt-0.5 text-base font-semibold leading-tight text-[var(--color-neutral-darkest)]">
                  {mod.title}
                </span>
                <span className="mt-0.5 text-sm text-[var(--color-neutral-dark)]">
                  {completedCount}/{totalCount} completed
                </span>
              </div>
              <Icon
                name={expandedModules.has(mod.id) ? 'icon-chevron-up' : 'icon-chevron-down'}
                size={20}
                className="shrink-0 text-[var(--color-neutral-darkest)]"
              />
            </button>

            {expandedModules.has(mod.id) && mod.materials && mod.materials.length > 0 && (
              <div className="mt-3 space-y-3 pl-2">
                {mod.materials.map((lesson) => {
                  const isQuiz = String(lesson.type).toLowerCase() === 'quiz';
                  const isVideo = String(lesson.type).toLowerCase() === 'video';
                  const isCompleted = completedMaterialIds?.has(lesson.id) ?? false;
                  const isCompletedVideo = isVideo && isCompleted;
                  const isCompletedQuiz = isQuiz && isCompleted;
                  const rowBgClass =
                    selectedMaterialId === lesson.id
                      ? 'bg-[var(--color-dawn-pink-light)]'
                      : isCompletedVideo
                        ? 'bg-[#f5f3f0]'
                        : isCompletedQuiz
                          ? 'bg-[#eef2fc]'
                          : '';
                  const iconWrapClass = isCompletedVideo
                    ? 'bg-[#6b9f7a]'
                    : isCompletedQuiz
                      ? 'bg-[#6b7eb8]'
                      : 'bg-[var(--color-primary)]';
                  const lessonIconName =
                    isCompletedVideo || isCompletedQuiz
                      ? ICON_NAMES.CHECK
                      : isQuiz
                        ? ICON_NAMES.HELP
                        : ICON_NAMES.PLAY_ARROW;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() =>
                        onSelectLesson?.({ moduleId: mod.id, materialId: lesson.id })
                      }
                      className={`flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${rowBgClass}`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconWrapClass}`}
                        aria-hidden
                      >
                        <Icon
                          name={lessonIconName}
                          size={18}
                          color="var(--color-white)"
                        />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold text-[var(--color-neutral-darkest)]">
                          {lesson.title}
                        </span>
                        {!isQuiz ? (
                          <span className="text-xs text-[var(--color-neutral-dark)]">
                            {lesson.duration}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseStructure;