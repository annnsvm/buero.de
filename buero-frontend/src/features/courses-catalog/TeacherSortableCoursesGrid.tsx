import { useCallback, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

import CourseCard from './CourseCard';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { reorderCourses } from '@/api/coursesCatalogApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCatalogItemOrder } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { CreateCourseCard } from '../course-managment';

type SortableCourseItemProps = {
  course: CourseCardProps;
  dragEnabled: boolean;
  onCourseDeleted?: () => void;
};

const SortableCourseItem = ({
  course,
  dragEnabled,
  onCourseDeleted,
}: SortableCourseItemProps) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: course.id,
    disabled: !dragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandleProps = dragEnabled
    ? {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
        'aria-label': t('courses.dragCourse', { title: course.title }),
      }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`w-[min(100%,405px)] shrink-0 ${isDragging ? 'z-10 opacity-90' : ''}`}
    >
      <CourseCard
        {...course}
        variant="teacher-catalog"
        onCourseDeleted={onCourseDeleted}
        onPublicationChange={onCourseDeleted}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
      />
    </li>
  );
};

export type TeacherSortableCoursesGridProps = {
  courses: CourseCardProps[];
  dragEnabled: boolean;
  onCourseDeleted: () => void;
};

const TeacherSortableCoursesGrid = ({
  courses,
  dragEnabled,
  onCourseDeleted,
}: TeacherSortableCoursesGridProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persistOrder = useCallback(
    async (ordered: CourseCardProps[]) => {
      setIsSavingOrder(true);
      try {
        await reorderCourses(
          ordered.map((course, index) => ({
            id: course.id,
            order_index: index,
          })),
        );
      } catch {
        void dispatch(fetchCoursesCatalogThunk());
      } finally {
        setIsSavingOrder(false);
      }
    },
    [dispatch],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = courses.findIndex((course) => course.id === active.id);
      const newIndex = courses.findIndex((course) => course.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const reordered = arrayMove(courses, oldIndex, newIndex);
      dispatch(setCatalogItemOrder(reordered));
      void persistOrder(reordered);
    },
    [courses, dispatch, persistOrder],
  );

  return (
    <>
      {courses.length > 0 && dragEnabled ? (
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          {isSavingOrder ? t('courses.savingOrder') : t('courses.dragToReorder')}
        </p>
      ) : null}
      {courses.length > 0 && !dragEnabled ? (
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          {t('courses.reorderHintFiltered')}
        </p>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={courses.map((course) => course.id)} strategy={rectSortingStrategy}>
          <ul className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
            <CreateCourseCard />
            {courses.map((course) => (
              <SortableCourseItem
                key={course.id}
                course={course}
                dragEnabled={dragEnabled}
                onCourseDeleted={onCourseDeleted}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default TeacherSortableCoursesGrid;
