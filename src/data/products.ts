import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'p-1', slug: 'nova-eclipse-hoodie', name: 'Eclipse Hoodie', brand: 'nova',
    category: 'apparel', price: 4500, compareAtPrice: 5200, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Oversized silhouette meets technical fabric. The Eclipse Hoodie features a hidden kangaroo pocket and reflective infinity logo detailing.',
    specs: [{ label: 'Material', value: '100% Organic Cotton' }, { label: 'Fit', value: 'Oversized' }, { label: 'Weight', value: '380 GSM' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL'] }, { id: 'v-color', name: 'Color', type: 'color', options: ['Obsidian', 'Fog', 'Midnight Blue'] }],
    tags: ['trending', 'new'], inStock: true, isNew: true, isTrending: true,
  },
  {
    id: 'p-2', slug: 'nova-phantom-tee', name: 'Phantom Tee', brand: 'nova',
    category: 'apparel', price: 2200, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Minimalist cut with maximal impact. Premium pima cotton with a subtle tonal logo.',
    specs: [{ label: 'Material', value: 'Pima Cotton' }, { label: 'Fit', value: 'Regular' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }, { id: 'v-color', name: 'Color', type: 'color', options: ['Black', 'White', 'Cement'] }],
    tags: ['trending'], inStock: true, isTrending: true,
  },
  {
    id: 'p-3', slug: 'ltm-aura-jacket', name: 'Aura Jacket', brand: 'live-the-moment',
    category: 'apparel', price: 7800, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Water-resistant tech shell with inner fleece lining. Designed to move with you from city to trail.',
    specs: [{ label: 'Material', value: 'Nylon / Fleece' }, { label: 'Water Resistance', value: '5000mm' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['M', 'L', 'XL'] }, { id: 'v-color', name: 'Color', type: 'color', options: ['Forest', 'Charcoal'] }],
    tags: ['new'], inStock: true, isNew: true,
  },
  {
    id: 'p-4', slug: 'xforce-titan-joggers', name: 'Titan Joggers', brand: 'x-force',
    category: 'apparel', price: 3800, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Four-way stretch performance joggers with zippered pockets and tapered fit.',
    specs: [{ label: 'Material', value: 'Polyester Blend' }, { label: 'Fit', value: 'Tapered' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL'] }, { id: 'v-color', name: 'Color', type: 'color', options: ['Black', 'Slate'] }],
    tags: ['trending'], inStock: true, isTrending: true,
  },
  {
    id: 'p-5', slug: 'nova-infinity-cap', name: 'Infinity Cap', brand: 'nova',
    category: 'accessories', price: 1800, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Structured 6-panel cap with embroidered infinity symbol. Adjustable strap.',
    specs: [{ label: 'Material', value: 'Cotton Twill' }],
    variants: [{ id: 'v-color', name: 'Color', type: 'color', options: ['Black', 'Navy', 'Sand'] }],
    tags: [], inStock: true,
  },
  {
    id: 'p-6', slug: 'ltm-wrist-band', name: 'Pulse Wristband', brand: 'live-the-moment',
    category: 'accessories', price: 900, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Woven nylon wristband with magnetic clasp. Festival-ready.',
    specs: [{ label: 'Material', value: 'Nylon' }],
    variants: [{ id: 'v-color', name: 'Color', type: 'color', options: ['Neon Cyan', 'Violet', 'Black'] }],
    tags: [], inStock: true,
  },
  {
    id: 'p-7', slug: 'xforce-runner-v1', name: 'Runner V1', brand: 'x-force',
    category: 'footwear', price: 8500, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Lightweight mesh upper with EVA midsole. Engineered for urban movement.',
    specs: [{ label: 'Upper', value: 'Engineered Mesh' }, { label: 'Sole', value: 'EVA + Rubber' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['40', '41', '42', '43', '44'] }, { id: 'v-color', name: 'Color', type: 'color', options: ['Black/Cyan', 'White/Grey'] }],
    tags: ['new', 'trending'], inStock: true, isNew: true, isTrending: true,
  },
  {
    id: 'p-8', slug: 'xforce-slide-pro', name: 'Slide Pro', brand: 'x-force',
    category: 'footwear', price: 2200, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Contoured footbed slides with embossed branding.',
    specs: [{ label: 'Material', value: 'EVA' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['40', '41', '42', '43', '44'] }],
    tags: [], inStock: true,
  },
  {
    id: 'p-9', slug: 'nova-legacy-chain', name: 'Legacy Chain', brand: 'nova',
    category: 'accessories', price: 3200, compareAtPrice: 3800, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Stainless steel chain necklace with micro infinity pendant. 22-inch length.',
    specs: [{ label: 'Material', value: 'Stainless Steel' }, { label: 'Length', value: '22 inches' }],
    variants: [{ id: 'v-color', name: 'Color', type: 'color', options: ['Silver', 'Gold'] }],
    tags: ['limited'], inStock: true,
  },
  {
    id: 'p-10', slug: 'ltm-limitless-tee', name: 'Limitless Tee (LE)', brand: 'live-the-moment',
    category: 'limited-drops', price: 3500, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Limited edition collaborative print tee. Only 200 pieces.',
    specs: [{ label: 'Material', value: 'Heavy Cotton' }, { label: 'Edition', value: '200 pcs' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['M', 'L', 'XL'] }],
    tags: ['limited', 'new'], inStock: true, isNew: true,
  },
  {
    id: 'p-11', slug: 'xforce-drop-001', name: 'DROP-001 Jacket', brand: 'x-force',
    category: 'limited-drops', price: 12000, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Technical windbreaker with magnetic closures. Numbered edition.',
    specs: [{ label: 'Material', value: 'Ripstop Nylon' }, { label: 'Edition', value: '100 pcs' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['M', 'L'] }],
    tags: ['limited'], inStock: true,
  },
  {
    id: 'p-12', slug: 'nova-genesis-shorts', name: 'Genesis Shorts (LE)', brand: 'nova',
    category: 'limited-drops', price: 2800, currency: 'BDT',
    images: ['/placeholder.svg'], description: 'Embroidered mesh shorts with drawstring waist. Festival exclusive.',
    specs: [{ label: 'Material', value: 'Mesh / Cotton' }],
    variants: [{ id: 'v-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL'] }],
    tags: ['limited'], inStock: true,
  },
];

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductsByCategory = (catSlug: string) => products.filter(p => p.category === catSlug);
export const getProductsByBrand = (brand: string) => products.filter(p => p.brand === brand);
export const getTrendingProducts = () => products.filter(p => p.isTrending);
export const getNewProducts = () => products.filter(p => p.isNew);
export const getFeaturedProducts = () => products.slice(0, 6);
