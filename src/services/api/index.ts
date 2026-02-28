/**
 * Unified API Service
 * 
 * Two-tier backend routing:
 * 1. 'azure' → Azure API (App Service)
 * 2. 'mock'  → In-memory store (set VITE_USE_MOCK=true)
 * 
 * All admin and customer-facing pages use the hooks in ./hooks.ts,
 * which call these API functions. Switching backends requires zero
 * changes to UI code.
 */
import { API_CONFIG } from './config';
import { httpClient } from './http-client';
import {
  productStore, eventStore, categoryStore, brandStore,
  discountStore, bannerStore, customerStore, conversationStore,
  emailCampaignStore, pushNotificationStore, kbArticleStore,
  orderStore,
  subscribe,
} from './mock-store';
import type { Product, Event, Category, BrandContent, Order } from '@/types';
import type { Discount } from '@/pages/admin/DiscountsAdmin';
import type { Banner } from './mock-store';

const mode = API_CONFIG.BACKEND_MODE;

// ── Products ──
export const productsApi = {
  getAll: async (): Promise<Product[]> =>
    mode === 'mock' ? productStore.getAll() : httpClient.get('/products'),
  getById: async (id: string): Promise<Product | null> =>
    mode === 'mock' ? productStore.getById(id) : httpClient.get(`/products/${id}`),
  getBySlug: async (slug: string): Promise<Product | null> =>
    mode === 'mock' ? productStore.getBySlug(slug) : httpClient.get(`/products/slug/${slug}`),
  getByCategory: async (cat: string): Promise<Product[]> =>
    mode === 'mock' ? productStore.getByCategory(cat) : httpClient.get(`/products?category=${cat}`),
  getByBrand: async (brand: string): Promise<Product[]> =>
    mode === 'mock' ? productStore.getByBrand(brand) : httpClient.get(`/products?brand=${brand}`),
  getTrending: async (): Promise<Product[]> =>
    mode === 'mock' ? productStore.getTrending() : httpClient.get('/products?trending=true'),
  getNew: async (): Promise<Product[]> =>
    mode === 'mock' ? productStore.getNew() : httpClient.get('/products?new=true'),
  getFeatured: async (): Promise<Product[]> =>
    mode === 'mock' ? productStore.getFeatured() : httpClient.get('/products?featured=true'),
  create: async (p: Product): Promise<Product> =>
    mode === 'mock' ? productStore.create(p) : httpClient.post('/products', p),
  update: async (id: string, data: Partial<Product>): Promise<Product> =>
    mode === 'mock' ? productStore.update(id, data) : httpClient.put(`/products/${id}`, data),
  delete: async (id: string): Promise<void> =>
    mode === 'mock' ? productStore.delete(id) : httpClient.delete(`/products/${id}`),
};

// ── Events ──
export const eventsApi = {
  getAll: async (): Promise<Event[]> =>
    mode === 'mock' ? eventStore.getAll() : httpClient.get('/events'),
  getById: async (id: string): Promise<Event | null> =>
    mode === 'mock' ? eventStore.getById(id) : httpClient.get(`/events/${id}`),
  getBySlug: async (slug: string): Promise<Event | null> =>
    mode === 'mock' ? eventStore.getBySlug(slug) : httpClient.get(`/events/slug/${slug}`),
  getByBrand: async (brand: string): Promise<Event[]> =>
    mode === 'mock' ? eventStore.getByBrand(brand) : httpClient.get(`/events?brand=${brand}`),
  getFeatured: async (): Promise<Event[]> =>
    mode === 'mock' ? eventStore.getFeatured() : httpClient.get('/events?featured=true'),
  create: async (e: Event): Promise<Event> =>
    mode === 'mock' ? eventStore.create(e) : httpClient.post('/events', e),
  update: async (id: string, data: Partial<Event>): Promise<Event> =>
    mode === 'mock' ? eventStore.update(id, data) : httpClient.put(`/events/${id}`, data),
  delete: async (id: string): Promise<void> =>
    mode === 'mock' ? eventStore.delete(id) : httpClient.delete(`/events/${id}`),
};

// ── Categories ──
export const categoriesApi = {
  getAll: async (): Promise<Category[]> =>
    mode === 'mock' ? categoryStore.getAll() : httpClient.get('/categories'),
};

// ── Brands (static data — stays in mock-store for now) ──
export const brandsApi = {
  getAll: async (): Promise<BrandContent[]> =>
    mode === 'azure' ? httpClient.get('/brands') : brandStore.getAll(),
  getById: async (id: string): Promise<BrandContent | null> =>
    mode === 'azure' ? httpClient.get(`/brands/${id}`) : brandStore.getById(id),
};

