const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const maybe = error as { response?: { data?: { message?: string | string[] } } };
    const message = maybe.response?.data?.message;
    if (Array.isArray(message)) {
      return message[0] ?? fallback;
    }
    return message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export { getErrorMessage };
