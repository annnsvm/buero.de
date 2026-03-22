export type CourseCoverSectionProps = {
  coverPreviewUrl: string | null;
  disabled?: boolean;
  onPick: (file: File, previewUrl: string) => void;
  onClear: () => void;
};
