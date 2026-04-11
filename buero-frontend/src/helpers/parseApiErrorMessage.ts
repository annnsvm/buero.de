export const parseApiErrorMessage = (err: unknown, fallback: string): string => {
  const message =
    err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
      : err instanceof Error
        ? err.message
        : fallback;
  return Array.isArray(message) ? message.join(', ') : String(message);
};
