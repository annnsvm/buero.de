import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BaseDialog, ModalScrollArea } from '@/components/modal';
import { FormField, Input, Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';
import { useAppDispatch } from '@/redux/hooks';
import { addWord } from '@/redux/slices/vocabulary/vocabularySlice';
import type { VocabularyCategory } from '@/types/features/vocabulary/Vocabulary.types';

const CATEGORIES: VocabularyCategory[] = ['Vocabulary', 'Idiom', 'Phrase', 'Grammar', 'Other'];

const addVocabularySchema = z.object({
  word: z
    .string()
    .min(1, { message: 'Word is required' })
    .max(200, { message: 'Word is too long' }),
  translation: z
    .string()
    .min(1, { message: 'Translation is required' })
    .max(200, { message: 'Translation is too long' }),
  category: z.enum(['Vocabulary', 'Idiom', 'Phrase', 'Grammar', 'Other']),
  notes: z.string().max(80, { message: 'Notes must be 80 characters or fewer' }).optional(),
});

type AddVocabularyFormValues = z.infer<typeof addVocabularySchema>;

type AddVocabularyModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onExitAnimationComplete?: () => void;
};

const AddVocabularyModal: React.FC<AddVocabularyModalProps> = ({
  isOpen,
  handleOpenChange,
  onExitAnimationComplete,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [view, setView] = useState<'form' | 'success'>('form');
  const [addedWord, setAddedWord] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<AddVocabularyFormValues>({
    resolver: zodResolver(addVocabularySchema),
    mode: 'onChange',
    defaultValues: {
      word: '',
      translation: '',
      category: 'Vocabulary',
      notes: '',
    },
  });

  const handleClose = () => {
    reset();
    setView('form');
    setAddedWord('');
    handleOpenChange(false);
  };

  const onSubmit = handleSubmit((values) => {
    dispatch(
      addWord({
        id: crypto.randomUUID(),
        word: values.word,
        translation: values.translation,
        category: values.category,
        notes: values.notes || undefined,
        createdAt: new Date().toISOString(),
      }),
    );
    setAddedWord(values.word);
    setView('success');
  });

  const handleAddAnother = () => {
    reset();
    setView('form');
    setAddedWord('');
  };

  const customDialogClass =
    'relative z-[1] flex max-h-[min(90vh,720px)] w-[calc(100%-2rem)] max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white px-6 pt-6 pb-6 focus:outline-none sm:px-8 sm:pb-8 [&>button:hover]:text-[var(--color-primary)]';

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
      contentClassName={customDialogClass}
    >
      <ModalScrollArea contentGutter>
      {view === 'form' ? (
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-[var(--color-neutral-darkest)]">
            Add to Vocabulary
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Save unknown words and their translations for later review
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <FormField name="vocab-word" error={errors.word?.message}>
              <label
                htmlFor="vocab-word"
                className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]"
              >
                Word
              </label>
              <Input
                id="vocab-word"
                type="text"
                placeholder="e.g., Wanderlust"
                className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
                {...register('word')}
              />
            </FormField>

            <FormField name="vocab-translation" error={errors.translation?.message}>
              <label
                htmlFor="vocab-translation"
                className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]"
              >
                Translation
              </label>
              <Input
                id="vocab-translation"
                type="text"
                placeholder="Translation"
                className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
                {...register('translation')}
              />
            </FormField>

            <div>
              <label
                htmlFor="vocab-category"
                className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]"
              >
                Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    id="vocab-category"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div>
              <label
                htmlFor="vocab-notes"
                className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]"
              >
                Notes{' '}
                <span className="font-normal text-[var(--color-text-secondary)]">(optional)</span>
              </label>
              <textarea
                id="vocab-notes"
                rows={2}
                maxLength={80}
                placeholder="Add example sentences, context, or pronunciation tips"
                className="w-full resize-none rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
                {...register('notes')}
              />
              <p className="mt-1 text-right text-xs text-[var(--color-text-secondary)]">
                {watch('notes')?.length ?? 0}/80
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="mt-2 w-full rounded-full bg-[var(--color-cod-gray-base)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Vocabulary
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="relative h-[80px] w-[80px] rounded-full bg-[var(--color-primary)]">
            <Icon
              name={ICON_NAMES.CHECK}
              size={80}
              color="var(--color-white)"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <p className="mt-4 text-xl font-semibold text-[var(--color-neutral-darkest)]">
            Added &ldquo;{addedWord}&rdquo; to vocabulary!
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleAddAnother}
              className="rounded-full border border-[var(--opacity-neutral-darkest-15)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)]"
            >
              Add Another
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                if (courseId) navigate(ROUTES.VOCABULARY.replace(':courseId', courseId));
              }}
              className="rounded-full border border-[var(--opacity-neutral-darkest-15)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)]"
            >
              Go to Vocabulary
            </button>
          </div>
        </div>
      )}
      </ModalScrollArea>
    </BaseDialog>
  );
};

export default AddVocabularyModal;
