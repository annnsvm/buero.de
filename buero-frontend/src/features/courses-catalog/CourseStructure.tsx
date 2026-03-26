import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';

export type CourseMaterial = {
  id: string;
  moduleId: string;
  type: string;
  title: string;
  type: string;
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
    <div className="mt-6 p-4 sm:p-6">
      <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.01em] text-[var(--color-neutral-darkest)]">Course Structure</h3>
      <div className="mt-1 space-y-4 px-4 sm:px-6 py-4">
        {sortedModules.map((mod, modIdx) => (
          
          <div
            key={mod.id}
            className="rounded-lg bg-[var(--color-surface-card)]"
          >
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <div className="font-bold text-[var(--color-text-primary)] flex flex-col">
                  <span className="font-semibold text-[var(--color-neutral-dark)] uppercase text-base">MODULE {modIdx + 1}</span>
                  <span className="text-lg leading-tight font-semibold tracking-[-0.01em] text-[var(--color-neutral-darkest)]">{mod.title}</span>
                </div>
                <p className="text-[var(--color-neutral-dark)] text-base">{mod.materials?.length||0} lessons</p>
              </div>
              <Icon
                name={expandedModules.has(mod.id) ? 'icon-chevron-up' : 'icon-chevron-down'}
                size={20}
                className="text-[var(--color-neutral-darkest)]"
              />
            </button>
            {expandedModules.has(mod.id) && mod.materials && mod.materials.length > 0 && (
              <div className="px-4 py-2 sm:px-6 sm:py-4">
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
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onSelectLesson?.({ moduleId: mod.id, materialId: lesson.id })
                      }
                      className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${rowBgClass}`}
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
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-base font-semibold text-[var(--color-neutral-darkest)]">
                          {lesson.title}
                        </span>
                        {!isQuiz ? (
                          <span className="font-semibold text-[var(--color-neutral-dark)] text-xs">{lesson.duration}</span>
                        ) : null}
                      </div>
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default CourseStructure;