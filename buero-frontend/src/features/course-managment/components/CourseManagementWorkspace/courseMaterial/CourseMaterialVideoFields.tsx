import React from 'react';
import { FormField, Input } from '@/components/ui';
import { extractYouTubeVideoId } from '@/features/course-managment/helpers/extractYouTubeVideoId';
import type { CourseMaterialVideoFieldsProps } from '@/types/features/courseManagment/CourseMaterialVideoFields.types';

const CourseMaterialVideoFields: React.FC<CourseMaterialVideoFieldsProps> = ({
  youtubeVideoId,
  youtubeVideoDuration,
  isSubmitting,
  onYoutubeVideoIdChange,
  onYoutubeVideoDurationChange,
}) => {
  const handleYoutubeIdBlur = () => {
    const trimmed = youtubeVideoId.trim();
    if (!trimmed) return;
    const id = extractYouTubeVideoId(trimmed);
    if (id) onYoutubeVideoIdChange(id);
  };

  return (
    <>
      <FormField label="YouTube link or video id" name="youtubeVideoIdTab">
        <Input
          id="youtubeVideoIdTab"
          placeholder="Video id or paste watch / youtu.be / embed URL"
          value={youtubeVideoId}
          onChange={(e) => onYoutubeVideoIdChange(e.target.value)}
          onBlur={handleYoutubeIdBlur}
          disabled={isSubmitting}
        />
      </FormField>
      <FormField label="Video duration" name="youtubeVideoDurationTab">
        <Input
          id="youtubeVideoDurationTab"
          placeholder="e.g. 10:45"
          value={youtubeVideoDuration}
          onChange={(e) => onYoutubeVideoDurationChange(e.target.value)}
          disabled={isSubmitting}
        />
      </FormField>
    </>
  );
};

export default CourseMaterialVideoFields;
