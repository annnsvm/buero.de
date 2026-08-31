import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileText, Image, Link as LinkIcon, Trash2 } from 'lucide-react';

import {
  createLinkAttachment,
  deleteAttachment,
  downloadAttachmentFile,
  fetchAttachments,
  uploadAttachment,
} from '@/api/materialAttachmentsApi';
import { Button, FormField, Input, Spinner } from '@/components/ui';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
];

const ACCEPT =
  '.pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf,image/jpeg,image/png,image/webp,image/gif';

const MAX_BYTES = 10 * 1024 * 1024;

const formatSize = (bytes: number | null | undefined): string => {
  if (bytes == null || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const attachmentIcon = (item: { kind: string; mimeType?: string | null }) => {
  if (item.kind === 'link') return LinkIcon;
  if (item.mimeType?.startsWith('image/')) return Image;
  return FileText;
};

type PendingAdd =
  | { draftId: string; kind: 'file'; file: File }
  | { draftId: string; kind: 'link'; title: string; url: string };

export type CourseMaterialAttachmentsSectionProps = {
  courseId: string;
  moduleId: string;
  materialId: string;
  onDraftChange?: (hasDraft: boolean) => void;
  flushRef?: React.MutableRefObject<(() => Promise<void>) | null>;
};

const CourseMaterialAttachmentsSection: React.FC<CourseMaterialAttachmentsSectionProps> = ({
  courseId,
  moduleId,
  materialId,
  onDraftChange,
  flushRef,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [savedItems, setSavedItems] = useState<MaterialAttachment[]>([]);
  const [pendingAdds, setPendingAdds] = useState<PendingAdd[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const pendingAddsRef = useRef(pendingAdds);
  const pendingDeleteIdsRef = useRef(pendingDeleteIds);
  pendingAddsRef.current = pendingAdds;
  pendingDeleteIdsRef.current = pendingDeleteIds;

  const hasDraft = pendingAdds.length > 0 || pendingDeleteIds.length > 0;

  useEffect(() => {
    onDraftChange?.(hasDraft);
  }, [hasDraft, onDraftChange]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAttachments(courseId, moduleId, materialId);
      setSavedItems(res.data);
      setPendingAdds([]);
      setPendingDeleteIds([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load attachments'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, moduleId, materialId]);

  useEffect(() => {
    void load();
  }, [load]);

  const flushDrafts = useCallback(async () => {
    const adds = pendingAddsRef.current;
    const deletes = pendingDeleteIdsRef.current;
    if (adds.length === 0 && deletes.length === 0) return;

    setIsFlushing(true);
    setError(null);
    try {
      for (const add of adds) {
        if (add.kind === 'file') {
          await uploadAttachment(courseId, moduleId, materialId, add.file);
        } else {
          await createLinkAttachment(courseId, moduleId, materialId, {
            title: add.title,
            url: add.url,
          });
        }
      }
      for (const attachmentId of deletes) {
        await deleteAttachment(courseId, moduleId, materialId, attachmentId);
      }
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save attachments'));
      throw err;
    } finally {
      setIsFlushing(false);
    }
  }, [courseId, load, materialId, moduleId]);

  useEffect(() => {
    if (!flushRef) return;
    flushRef.current = flushDrafts;
    return () => {
      flushRef.current = null;
    };
  }, [flushDrafts, flushRef]);

  const handlePickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Unsupported file type. Allowed: PDF, images, Word, Excel, TXT, ZIP.');
      return;
    }
    setError(null);
    setPendingAdds((prev) => [...prev, { draftId: crypto.randomUUID(), kind: 'file', file }]);
  };

  const handleAddLink = () => {
    const title = linkTitle.trim();
    const url = linkUrl.trim();
    if (!title || !url) {
      setError('Link title and URL are required');
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setError('Enter a valid URL including https://');
      return;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      setError('Enter a valid URL including https://');
      return;
    }
    setError(null);
    setPendingAdds((prev) => [...prev, { draftId: crypto.randomUUID(), kind: 'link', title, url }]);
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleDownload = async (item: MaterialAttachment) => {
    if (item.kind === 'link') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setDownloadingId(item.id);
    setError(null);
    try {
      await downloadAttachmentFile(courseId, moduleId, materialId, item.id, item.fileName || item.title);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not download file'));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemoveSaved = (attachmentId: string) => {
    setError(null);
    setPendingDeleteIds((prev) => (prev.includes(attachmentId) ? prev : [...prev, attachmentId]));
  };

  const handleUndoRemove = (attachmentId: string) => {
    setPendingDeleteIds((prev) => prev.filter((id) => id !== attachmentId));
  };

  const handleRemovePending = (draftId: string) => {
    setPendingAdds((prev) => prev.filter((item) => item.draftId !== draftId));
  };

  const busy = isFlushing;

  return (
    <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-6">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Lesson attachments</p>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        Optional. Added files and links are stored only after you click Save changes, then Confirm.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handlePickFile}
        disabled={busy}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outlineDark"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          Upload file
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <FormField label="Link title" name="attachmentLinkTitle">
          <Input
            id="attachmentLinkTitle"
            placeholder="e.g. Extra reading"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            disabled={busy}
          />
        </FormField>
        <FormField label="Link URL" name="attachmentLinkUrl">
          <Input
            id="attachmentLinkUrl"
            placeholder="https://"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            disabled={busy}
          />
        </FormField>
        <Button type="button" variant="solid" onClick={handleAddLink} disabled={busy}>
          Add link
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Spinner className="size-4" />
          Loading attachments
        </div>
      ) : savedItems.length === 0 && pendingAdds.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">No attachments yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {savedItems.map((item) => {
            const IconCmp = attachmentIcon(item);
            const sizeLabel = formatSize(item.sizeBytes);
            const willRemove = pendingDeleteIds.includes(item.id);
            return (
              <li
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] px-3 py-2 ${
                  willRemove ? 'opacity-60' : ''
                }`}
              >
                <IconCmp className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{item.title}</p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {willRemove
                      ? 'Will be removed after Confirm'
                      : item.kind === 'link'
                        ? item.url
                        : [item.fileName, sizeLabel].filter(Boolean).join(' · ')}
                  </p>
                </div>
                {willRemove ? (
                  <button
                    type="button"
                    onClick={() => handleUndoRemove(item.id)}
                    disabled={busy}
                    className="rounded px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                  >
                    Undo
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label={item.kind === 'link' ? `Open ${item.title}` : `Download ${item.title}`}
                      onClick={() => void handleDownload(item)}
                      disabled={busy || downloadingId === item.id}
                      className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                    >
                      {item.kind === 'link' ? (
                        <LinkIcon className="h-4 w-4" aria-hidden />
                      ) : (
                        <Download className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => handleRemoveSaved(item.id)}
                      disabled={busy}
                      className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </>
                )}
              </li>
            );
          })}
          {pendingAdds.map((item) => {
            const IconCmp = attachmentIcon({
              kind: item.kind,
              mimeType: item.kind === 'file' ? item.file.type : null,
            });
            const title = item.kind === 'file' ? item.file.name : item.title;
            const detail = item.kind === 'file' ? `${formatSize(item.file.size)} · not saved yet` : `${item.url} · not saved yet`;
            return (
              <li
                key={item.draftId}
                className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border-subtle)] px-3 py-2"
              >
                <IconCmp className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">{detail}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${title}`}
                  onClick={() => handleRemovePending(item.draftId)}
                  disabled={busy}
                  className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CourseMaterialAttachmentsSection;
