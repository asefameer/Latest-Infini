/**
 * In-memory data store used when API_CONFIG.USE_MOCK is true.
 * Simulates a database with CRUD operations.
 * 
 * When you deploy Azure Functions + Azure SQL:
 * 1. The API service methods will call httpClient instead of this store.
 * 2. This file becomes unused and can be removed.
 */
import type { Product, Event, Category, BrandContent, Order } from '@/types';
import type { Discount } from '@/pages/admin/DiscountsAdmin';
import type { Customer, ChatConversation, EmailCampaign, PushNotification, KBArticle } from '@/data/crm-mock';

// Import seed data
import { products as seedProducts } from '@/data/products';
import { events as seedEvents } from '@/data/events';
import { categories as seedCategories } from '@/data/categories';
import { brands as seedBrands } from '@/data/brands';
import {
  mockCustomers, mockConversations, mockEmailCampaigns,
  mockPushNotifications, mockKBArticles,
} from '@/data/crm-mock';

// ── Reactive store with change listeners ──
type Listener = () => void;
const listeners = new Set<Listener>();
export const subscribe = (fn: Listener) => { listeners.add(fn); return () => listeners.delete(fn); };
const notify = () => listeners.forEach(fn => fn());

// ── Mutable stores ──
let _products: Product[] = [...seedProducts];
let _events: Event[] = [...seedEvents];
let _categories: Category[] = [...seedCategories];
let _brands: BrandContent[] = [...seedBrands];
let _discounts: Discount[] = [
  { id: 'd1', code: 'NOVA20', description: '20% off all Nova products', type: 'percentage', value: 20, currency: 'BDT', appliesTo: 'products', minPurchase: 500, maxUses: 200, usedCount: 87, startDate: '2026-02-01', endDate: '2026-03-31', isActive: true },
  { id: 'd2', code: 'ENCOUNTER500', description: '৳500 off event tickets', type: 'fixed', value: 500, currency: 'BDT', appliesTo: 'tickets', minPurchase: 2000, maxUses: 100, usedCount: 34, startDate: '2026-02-15', endDate: '2026-04-15', isActive: true },
  { id: 'd3', code: 'WELCOME10', description: '10% off first order', type: 'percentage', value: 10, currency: 'BDT', appliesTo: 'all', maxUses: 1000, usedCount: 412, startDate: '2026-01-01', endDate: '2026-12-31', isActive: true },
  { id: 'd4', code: 'XFORCE15', description: '15% off X-Force events', type: 'percentage', value: 15, currency: 'BDT', appliesTo: 'events', maxUses: 50, usedCount: 50, startDate: '2026-01-10', endDate: '2026-02-10', isActive: false },
  { id: 'd5', code: 'FLASH1000', description: '৳1000 off sitewide', type: 'fixed', value: 1000, currency: 'BDT', appliesTo: 'all', minPurchase: 5000, maxUses: 30, usedCount: 12, startDate: '2026-02-20', endDate: '2026-02-28', isActive: true },
];
let _customers: Customer[] = [...mockCustomers];
let _conversations: ChatConversation[] = [...mockConversations];
let _emailCampaigns: EmailCampaign[] = [...mockEmailCampaigns];
let _pushNotifications: PushNotification[] = [...mockPushNotifications];
let _kbArticles: KBArticle[] = [...mockKBArticles];

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  placement: 'hero' | 'editions' | 'encounter' | 'trinity';
  isActive: boolean;
  order: number;
}

let _banners: Banner[] = [
  { id: 'b1', title: 'Nova Spring Collection', imageUrl: '/placeholder.svg', link: '/editions', placement: 'hero', isActive: true, order: 1 },
  { id: 'b2', title: 'Encounter Events', imageUrl: '/placeholder.svg', link: '/encounter', placement: 'encounter', isActive: true, order: 1 },
  { id: 'b3', title: 'Trinity Story', imageUrl: '/placeholder.svg', link: '/the-trinity', placement: 'trinity', isActive: true, order: 1 },
];

// ── CRUD Helpers ──
function crud<T extends { id: string }>(getList: () => T[], setList: (items: T[]) => void) {
  return {
    getAll: () => [...getList()],
    getById: (id: string) => getList().find(item => item.id === id) || null,
    create: (item: T) => { setList([...getList(), item]); notify(); return item; },
    update: (id: string, data: Partial<T>) => {
      const list = getList();
      const idx = list.findIndex(i => i.id === id);
      if (idx === -1) throw new Error(`Item ${id} not found`);
      list[idx] = { ...list[idx], ...data };
      setList([...list]);
      notify();
      return list[idx];
    },
    delete: (id: string) => { setList(getList().filter(i => i.id !== id)); notify(); },
  };
}

// ── Exported stores ──
export const productStore = {
  ...crud(() => _products, v => { _products = v; }),
  getBySlug: (slug: string) => _products.find(p => p.slug === slug) || null,
  getByCategory: (cat: string) => _products.filter(p => p.category === cat),
  getByBrand: (brand: string) => _products.filter(p => p.brand === brand),
  getTrending: () => _products.filter(p => p.isTrending),
  getNew: () => _products.filter(p => p.isNew),
  getFeatured: () => _products.slice(0, 6),
};

