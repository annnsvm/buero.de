import { describe, expect, it } from 'vitest';
import { optimizeCloudinaryUrl } from '@/helpers/optimizeCloudinaryUrl';

describe('optimizeCloudinaryUrl', () => {
  it('inserts card transforms after /upload/', () => {
    expect(
      optimizeCloudinaryUrl(
        'https://res.cloudinary.com/demo/image/upload/v1/courses/abc.jpg',
        'card',
      ),
    ).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_fill,w_810,h_506/v1/courses/abc.jpg',
    );
  });

  it('leaves local fallbacks unchanged', () => {
    expect(optimizeCloudinaryUrl('/images/courses/course-1.webp')).toBe(
      '/images/courses/course-1.webp',
    );
  });

  it('does not double-apply transforms', () => {
    const already =
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/v1/courses/abc.jpg';
    expect(optimizeCloudinaryUrl(already, 'modal')).toBe(already);
  });
});
