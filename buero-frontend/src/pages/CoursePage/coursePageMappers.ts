import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import type { LearningLesson } from '@/types/features/learning/LearningPage.types';

/** Фрагмент відповіді GET /courses/:id (дерево з бекенду, camelCase як у Prisma/Nest) */
export type ApiCourseMaterial = {
  id: string;
  title: string;
  type: string;
  orderIndex?: number;
  content?: Record<string, unknown> | null;
};

export type ApiCourseModule = {
  id: string;
  title: string;
  orderIndex?: number;
  materials?: ApiCourseMaterial[];
};

export type ApiCourseWithTree = {
  id: string;
  title: string;
  description?: string | null;
  modules?: ApiCourseModule[];
};

const sortByOrder = <T extends { orderIndex?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

const formatMaterialDuration = (mat: ApiCourseMaterial): string => {
  if (mat.type === 'video' && mat.content && typeof mat.content === 'object') {
    const d = (mat.content as { duration?: string }).duration;
    if (typeof d === 'string' && d.trim()) return d;
  }
  return '—';
};

export const mapApiModulesToCourseStructure = (
  modules: ApiCourseModule[] | undefined,
): CourseModule[] => {
  if (!modules?.length) return [];
  return sortByOrder(modules).map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessonsCount: mod.materials?.length ?? 0,
    lessons: sortByOrder(mod.materials ?? []).map((mat) => ({
      id: mat.id,
      title: mat.title,
      duration: formatMaterialDuration(mat),
      type: mat.type,
    })),
  }));
};

export type FlatMaterialRef = { moduleId: string; material: ApiCourseMaterial };

export const flattenMaterialsInOrder = (course: ApiCourseWithTree): FlatMaterialRef[] => {
  const out: FlatMaterialRef[] = [];
  const modules = sortByOrder(course.modules ?? []);
  for (const mod of modules) {
    for (const mat of sortByOrder(mod.materials ?? [])) {
      out.push({ moduleId: mod.id, material: mat });
    }
  }
  return out;
};

/** Наступний матеріал типу `video` після поточного (у межах курсу, між модулями). */
export const findNextVideoMaterialId = (
  flat: FlatMaterialRef[],
  currentMaterialId: string | null,
): string | null => {
  if (!flat.length || !currentMaterialId) return null;
  const idx = flat.findIndex((r) => r.material.id === currentMaterialId);
  if (idx < 0) return null;
  for (let i = idx + 1; i < flat.length; i++) {
    if (String(flat[i].material.type).toLowerCase() === 'video') return flat[i].material.id;
  }
  return null;
};

/** Parsed quiz for the learning UI (matches editor payload in `courseMaterialApiPayload.helpers`). */
export type ParsedQuizAnswer = { id: string; text: string; isCorrect: boolean };
export type ParsedQuizQuestion = { id: string; question: string; answers: ParsedQuizAnswer[] };

export const parseQuizMaterialContent = (material: ApiCourseMaterial): ParsedQuizQuestion[] => {
  if (String(material.type).toLowerCase() !== 'quiz' || !material.content || typeof material.content !== 'object') {
    return [];
  }
  const quizQuestionsRaw = Array.isArray((material.content as { questions?: unknown }).questions)
    ? ((material.content as { questions: Array<Record<string, unknown>> }).questions)
    : [];

  return quizQuestionsRaw.map((questionRaw, qIndex) => {
    const questionId =
      typeof questionRaw.id === 'string' && questionRaw.id.trim()
        ? questionRaw.id
        : `q${qIndex + 1}`;
    const questionText = typeof questionRaw.text === 'string' ? questionRaw.text : '';
    const correctRaw = questionRaw.correct;
    const correctIds = Array.isArray(correctRaw)
      ? correctRaw.map((v) => String(v))
      : typeof correctRaw === 'string'
        ? [correctRaw]
        : [];
    const optionsRaw = Array.isArray(questionRaw.options)
      ? (questionRaw.options as Array<Record<string, unknown>>)
      : [];
    const answers: ParsedQuizAnswer[] = optionsRaw.map((optRaw, optIndex) => {
      const optionId =
        typeof optRaw.id === 'string' && optRaw.id.trim()
          ? optRaw.id
          : `${questionId}_opt_${optIndex + 1}`;
      const optionText = typeof optRaw.text === 'string' ? optRaw.text : '';
      return {
        id: optionId,
        text: optionText,
        isCorrect: correctIds.includes(optionId),
      };
    });
    return { id: questionId, question: questionText, answers };
  });
};

const youtubeEmbedUrl = (material: ApiCourseMaterial): string => {
  if (material.type !== 'video' || !material.content || typeof material.content !== 'object') {
    return '';
  }
  const id = String((material.content as { youtube_video_id?: string }).youtube_video_id ?? '').trim();
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}`;
};

export const buildLearningLessonFromMaterial = (
  courseTitle: string,
  material: ApiCourseMaterial,
  flatIndex: number,
  totalMaterials: number,
): LearningLesson => {
  const embed = youtubeEmbedUrl(material);
  const typeLabel =
    material.type === 'video'
      ? 'Video'
      : material.type.charAt(0).toUpperCase() + material.type.slice(1);

  return {
    courseTitle,
    progressText:
      totalMaterials > 0
        ? `${Math.min(flatIndex + 1, totalMaterials)} of ${totalMaterials} lessons`
        : '0 of 0 lessons',
    streak: '—',
    progress: totalMaterials > 0 ? Math.round(((flatIndex + 1) / totalMaterials) * 100) : 0,
    type: typeLabel,
    status: 'In progress',
    title: material.title,
    description:
      'Watch this lesson carefully and take notes. Mark as complete when you are ready to continue.',
    videoUrl: embed || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  };
};