export const eventStore = {
  ...crud(() => _events, v => { _events = v; }),
  getBySlug: (slug: string) => _events.find(e => e.slug === slug) || null,
  getByBrand: (brand: string) => _events.filter(e => e.brand === brand),
  getFeatured: () => _events.filter(e => e.isFeatured),
};

export const categoryStore = crud(() => _categories, v => { _categories = v; });
export const brandStore = {
  ...crud(() => _brands, v => { _brands = v; }),
  getById: (id: string) => _brands.find(b => b.id === id) || null,
};

export const discountStore = {
  ...crud(() => _discounts, v => { _discounts = v; }),
  getByCode: (code: string) => _discounts.find(d => d.code === code && d.isActive) || null,
  getByCategory: (cat: string) => _discounts.filter(d => d.appliesTo === cat || d.appliesTo === 'all'),
};

export const bannerStore = {
  ...crud(() => _banners, v => { _banners = v; }),
  getByPlacement: (placement: string) => _banners.filter(b => b.placement === placement && b.isActive),
};

export const customerStore = crud(() => _customers, v => { _customers = v; });
export const conversationStore = crud(() => _conversations, v => { _conversations = v; });
export const emailCampaignStore = crud(() => _emailCampaigns, v => { _emailCampaigns = v; });
export const pushNotificationStore = crud(() => _pushNotifications, v => { _pushNotifications = v; });
export const kbArticleStore = crud(() => _kbArticles, v => { _kbArticles = v; });

// ── Orders ──
let _orders: Order[] = [
  {
    id: 'ORD-2026-0001', customerId: 'c1', customerEmail: 'aya@example.com', customerName: 'Aya Nakamura',
    status: 'delivered', paymentMethod: 'stripe', paymentStatus: 'paid',
    subtotal: 6700, discount: 0, shippingCost: 150, total: 6850, currency: 'BDT',
    items: [
      { productId: 'p-1', productName: 'Eclipse Hoodie', productSlug: 'nova-eclipse-hoodie', quantity: 1, price: 4500, selectedVariants: { Size: 'M', Color: 'Obsidian' }, image: '/placeholder.svg' },
      { productId: 'p-2', productName: 'Phantom Tee', productSlug: 'nova-phantom-tee', quantity: 1, price: 2200, selectedVariants: { Size: 'M', Color: 'Black' }, image: '/placeholder.svg' },
    ],
    shippingAddress: { id: 'a1', label: 'Home', fullName: 'Aya Nakamura', phone: '+33 6 12 34 56 78', line1: '12 Rue de Rivoli', city: 'Paris', district: 'Île-de-France', postalCode: '75001' },
    notes: '', createdAt: '2026-02-10T14:30:00Z', updatedAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'ORD-2026-0045', customerId: 'c2', customerEmail: 'marcus@example.com', customerName: 'Marcus Chen',
    status: 'processing', paymentMethod: 'stripe', paymentStatus: 'paid',
    subtotal: 3800, discount: 0, shippingCost: 150, total: 3950, currency: 'BDT',
    items: [
      { productId: 'p-4', productName: 'Titan Joggers', productSlug: 'xforce-titan-joggers', quantity: 1, price: 3800, selectedVariants: { Size: 'L', Color: 'Black' }, image: '/placeholder.svg' },
    ],
    shippingAddress: { id: 'a2', label: 'Home', fullName: 'Marcus Chen', phone: '+1 555 234 5678', line1: '450 Broadway', city: 'New York', district: 'NY', postalCode: '10013' },
    notes: '', createdAt: '2026-02-22T09:15:00Z', updatedAt: '2026-02-22T09:15:00Z',
  },
  {
    id: 'ORD-2026-0052', customerId: 'c5', customerEmail: 'sofia@example.com', customerName: 'Sofia Reyes',
    status: 'shipped', paymentMethod: 'bkash', paymentStatus: 'paid',
    subtotal: 12000, discount: 2400, shippingCost: 0, total: 9600, currency: 'BDT', promoCode: 'NOVA20',
    items: [
      { productId: 'p-11', productName: 'DROP-001 Jacket', productSlug: 'xforce-drop-001', quantity: 1, price: 12000, selectedVariants: { Size: 'M' }, image: '/placeholder.svg' },
    ],
    shippingAddress: { id: 'a3', label: 'Home', fullName: 'Sofia Reyes', phone: '+34 612 345 678', line1: 'Calle Gran Vía 28', city: 'Madrid', district: 'Madrid', postalCode: '28013' },
    notes: 'VIP customer — expedite shipping', createdAt: '2026-02-23T16:00:00Z', updatedAt: '2026-02-24T10:30:00Z',
  },
];

export const orderStore = {
  ...crud(() => _orders, v => { _orders = v; }),
  getByEmail: (email: string) => _orders.filter(o => o.customerEmail === email),
  getByCustomerId: (id: string) => _orders.filter(o => o.customerId === id),
};
