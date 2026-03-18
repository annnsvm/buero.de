type ModuleMaterialType = {
  id: string;
  type:
    | 'video'
    | 'vocabulary'
    | 'quiz'
    | 'grammar'
    | 'scenario'
    | 'cultural_insight'
    | 'homework'
    | 'text';
  title?: string;
  content?: Record<string, unknown>;
};

type ModuleMaterialProps = {
  material: ModuleMaterialType;
};

type Modules = {
  id: string;
  title: string;
  materials: ModuleMaterialType[];
  orderIndex?: number;
};

type ModulesProps = {
  module: Modules;
};

type CourseProps = {
  id: string;
  titile: string;
  description: string;
  price: string;
  category: string;
  modules: Modules[];
};

export type { ModuleMaterialType, ModuleMaterialProps, CourseProps, Modules,ModulesProps };
