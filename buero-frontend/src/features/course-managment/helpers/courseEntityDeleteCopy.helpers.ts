/** Тексти для модалки підтвердження видалення сутностей курсу (EN). */

export const buildDeleteCourseDescription = (moduleCount: number): string =>
  `This course contains ${moduleCount} module${moduleCount === 1 ? '' : 's'}.\nDeleting the course will permanently remove all modules, lessons, and quizzes. This action cannot be undone.`;

export const buildDeleteModuleDescription = (params: {
  videoLessons: number;
  quizzes: number;
  otherMaterials: number;
}): string => {
  const { videoLessons, quizzes, otherMaterials } = params;
  const lines: string[] = [
    `This module contains ${videoLessons} video lesson${videoLessons === 1 ? '' : 's'} and ${quizzes} ${quizzes === 1 ? 'quiz' : 'quizzes'}.`,
  ];
  if (otherMaterials > 0) {
    lines.push(
      `It also includes ${otherMaterials} other material${otherMaterials === 1 ? '' : 's'}.`,
    );
  }
  lines.push('Deleting the module will remove all its materials. This action cannot be undone.');
  return lines.join('\n\n');
};

export const buildDeleteMaterialDescription = (params: {
  title: string;
  kind: 'video' | 'quiz' | 'other';
}): string => {
  const safeTitle = params.title.trim() || 'Untitled';
  if (params.kind === 'video') {
    return `Delete the video lesson "${safeTitle}"?\nThis cannot be undone.`;
  }
  if (params.kind === 'quiz') {
    return `Delete the quiz "${safeTitle}"?\nThis cannot be undone.`;
  }
  return `Delete the material "${safeTitle}"?\nThis cannot be undone.`;
};