// ── Discounts (mock + azure, DB migration deferred) ──
export const discountsApi = {
  getAll: async (): Promise<Discount[]> =>
    mode === 'azure' ? httpClient.get('/discounts') : discountStore.getAll(),
  getByCode: async (code: string): Promise<Discount | null> =>
    mode === 'azure' ? httpClient.get(`/discounts/code/${code}`) : discountStore.getByCode(code),
  create: async (d: Discount): Promise<Discount> =>
    mode === 'azure' ? httpClient.post('/discounts', d) : discountStore.create(d),
  update: async (id: string, data: Partial<Discount>): Promise<Discount> =>
    mode === 'azure' ? httpClient.put(`/discounts/${id}`, data) : discountStore.update(id, data),
  delete: async (id: string): Promise<void> =>
    mode === 'azure' ? httpClient.delete(`/discounts/${id}`) : discountStore.delete(id),
};

// ── Banners (mock + azure, homepage banners use CMS hooks) ──
export const bannersApi = {
  getAll: async (): Promise<Banner[]> =>
    mode === 'azure' ? httpClient.get('/banners') : bannerStore.getAll(),
  getByPlacement: async (placement: string): Promise<Banner[]> =>
    mode === 'azure' ? httpClient.get(`/banners?placement=${placement}`) : bannerStore.getByPlacement(placement),
  create: async (b: Banner): Promise<Banner> =>
    mode === 'azure' ? httpClient.post('/banners', b) : bannerStore.create(b),
  update: async (id: string, data: Partial<Banner>): Promise<Banner> =>
    mode === 'azure' ? httpClient.put(`/banners/${id}`, data) : bannerStore.update(id, data),
  delete: async (id: string): Promise<void> =>
    mode === 'azure' ? httpClient.delete(`/banners/${id}`) : bannerStore.delete(id),
};

// ── CRM (mock + azure) ──
export const crmApi = {
  customers: {
    getAll: async () => mode === 'azure' ? httpClient.get('/crm/customers') : customerStore.getAll(),
    create: async (c: any) => mode === 'azure' ? httpClient.post('/crm/customers', c) : customerStore.create(c),
    update: async (id: string, d: any) => mode === 'azure' ? httpClient.put(`/crm/customers/${id}`, d) : customerStore.update(id, d),
    delete: async (id: string) => mode === 'azure' ? httpClient.delete(`/crm/customers/${id}`) : customerStore.delete(id),
  },
  conversations: {
    getAll: async () => mode === 'azure' ? httpClient.get('/crm/conversations') : conversationStore.getAll(),
  },
  emailCampaigns: {
    getAll: async () => mode === 'azure' ? httpClient.get('/crm/email-campaigns') : emailCampaignStore.getAll(),
    create: async (c: any) => mode === 'azure' ? httpClient.post('/crm/email-campaigns', c) : emailCampaignStore.create(c),
  },
  pushNotifications: {
    getAll: async () => mode === 'azure' ? httpClient.get('/crm/push-notifications') : pushNotificationStore.getAll(),
    create: async (n: any) => mode === 'azure' ? httpClient.post('/crm/push-notifications', n) : pushNotificationStore.create(n),
  },
  kbArticles: {
    getAll: async () => mode === 'azure' ? httpClient.get('/crm/kb-articles') : kbArticleStore.getAll(),
    create: async (a: any) => mode === 'azure' ? httpClient.post('/crm/kb-articles', a) : kbArticleStore.create(a),
    update: async (id: string, d: any) => mode === 'azure' ? httpClient.put(`/crm/kb-articles/${id}`, d) : kbArticleStore.update(id, d),
    delete: async (id: string) => mode === 'azure' ? httpClient.delete(`/crm/kb-articles/${id}`) : kbArticleStore.delete(id),
  },
};

// ── Orders (mock + azure) ──
export const ordersApi = {
  getAll: async (): Promise<Order[]> =>
    mode === 'azure' ? httpClient.get('/orders') : orderStore.getAll(),
  getById: async (id: string): Promise<Order | null> =>
    mode === 'azure' ? httpClient.get(`/orders/${id}`) : orderStore.getById(id),
  getByEmail: async (email: string): Promise<Order[]> =>
    mode === 'azure' ? httpClient.get(`/orders/customer/${encodeURIComponent(email)}`) : orderStore.getByEmail(email),
  create: async (order: Partial<Order>): Promise<Order> =>
    mode === 'azure' ? httpClient.post('/orders', order) : orderStore.create(order as Order),
  update: async (id: string, data: Partial<Order>): Promise<Order> =>
    mode === 'azure' ? httpClient.put(`/orders/${id}`, data) : orderStore.update(id, data),
  cancel: async (id: string): Promise<{ id: string; status: string }> => {
    if (mode === 'azure') return httpClient.put(`/orders/${id}/cancel`, {});
    orderStore.update(id, { status: 'cancelled', updatedAt: new Date().toISOString() });
    return { id, status: 'cancelled' };
  },
};

// Re-export subscribe for React hooks to listen for mock store changes
export { subscribe };
