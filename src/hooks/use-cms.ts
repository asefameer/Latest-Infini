import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';


// ── Storage helpers ──
const CMS_BUCKET = 'cms-images';

export async function uploadCmsImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(CMS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(CMS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Types ──
export interface SiteContentRow {
  id: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type: string;
  sort_order: number;
}

export interface NavigationItemRow {
  id: string;
  location: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
  parent_id: string | null;
}

export interface HomepageBannerRow {
  id: string;
  name: string;
  tagline: string;
  image_url: string;
  link: string;
  accent_color: string;
  sort_order: number;
  is_active: boolean;
}

// ── Hooks: Read ──

export function useSiteContent(section?: string) {
  return useQuery({
    queryKey: ['site_content', section],
    queryFn: async () => {
      let query = supabase.from('site_content' as any).select('*').order('sort_order');
      if (section) query = query.eq('section', section);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as SiteContentRow[];
    },
  });
}

export function useAllSiteContent() {
  return useQuery({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content' as any)
        .select('*')
        .order('section')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []) as unknown as SiteContentRow[];
    },
  });
}

/** Utility: convert array to a lookup map { [section]: { [key]: value } } */
export function contentToMap(rows: SiteContentRow[]): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const r of rows) {
    if (!map[r.section]) map[r.section] = {};
    map[r.section][r.content_key] = r.content_value;
  }
  return map;
}

export function useNavigationItems(location?: string) {
  return useQuery({
    queryKey: ['navigation_items', location],
    queryFn: async () => {
      let query = supabase
        .from('navigation_items' as any)
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
      if (location) query = query.eq('location', location);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as NavigationItemRow[];
    },
  });
}

export function useAllNavigationItems() {
  return useQuery({
    queryKey: ['navigation_items_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items' as any)
        .select('*')
        .order('location')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []) as unknown as NavigationItemRow[];
    },
  });
}

export function useHomepageBanners() {
  return useQuery({
    queryKey: ['homepage_banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_banners' as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data ?? []) as unknown as HomepageBannerRow[];
    },
  });
}

export function useAllHomepageBanners() {
  return useQuery({
    queryKey: ['homepage_banners_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_banners' as any)
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []) as unknown as HomepageBannerRow[];
    },
  });
}

// ── Hooks: Mutations ──

export function useUpdateSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SiteContentRow> & { id: string }) => {
      const { id, ...rest } = row;
      const { error } = await supabase.from('site_content' as any).update(rest).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useUpsertSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<SiteContentRow, 'id'>) => {
      const { error } = await supabase.from('site_content' as any).upsert(row as any, { onConflict: 'section,content_key' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useDeleteSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('site_content' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useUpsertNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<NavigationItemRow> & { id?: string }) => {
      const { error } = await supabase.from('navigation_items' as any).upsert(row as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['navigation_items'] }),
  });
}

export function useDeleteNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('navigation_items' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['navigation_items'] }),
  });
}

export function useUpsertBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<HomepageBannerRow> & { id?: string }) => {
      const { error } = await supabase.from('homepage_banners' as any).upsert(row as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage_banners'] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('homepage_banners' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage_banners'] }),
  });
}
