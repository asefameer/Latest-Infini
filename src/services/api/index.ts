/**
 * Unified API Service
 * 
 * Single entry point for all data operations. Uses mock-store when VITE_API_BASE_URL 
 * is not set. When Azure Functions are deployed, set the env var and the httpClient
 * will handle all requests.
 * 
 * Azure Functions mapping (when deployed):
 * GET    /api/products          → productStore.getAll()
 * GET    /api/products/:id      → productStore.getById()
 * POST   /api/products          → productStore.create()
 * PUT    /api/products/:id      → productStore.update()
 * DELETE /api/products/:id      → productStore.delete()
 * (same pattern for events, discounts, banners, customers, etc.)
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

const useMock = API_CONFIG.USE_MOCK;

// ── Products ──
export const productsApi = {
  getAll: async (): Promise<Product[]> =>
    useMock ? productStore.getAll() : httpClient.get('/products'),
  getById: async (id: string): Promise<Product | null> =>
    useMock ? productStore.getById(id) : httpClient.get(`/products/${id}`),
  getBySlug: async (slug: string): Promise<Product | null> =>
    useMock ? productStore.getBySlug(slug) : httpClient.get(`/products/slug/${slug}`),
  getByCategory: async (cat: string): Promise<Product[]> =>
    useMock ? productStore.getByCategory(cat) : httpClient.get(`/products?category=${cat}`),
  getByBrand: async (brand: string): Promise<Product[]> =>
    useMock ? productStore.getByBrand(brand) : httpClient.get(`/products?brand=${brand}`),
  getTrending: async (): Promise<Product[]> =>
    useMock ? productStore.getTrending() : httpClient.get('/products?trending=true'),
  getNew: async (): Promise<Product[]> =>
    useMock ? productStore.getNew() : httpClient.get('/products?new=true'),
  getFeatured: async (): Promise<Product[]> =>
    useMock ? productStore.getFeatured() : httpClient.get('/products?featured=true'),
  create: async (p: Product): Promise<Product> =>
    useMock ? productStore.create(p) : httpClient.post('/products', p),
  update: async (id: string, data: Partial<Product>): Promise<Product> =>
    useMock ? productStore.update(id, data) : httpClient.put(`/products/${id}`, data),
  delete: async (id: string): Promise<void> =>
    useMock ? productStore.delete(id) : httpClient.delete(`/products/${id}`),
};

// ── Events ──
export const eventsApi = {
  getAll: async (): Promise<Event[]> =>
    useMock ? eventStore.getAll() : httpClient.get('/events'),
  getById: async (id: string): Promise<Event | null> =>
    useMock ? eventStore.getById(id) : httpClient.get(`/events/${id}`),
  getBySlug: async (slug: string): Promise<Event | null> =>
    useMock ? eventStore.getBySlug(slug) : httpClient.get(`/events/slug/${slug}`),
  getByBrand: async (brand: string): Promise<Event[]> =>
    useMock ? eventStore.getByBrand(brand) : httpClient.get(`/events?brand=${brand}`),
  getFeatured: async (): Promise<Event[]> =>
    useMock ? eventStore.getFeatured() : httpClient.get('/events?featured=true'),
  create: async (e: Event): Promise<Event> =>
    useMock ? eventStore.create(e) : httpClient.post('/events', e),
  update: async (id: string, data: Partial<Event>): Promise<Event> =>
    useMock ? eventStore.update(id, data) : httpClient.put(`/events/${id}`, data),
  delete: async (id: string): Promise<void> =>
    useMock ? eventStore.delete(id) : httpClient.delete(`/events/${id}`),
};

// ── Categories ──
export const categoriesApi = {
  getAll: async (): Promise<Category[]> =>
    useMock ? categoryStore.getAll() : httpClient.get('/categories'),
};

// ── Brands ──
export const brandsApi = {
  getAll: async (): Promise<BrandContent[]> =>
    useMock ? brandStore.getAll() : httpClient.get('/brands'),
  getById: async (id: string): Promise<BrandContent | null> =>
    useMock ? brandStore.getById(id) : httpClient.get(`/brands/${id}`),
};

// ── Discounts ──
export const discountsApi = {
  getAll: async (): Promise<Discount[]> =>
    useMock ? discountStore.getAll() : httpClient.get('/discounts'),
  getByCode: async (code: string): Promise<Discount | null> =>
    useMock ? discountStore.getByCode(code) : httpClient.get(`/discounts/code/${code}`),
  create: async (d: Discount): Promise<Discount> =>
    useMock ? discountStore.create(d) : httpClient.post('/discounts', d),
  update: async (id: string, data: Partial<Discount>): Promise<Discount> =>
    useMock ? discountStore.update(id, data) : httpClient.put(`/discounts/${id}`, data),
  delete: async (id: string): Promise<void> =>
    useMock ? discountStore.delete(id) : httpClient.delete(`/discounts/${id}`),
};

// ── Banners ──
export const bannersApi = {
  getAll: async (): Promise<Banner[]> =>
    useMock ? bannerStore.getAll() : httpClient.get('/banners'),
  getByPlacement: async (placement: string): Promise<Banner[]> =>
    useMock ? bannerStore.getByPlacement(placement) : httpClient.get(`/banners?placement=${placement}`),
  create: async (b: Banner): Promise<Banner> =>
    useMock ? bannerStore.create(b) : httpClient.post('/banners', b),
  update: async (id: string, data: Partial<Banner>): Promise<Banner> =>
    useMock ? bannerStore.update(id, data) : httpClient.put(`/banners/${id}`, data),
  delete: async (id: string): Promise<void> =>
    useMock ? bannerStore.delete(id) : httpClient.delete(`/banners/${id}`),
};

// ── CRM ──
export const crmApi = {
  customers: {
    getAll: async () => useMock ? customerStore.getAll() : httpClient.get('/crm/customers'),
    create: async (c: any) => useMock ? customerStore.create(c) : httpClient.post('/crm/customers', c),
    update: async (id: string, d: any) => useMock ? customerStore.update(id, d) : httpClient.put(`/crm/customers/${id}`, d),
    delete: async (id: string) => useMock ? customerStore.delete(id) : httpClient.delete(`/crm/customers/${id}`),
  },
  conversations: {
    getAll: async () => useMock ? conversationStore.getAll() : httpClient.get('/crm/conversations'),
  },
  emailCampaigns: {
    getAll: async () => useMock ? emailCampaignStore.getAll() : httpClient.get('/crm/email-campaigns'),
    create: async (c: any) => useMock ? emailCampaignStore.create(c) : httpClient.post('/crm/email-campaigns', c),
  },
  pushNotifications: {
    getAll: async () => useMock ? pushNotificationStore.getAll() : httpClient.get('/crm/push-notifications'),
    create: async (n: any) => useMock ? pushNotificationStore.create(n) : httpClient.post('/crm/push-notifications', n),
  },
  kbArticles: {
    getAll: async () => useMock ? kbArticleStore.getAll() : httpClient.get('/crm/kb-articles'),
    create: async (a: any) => useMock ? kbArticleStore.create(a) : httpClient.post('/crm/kb-articles', a),
    update: async (id: string, d: any) => useMock ? kbArticleStore.update(id, d) : httpClient.put(`/crm/kb-articles/${id}`, d),
    delete: async (id: string) => useMock ? kbArticleStore.delete(id) : httpClient.delete(`/crm/kb-articles/${id}`),
  },
};

// ── Orders ──
export const ordersApi = {
  getAll: async (): Promise<Order[]> =>
    useMock ? orderStore.getAll() : httpClient.get('/orders'),
  getById: async (id: string): Promise<Order | null> =>
    useMock ? orderStore.getById(id) : httpClient.get(`/orders/${id}`),
  getByEmail: async (email: string): Promise<Order[]> =>
    useMock ? orderStore.getByEmail(email) : httpClient.get(`/orders/customer/${encodeURIComponent(email)}`),
  create: async (order: Partial<Order>): Promise<Order> =>
    useMock ? orderStore.create(order as Order) : httpClient.post('/orders', order),
  update: async (id: string, data: Partial<Order>): Promise<Order> =>
    useMock ? orderStore.update(id, data) : httpClient.put(`/orders/${id}`, data),
  cancel: async (id: string): Promise<{ id: string; status: string }> => {
    if (useMock) {
      orderStore.update(id, { status: 'cancelled', updatedAt: new Date().toISOString() });
      return { id, status: 'cancelled' };
    }
    return httpClient.put(`/orders/${id}/cancel`, {});
  },
};

// Re-export subscribe for React hooks to listen for mock store changes
export { subscribe };
