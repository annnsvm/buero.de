export type MaterialAttachmentKind = 'file' | 'link';

export type MaterialAttachment = {
  id: string;
  materialId: string;
  kind: MaterialAttachmentKind;
  title: string;
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  orderIndex: number;
};
