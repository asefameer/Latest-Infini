/**
 * Azure AI Search Client (Frontend)
 * 
 * When Azure AI Search is configured (VITE_AZURE_SEARCH_URL set),
 * queries go through the Azure Functions proxy at /api/search.
 * Otherwise falls back to simple client-side filtering of mock data.
 */
import { API_CONFIG } from './api/config';
import { productsApi, eventsApi } from './api';

const useMock = API_CONFIG.USE_MOCK;

export interface SearchResult<T = any> {
  results: T[];
  totalCount: number;
}

export interface SearchSuggestion {
  text: string;
  document: any;
}

/** Full-text search across products or events */
export async function search(
  query: string,
  type: 'products' | 'events' = 'products',
  options?: { top?: number; skip?: number; filter?: string }
): Promise<SearchResult> {
  if (useMock) {
    return mockSearch(query, type);
  }

  const params = new URLSearchParams({
    q: query,
    type,
    top: String(options?.top || 20),
    skip: String(options?.skip || 0),
  });
  if (options?.filter) params.set('filter', options.filter);

  const res = await fetch(`${API_CONFIG.BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

/** Get autocomplete suggestions */
export async function suggest(
  query: string,
  type: 'products' | 'events' = 'products'
): Promise<SearchSuggestion[]> {
  if (useMock) {
    return mockSuggest(query, type);
  }

  const params = new URLSearchParams({ q: query, type });
  const res = await fetch(`${API_CONFIG.BASE_URL}/search/suggest?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.suggestions || [];
}

// ── Mock fallbacks for local development ──

async function mockSearch(query: string, type: string): Promise<SearchResult> {
  const q = query.toLowerCase();

  if (type === 'events') {
    const events = await eventsApi.getAll();
    const filtered = events.filter(
      e => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)
    );
    return { results: filtered, totalCount: filtered.length };
  }

  const products = await productsApi.getAll();
  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
  );
  return { results: filtered, totalCount: filtered.length };
}

async function mockSuggest(query: string, type: string): Promise<SearchSuggestion[]> {
  const result = await mockSearch(query, type);
  return result.results.slice(0, 5).map((item: any) => ({
    text: item.name || item.title,
    document: item,
  }));
}
