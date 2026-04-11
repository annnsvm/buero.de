import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type ApiCourseTreeResponse = {
  title?: string;
  description?: string | null;
  language?: string;
  category?: string;
  price?: number | null;
  durationHours?: number | null;
  duration_hours?: number | null;
  tags?: string[];
  level?: string | null;
  isPublished?: boolean;
  is_published?: boolean;
  image_url?: string | null;
  imageUrl?: string | null;
  modules?: Modules[];
};
