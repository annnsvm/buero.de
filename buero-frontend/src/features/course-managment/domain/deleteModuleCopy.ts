export const deleteModuleCopy = (params: {
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
