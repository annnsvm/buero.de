export const deleteMaterialCopy = (params: {
  title: string;
  kind: 'video' | 'quiz' | 'other';
}): string => {
  const safeTitle = params.title.trim() || 'Untitled';
  if (params.kind === 'video') {
    return `Delete the video lesson "${safeTitle}"?\nThis cannot be undone.`;
  }
  if (params.kind === 'quiz') {
    return `Delete the quiz "${safeTitle}"?\nThis cannot be undone.`;
  }
  return `Delete the material "${safeTitle}"?\nThis cannot be undone.`;
};
