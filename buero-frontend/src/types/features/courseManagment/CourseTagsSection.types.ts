export type TagActionMode = 'none' | 'edit';

export type CourseTagsSectionProps = {
  tags: string[];
  disabled?: boolean;
  onChangeTags: (next: string[]) => void;
  error?: string;
};
