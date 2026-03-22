import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import { Button, Input } from '@/components/ui';
import { TAG_SUGGESTIONS } from '@/features/course-managment/helpers/courseCreation.consts';
import { normalizeTag } from '@/features/course-managment/helpers/courseTags.helpers';
import type {
  CourseTagsSectionProps,
  TagActionMode,
} from '@/types/features/courseManagment/CourseTagsSection.types';

const CourseTagsSection: React.FC<CourseTagsSectionProps> = ({ tags, disabled, onChangeTags, error }) => {
  const [tagInput, setTagInput] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagActionMode, setTagActionMode] = useState<TagActionMode>('none');

  const isEditing = activeTag != null;
  const filteredSuggestions = TAG_SUGGESTIONS.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()),
  );

  const handleSelectTag = (tag: string) => {
    if (disabled) return;
    setActiveTag(tag);
    setTagInput(tag);
    setTagActionMode('edit');
  };

  const handleAddTag = () => {
    if (disabled) return;
    const next = normalizeTag(tagInput);
    if (!next) return;
    const exists = tags.some((t) => t.toLowerCase() === next.toLowerCase());
    if (exists) {
      setTagInput('');
      return;
    }
    onChangeTags([...tags, next]);
    setTagInput('');
  };

  const handleDeleteActiveTag = () => {
    if (disabled || !activeTag) return;
    onChangeTags(tags.filter((t) => t !== activeTag));
    setActiveTag(null);
    setTagInput('');
    setTagActionMode('none');
  };

  const handleApplyEditActiveTag = () => {
    if (disabled || !activeTag) return;
    const next = normalizeTag(tagInput);
    if (!next) {
      return;
    }
    const exists = tags.some((t) => t.toLowerCase() === next.toLowerCase() && t !== activeTag);
    if (exists) return;
    onChangeTags(tags.map((t) => (t === activeTag ? next : t)));
    setActiveTag(next);
    setTagInput('');
    setTagActionMode('none');
  };

  const handleClearInput = () => {
    if (disabled) return;
    setTagInput('');
    setActiveTag(null);
    setTagActionMode('none');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (isEditing) handleApplyEditActiveTag();
    else handleAddTag();
  };

  return (
    <section
      className="rounded-2xl bg-[var(--color-surface-background)] p-6"
      aria-label="Tags editor"
    >
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Add tags</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => {
          const isActive = t === activeTag;
          return (
            <div
              key={t}
              className={`relative inline-flex items-center rounded-full text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-muted)]/30 text-[var(--color-foreground)]'
              } ${disabled ? 'opacity-70' : ''}`}
            >
              <button
                type="button"
                onClick={() => handleSelectTag(t)}
                aria-pressed={isActive}
                disabled={disabled}
                className={`rounded-full px-3 py-1.5 text-left ${
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${isActive ? 'pr-10' : ''}`}
                aria-label={`Select tag ${t}`}
              >
                {t}
              </button>
              {isActive ? (
                <button
                  type="button"
                  onClick={handleDeleteActiveTag}
                  aria-label={`Remove tag ${t}`}
                  disabled={disabled}
                  className="absolute top-1/2 right-1.5 grid h-7 w-7 -translate-y-1/2 place-items-center text-[var(--color-neutral-darkest)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Icon name={ICON_NAMES.X} size={14} ariaHidden />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Input
            id="tagInput"
            placeholder={isEditing ? 'Edit tag and press Enter' : 'Put a tag'}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            aria-label="Tag input"
            disabled={disabled}
            className={tagInput ? 'pr-10' : ''}
          />
          {tagInput ? (
            <button
              type="button"
              onClick={handleClearInput}
              aria-label="Clear tag input"
              disabled={disabled}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Icon name={ICON_NAMES.X} size={16} ariaHidden />
            </button>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outlineDark"
          onClick={isEditing ? handleApplyEditActiveTag : handleAddTag}
          disabled={disabled || !tagInput.trim()}
        >
          {isEditing ? 'Apply' : 'Add tag'}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {filteredSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              if (disabled) return;
              setTagInput(s);
              setActiveTag(null);
              setTagActionMode('none');
            }}
            disabled={disabled}
            className="rounded-full border border-[var(--color-border-default)] bg-white px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={`Use tag ${s}`}
          >
            {s}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default CourseTagsSection;
