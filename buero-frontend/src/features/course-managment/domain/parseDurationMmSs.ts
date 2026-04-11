export const parseDurationMmSs = (raw: string): number | null => {
  const match = raw.trim().match(/^(\d+):([0-5]\d)$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};
