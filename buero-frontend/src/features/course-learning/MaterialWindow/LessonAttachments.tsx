import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Image, Link as LinkIcon } from 'lucide-react';

import { downloadAttachmentFile } from '@/api/materialAttachmentsApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';

export type LessonAttachmentsProps = {
  attachments?: MaterialAttachment[];
  courseId?: string;
  moduleId?: string;
  materialId?: string;
};

const formatSize = (bytes: number | null | undefined): string => {
  if (bytes == null || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const LessonAttachments: React.FC<LessonAttachmentsProps> = ({
  attachments,
  courseId,
  moduleId,
  materialId,
}) => {
  const { t } = useTranslation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!attachments?.length) return null;

  const canDownloadViaApi = Boolean(courseId && moduleId && materialId);

  const handleDownload = async (item: MaterialAttachment) => {
    if (!courseId || !moduleId || !materialId) return;
    setDownloadingId(item.id);
    setError(null);
    try {
      await downloadAttachmentFile(courseId, moduleId, materialId, item.id, item.fileName || item.title);
    } catch (err) {
      setError(getErrorMessage(err, t('coursePage.attachments.downloadFailed')));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="mt-6 rounded-[20px] bg-[var(--color-neutral-white)] p-6 shadow-sm sm:mt-8 sm:rounded-[22px]">
      <h2 className="text-xl font-semibold text-[#56504c] sm:text-2xl">{t('coursePage.attachments.title')}</h2>
      {error ? (
        <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {attachments.map((item) => {
          const isImage = item.kind === 'file' && Boolean(item.mimeType?.startsWith('image/'));
          const IconCmp = item.kind === 'link' ? LinkIcon : isImage ? Image : FileText;
          const sizeLabel = formatSize(item.sizeBytes);
          const isDownloading = downloadingId === item.id;
          const actionLabel =
            item.kind === 'link'
              ? t('coursePage.attachments.openLink')
              : isDownloading
                ? t('coursePage.attachments.downloading')
                : t('coursePage.attachments.download');

          const inner = (
            <>
              <IconCmp className="h-4 w-4 shrink-0 text-[#e87753]" aria-hidden />
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium text-[#1b1b1b]">{item.title}</span>
                {sizeLabel ? <span className="block text-xs text-[#6f6865]">{sizeLabel}</span> : null}
              </span>
              <span className="shrink-0 text-xs font-medium text-[#e87753]">{actionLabel}</span>
            </>
          );

          const rowClassName =
            'flex w-full items-center gap-3 rounded-lg border border-[#d7cbc5] px-4 py-3 text-left transition hover:bg-[#faf6f4] disabled:cursor-wait disabled:opacity-70';

          return (
            <li key={item.id}>
              {item.kind === 'link' ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClassName}
                >
                  {inner}
                </a>
              ) : canDownloadViaApi ? (
                <button
                  type="button"
                  onClick={() => void handleDownload(item)}
                  disabled={isDownloading}
                  className={rowClassName}
                >
                  {inner}
                </button>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClassName}
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LessonAttachments;
