import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type DragHandleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: (element: HTMLElement | null) => void;
};

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
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
  sortableRef?: (element: HTMLElement | null) => void;
  sortableStyle?: CSSProperties;
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
  /** 1-based label position; falls back to orderIndex when omitted. */
  displayPosition?: number;
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
  /** Keeps the module open while a material is dragged over it. */
  forceExpanded?: boolean;
  /** Registers the module body as a drop target for materials. */
  setDropTargetRef?: (element: HTMLElement | null) => void;
  /** Replaces the default material list, used to wrap rows in a sortable context. */
  renderMaterialsList?: () => ReactNode;
  sortableRef?: (element: HTMLElement | null) => void;
  sortableStyle?: CSSProperties;
};

type CourseProps = {
  id: string;
  titile: string;
  description: string;
  price: string;
  category: string;
  modules: Modules[];
};

export type {
  DragHandleProps,
  ModuleMaterialType,
  ModuleMaterialProps,
  CourseProps,
  Modules,
  ModulesProps,
};
