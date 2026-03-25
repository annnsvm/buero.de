let loadPromise: Promise<void> | null = null;

export const loadYoutubeIframeApi = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.YT?.Player && window.YT?.PlayerState) {
    return Promise.resolve();
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = new Promise((resolve, reject) => {
    const finish = () => resolve();
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try {
        previous?.();
      } finally {
        finish();
      }
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => reject(new Error('Failed to load YouTube iframe API'));
      document.body.appendChild(tag);
    }
  });
  return loadPromise;
};
