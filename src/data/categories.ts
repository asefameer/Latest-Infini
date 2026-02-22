import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    slug: 'apparel',
    name: 'Apparel',
    description: 'Premium streetwear and fashion pieces crafted for the bold.',
    image: '/placeholder.svg',
    productCount: 4,
  },
  {
    id: 'cat-2',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Statement accessories that complete your look.',
    image: '/placeholder.svg',
    productCount: 3,
  },
  {
    id: 'cat-3',
    slug: 'footwear',
    name: 'Footwear',
    description: 'Engineered for performance and style.',
    image: '/placeholder.svg',
    productCount: 2,
  },
  {
    id: 'cat-4',
    slug: 'limited-drops',
    name: 'Limited Drops',
    description: 'Exclusive releases. Once they\'re gone, they\'re gone.',
    image: '/placeholder.svg',
    productCount: 3,
  },
];
