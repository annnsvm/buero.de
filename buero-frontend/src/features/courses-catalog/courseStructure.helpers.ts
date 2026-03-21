import type { CourseModule } from './CourseStructure';

/**
 * Для `key` на `<CourseStructure />`: ремоунт при зміні дерев → початкове розгортання першого модуля без setState в useEffect.
 */
export const courseStructureKeyFromModules = (modules: CourseModule[]): string =>
  modules.length === 0 ? 'empty' : modules.map((m) => m.id).join('|');
