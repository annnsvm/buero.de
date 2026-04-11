export const deleteCourseCopy = (moduleCount: number): string =>
  `This course contains ${moduleCount} module${moduleCount === 1 ? '' : 's'}.\nDeleting the course will permanently remove all modules, lessons, and quizzes. This action cannot be undone.`;
