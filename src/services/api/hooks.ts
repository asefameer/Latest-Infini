/**
 * React hooks for the API service layer.
 * Uses @tanstack/react-query for caching, refetching, and optimistic updates.
 * Both admin and customer-facing pages use these hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, eventsApi, categoriesApi, brandsApi, discountsApi, bannersApi, crmApi, ordersApi } from './index';
import type { Product, Event, Order } from '@/types';
import type { Discount } from '@/pages/admin/DiscountsAdmin';

// ── Products ──
export const useProducts = () => useQuery({ queryKey: ['products'], queryFn: productsApi.getAll });
export const useProduct = (id: string) => useQuery({ queryKey: ['products', id], queryFn: () => productsApi.getById(id), enabled: !!id });
export const useProductBySlug = (slug: string) => useQuery({ queryKey: ['products', 'slug', slug], queryFn: () => productsApi.getBySlug(slug), enabled: !!slug });
export const useProductsByCategory = (cat: string) => useQuery({ queryKey: ['products', 'category', cat], queryFn: () => productsApi.getByCategory(cat), enabled: !!cat });
export const useProductsByBrand = (brand: string) => useQuery({ queryKey: ['products', 'brand', brand], queryFn: () => productsApi.getByBrand(brand), enabled: !!brand });
export const useTrendingProducts = () => useQuery({ queryKey: ['products', 'trending'], queryFn: productsApi.getTrending });
export const useNewProducts = () => useQuery({ queryKey: ['products', 'new'], queryFn: productsApi.getNew });
export const useFeaturedProducts = () => useQuery({ queryKey: ['products', 'featured'], queryFn: productsApi.getFeatured });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: Product) => productsApi.create(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productsApi.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => productsApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

// ── Events ──
export const useEvents = () => useQuery({ queryKey: ['events'], queryFn: eventsApi.getAll });
export const useEvent = (id: string) => useQuery({ queryKey: ['events', id], queryFn: () => eventsApi.getById(id), enabled: !!id });
export const useEventBySlug = (slug: string) => useQuery({ queryKey: ['events', 'slug', slug], queryFn: () => eventsApi.getBySlug(slug), enabled: !!slug });
export const useFeaturedEvents = () => useQuery({ queryKey: ['events', 'featured'], queryFn: eventsApi.getFeatured });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (e: Event) => eventsApi.create(e), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) });
};
export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => eventsApi.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) });
};
export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => eventsApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }) });
};

// ── Categories & Brands ──
export const useCategories = () => useQuery({ queryKey: ['categories'], queryFn: categoriesApi.getAll });
export const useBrands = () => useQuery({ queryKey: ['brands'], queryFn: brandsApi.getAll });
export const useBrand = (id: string) => useQuery({ queryKey: ['brands', id], queryFn: () => brandsApi.getById(id), enabled: !!id });

// ── Discounts ──
export const useDiscounts = () => useQuery({ queryKey: ['discounts'], queryFn: discountsApi.getAll });
export const useDiscountByCode = (code: string) => useQuery({ queryKey: ['discounts', 'code', code], queryFn: () => discountsApi.getByCode(code), enabled: !!code });

export const useCreateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Discount) => discountsApi.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['discounts'] }) });
};
export const useUpdateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Discount> }) => discountsApi.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['discounts'] }) });
};
export const useDeleteDiscount = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => discountsApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['discounts'] }) });
};

// ── Banners ──
export const useBanners = () => useQuery({ queryKey: ['banners'], queryFn: bannersApi.getAll });

// ── CRM ──
export const useCustomers = () => useQuery({ queryKey: ['crm', 'customers'], queryFn: crmApi.customers.getAll });
export const useConversations = () => useQuery({ queryKey: ['crm', 'conversations'], queryFn: crmApi.conversations.getAll });
export const useEmailCampaigns = () => useQuery({ queryKey: ['crm', 'email-campaigns'], queryFn: crmApi.emailCampaigns.getAll });
export const usePushNotifications = () => useQuery({ queryKey: ['crm', 'push-notifications'], queryFn: crmApi.pushNotifications.getAll });
export const useKBArticles = () => useQuery({ queryKey: ['crm', 'kb-articles'], queryFn: crmApi.kbArticles.getAll });

// ── Orders ──
export const useOrders = () => useQuery({ queryKey: ['orders'], queryFn: ordersApi.getAll });
export const useOrder = (id: string) => useQuery({ queryKey: ['orders', id], queryFn: () => ordersApi.getById(id), enabled: !!id });
export const useOrdersByEmail = (email: string) => useQuery({ queryKey: ['orders', 'email', email], queryFn: () => ordersApi.getByEmail(email), enabled: !!email });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (order: Partial<Order>) => ordersApi.create(order), onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }) });
};
export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) => ordersApi.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }) });
};
export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => ordersApi.cancel(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }) });
};
