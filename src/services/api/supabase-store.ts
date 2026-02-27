/**
 * Supabase Data Store
 * 
 * Replaces mock-store by reading/writing to Lovable Cloud (PostgreSQL).
 * Column naming: DB uses snake_case → frontend uses camelCase.
 * 
 * Azure Migration Note:
 * When moving to Azure SQL + Azure Functions, replace this file's Supabase
 * calls with httpClient calls to your Azure Functions endpoints.
 * The column mapping functions (toProduct, toDbProduct, etc.) can be
 * reused in your Azure Functions to maintain the same API contract.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Product, Event, Category } from '@/types';

// ══════════════════════════════════════════════════
// Column Mapping: DB (snake_case) ↔ Frontend (camelCase)
// These mappers are also useful for Azure Functions
// ══════════════════════════════════════════════════

/** Map a database product row to frontend Product type */
export function toProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    currency: row.currency,
    images: row.images ?? [],
    description: row.description,
    specs: row.specs ?? [],
    variants: row.variants ?? [],
    tags: row.tags ?? [],
    inStock: row.in_stock,
    isNew: row.is_new,
    isTrending: row.is_trending,
    isLive: row.is_live ?? false,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImage: row.og_image ?? undefined,
  };
}

/** Map frontend Product to database columns */
export function toDbProduct(p: Partial<Product>): Record<string, any> {
  const row: Record<string, any> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.category !== undefined) row.category = p.category;
  if (p.price !== undefined) row.price = p.price;
  if ('compareAtPrice' in p) row.compare_at_price = p.compareAtPrice ?? null;
  if (p.currency !== undefined) row.currency = p.currency;
  if (p.images !== undefined) row.images = p.images;
  if (p.description !== undefined) row.description = p.description;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.variants !== undefined) row.variants = p.variants;
  if (p.tags !== undefined) row.tags = p.tags;
  if ('inStock' in p) row.in_stock = p.inStock;
  if ('isNew' in p) row.is_new = p.isNew;
  if ('isTrending' in p) row.is_trending = p.isTrending;
  if ('isLive' in p) row.is_live = p.isLive;
  if ('seoTitle' in p) row.seo_title = p.seoTitle ?? null;
  if ('seoDescription' in p) row.seo_description = p.seoDescription ?? null;
  if ('ogImage' in p) row.og_image = p.ogImage ?? null;
  return row;
}

/** Map a database event row to frontend Event type */
export function toEvent(row: any): Event {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: row.brand,
    date: row.date,
    endDate: row.end_date ?? undefined,
    time: row.time,
    venue: row.venue,
    city: row.city,
    bannerImage: row.banner_image,
    description: row.description,
    lineup: row.lineup ?? [],
    schedule: row.schedule ?? [],
    ticketTiers: row.ticket_tiers ?? [],
    faq: row.faq ?? [],
    isFeatured: row.is_featured,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImage: row.og_image ?? undefined,
  };
}

/** Map frontend Event to database columns */
export function toDbEvent(e: Partial<Event>): Record<string, any> {
  const row: Record<string, any> = {};
  if (e.id !== undefined) row.id = e.id;
  if (e.slug !== undefined) row.slug = e.slug;
  if (e.title !== undefined) row.title = e.title;
  if (e.brand !== undefined) row.brand = e.brand;
  if (e.date !== undefined) row.date = e.date;
  if ('endDate' in e) row.end_date = e.endDate ?? null;
  if (e.time !== undefined) row.time = e.time;
  if (e.venue !== undefined) row.venue = e.venue;
  if (e.city !== undefined) row.city = e.city;
  if (e.bannerImage !== undefined) row.banner_image = e.bannerImage;
  if (e.description !== undefined) row.description = e.description;
  if (e.lineup !== undefined) row.lineup = e.lineup;
  if (e.schedule !== undefined) row.schedule = e.schedule;
  if (e.ticketTiers !== undefined) row.ticket_tiers = e.ticketTiers;
  if (e.faq !== undefined) row.faq = e.faq;
  if ('isFeatured' in e) row.is_featured = e.isFeatured;
  if ('seoTitle' in e) row.seo_title = e.seoTitle ?? null;
  if ('seoDescription' in e) row.seo_description = e.seoDescription ?? null;
  if ('ogImage' in e) row.og_image = e.ogImage ?? null;
  return row;
}

function toCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    productCount: row.product_count,
  };
}

// ══════════════════════════════════════════════════
// CRUD Operations via Supabase
// ══════════════════════════════════════════════════

export const supabaseProductStore = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  getById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toProduct(data) : null;
  },
  getBySlug: async (slug: string): Promise<Product | null> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data ? toProduct(data) : null;
  },
  getByCategory: async (cat: string): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('category', cat);
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  getByBrand: async (brand: string): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('brand', brand);
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  getTrending: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('is_trending', true);
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  getNew: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').eq('is_new', true);
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  getFeatured: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products' as any).select('*').order('created_at', { ascending: false }).limit(6);
    if (error) throw error;
    return (data ?? []).map(toProduct);
  },
  create: async (p: Product): Promise<Product> => {
    const dbRow = toDbProduct(p);
    delete dbRow.id; // Let DB generate UUID
    const { data, error } = await supabase.from('products' as any).insert(dbRow).select().single();
    if (error) throw error;
    return toProduct(data);
  },
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const dbRow = toDbProduct(updates);
    delete dbRow.id;
    const { data, error } = await supabase.from('products' as any).update(dbRow).eq('id', id).select().single();
    if (error) throw error;
    return toProduct(data);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('products' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

export const supabaseEventStore = {
  getAll: async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events' as any).select('*').order('date', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toEvent);
  },
  getById: async (id: string): Promise<Event | null> => {
    const { data, error } = await supabase.from('events' as any).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toEvent(data) : null;
  },
  getBySlug: async (slug: string): Promise<Event | null> => {
    const { data, error } = await supabase.from('events' as any).select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data ? toEvent(data) : null;
  },
  getByBrand: async (brand: string): Promise<Event[]> => {
    const { data, error } = await supabase.from('events' as any).select('*').eq('brand', brand);
    if (error) throw error;
    return (data ?? []).map(toEvent);
  },
  getFeatured: async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events' as any).select('*').eq('is_featured', true);
    if (error) throw error;
    return (data ?? []).map(toEvent);
  },
  create: async (e: Event): Promise<Event> => {
    const dbRow = toDbEvent(e);
    delete dbRow.id;
    const { data, error } = await supabase.from('events' as any).insert(dbRow).select().single();
    if (error) throw error;
    return toEvent(data);
  },
  update: async (id: string, updates: Partial<Event>): Promise<Event> => {
    const dbRow = toDbEvent(updates);
    delete dbRow.id;
    const { data, error } = await supabase.from('events' as any).update(dbRow).eq('id', id).select().single();
    if (error) throw error;
    return toEvent(data);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('events' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

export const supabaseCategoryStore = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories' as any).select('*').order('sort_order');
    if (error) throw error;
    return (data ?? []).map(toCategory);
  },
};
