export type CoverImagePreset = 'card' | 'modal' | 'editor';

const TRANSFORMS: Record<CoverImagePreset, string> = {
  card: 'f_auto,q_auto,c_fill,w_810,h_506',
  modal: 'f_auto,q_auto,c_fill,w_1280,h_800',
  editor: 'f_auto,q_auto,c_limit,w_1200',
};

const CLOUDINARY_UPLOAD =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;

/** Resize/compress Cloudinary covers at request time. Local and blob URLs stay unchanged. */
export const optimizeCloudinaryUrl = (
  url: string,
  preset: CoverImagePreset = 'card',
): string => {
  const match = url.match(CLOUDINARY_UPLOAD);
  if (!match) return url;

  const [, prefix, rest] = match;
  if (/^(?:[^/]*[,/])?(?:f_auto|q_auto|w_\d+)/.test(rest)) return url;

  return `${prefix}${TRANSFORMS[preset]}/${rest}`;
};
