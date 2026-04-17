import type { CourseModule } from './CourseStructure';

export const courseStructureKeyFromModules = (modules: CourseModule[]): string =>
  modules.length === 0 ? 'empty' : modules.map((m) => m.id).join('|');
