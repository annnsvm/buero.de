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
  orderIndex?: number;
};

type ModuleMaterialProps = {
  material: ModuleMaterialType;
  onSelectMaterial: (materialId: string) => void;
  onRequestDeleteMaterial?: (materialId: string) => void;
};

type Modules = {
  id: string;
  title: string;
  materials: ModuleMaterialType[];
  orderIndex?: number;
};

type ModulesProps = {
  module: Modules;
  onCreateMaterial: (moduleId: string) => void;
  onSelectMaterial: (moduleId: string, materialId: string) => void;
  onEditModule: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteModule?: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteMaterial?: (moduleId: string, materialId: string) => void;
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
