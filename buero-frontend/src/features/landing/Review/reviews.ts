// reviews.ts
import type { Review } from '@/types/features/home/Review.types';

export const reviews: Review[] = [
  {
    quote:
      'I moved to Munich not speaking a word. Six months with büro.de and I handled my entire Anmeldung process in German. The cultural lessons were a game-changer.',
    name: 'Sofia Mendez',
    meta: 'From Mexico, living in Munich',
    avatar: '/images/home/review1.webp',
  },
  {
    quote:
      "Other platforms teach you textbook German. büro.de teaches you how Germans actually talk. I finally understand my colleagues' jokes.",
    name: 'Priya Sharma',
    meta: 'From India, living in Berlin',
    avatar: '/images/home/review2.webp',
  },
  {
    quote:
      'The bureaucracy modules alone are worth it. I knew exactly what documents to bring to the Ausländerbehörde. No stress, no surprises.',
    name: 'James Chen',
    meta: 'From Canada, living in Hamburg',
    avatar: '/images/home/review3.webp',
  },
];