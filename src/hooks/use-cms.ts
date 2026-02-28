import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '@/services/api/config';

const CMS_BASE = `${API_CONFIG.BASE_URL}/cms`;
const UPLOAD_BASE = `${API_CONFIG.BASE_URL}/uploads`;

function adminHeaders() {
  const token = localStorage.getItem('admin_api_token') || import.meta.env.VITE_ADMIN_API_TOKEN || '';
  return token ? { 'x-admin-token': token } : {};
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CMS API ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function uploadCmsImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const result = await http<{ url: string }>(`${UPLOAD_BASE}/cms-image`, {
    method: 'POST',
    headers: {
      ...adminHeaders(),
    },
    body: form,
  });

  return result.url;
}

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

export function useSiteContent(section?: string) {
  return useQuery({
    queryKey: ['site_content', section],
    queryFn: () => {
      const query = section ? `?section=${encodeURIComponent(section)}` : '';
      return http<SiteContentRow[]>(`${CMS_BASE}/site-content${query}`);
    },
  });
}

export function useAllSiteContent() {
  return useQuery({
    queryKey: ['site_content'],
    queryFn: () => http<SiteContentRow[]>(`${CMS_BASE}/site-content`),
  });
}

export function contentToMap(rows: SiteContentRow[]): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!map[row.section]) map[row.section] = {};
    map[row.section][row.content_key] = row.content_value;
  }
  return map;
}

export function useNavigationItems(location?: string) {
  return useQuery({
    queryKey: ['navigation_items', location],
    queryFn: () => {
      const query = location ? `?location=${encodeURIComponent(location)}` : '';
      return http<NavigationItemRow[]>(`${CMS_BASE}/navigation-items${query}`);
    },
  });
}

export function useAllNavigationItems() {
  return useQuery({
    queryKey: ['navigation_items_all'],
    queryFn: () => http<NavigationItemRow[]>(`${CMS_BASE}/navigation-items?visible=false`),
  });
}

export function useHomepageBanners() {
  return useQuery({
    queryKey: ['homepage_banners'],
    queryFn: () => http<HomepageBannerRow[]>(`${CMS_BASE}/homepage-banners`),
  });
}

export function useAllHomepageBanners() {
  return useQuery({
    queryKey: ['homepage_banners_all'],
    queryFn: () => http<HomepageBannerRow[]>(`${CMS_BASE}/homepage-banners?active=false`),
  });
}

export function useUpdateSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SiteContentRow> & { id: string }) => {
      const { id, ...rest } = row;
      return http(`${CMS_BASE}/site-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify(rest),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useUpsertSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (row: Omit<SiteContentRow, 'id'>) =>
      http(`${CMS_BASE}/site-content/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify(row),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useDeleteSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      http(`${CMS_BASE}/site-content/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site_content'] }),
  });
}

export function useUpsertNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (row: Partial<NavigationItemRow> & { id?: string }) =>
      http<NavigationItemRow>(`${CMS_BASE}/navigation-items/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify(row),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['navigation_items'] }),
  });
}

export function useDeleteNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      http(`${CMS_BASE}/navigation-items/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['navigation_items'] }),
  });
}

export function useUpsertBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (row: Partial<HomepageBannerRow> & { id?: string }) =>
      http<HomepageBannerRow>(`${CMS_BASE}/homepage-banners/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders(),
        },
        body: JSON.stringify(row),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage_banners'] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      http(`${CMS_BASE}/homepage-banners/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage_banners'] }),
  });
}
