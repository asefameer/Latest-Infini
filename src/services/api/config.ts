/**
 * API Configuration
 * 
 * Three-tier backend strategy:
 * 1. Supabase (Lovable Cloud) — default, used now
 * 2. Azure Functions — set VITE_API_BASE_URL to switch
 * 3. Mock (in-memory) — set VITE_USE_MOCK=true for offline dev
 * 
 * Azure Architecture (when deployed):
 * - Azure SQL Database: Products, Events, Tickets, Discounts, Banners, Customers
 * - Azure Functions (HTTP triggers): REST API endpoints
 * - Azure AD B2C: Admin authentication
 * - Azure Blob Storage: Product/banner images
 * - Azure Static Web Apps / Front Door: Frontend hosting
 */

export type BackendMode = 'supabase' | 'azure' | 'mock';

function resolveBackendMode(): BackendMode {
  // Explicit mock mode (offline dev)
  if (import.meta.env.VITE_USE_MOCK === 'true') return 'mock';
  // Azure mode — when Azure Functions URL is configured
  if (import.meta.env.VITE_API_BASE_URL) return 'azure';
  // Default — Supabase / Lovable Cloud
  return 'supabase';
}

export const API_CONFIG = {
  /** Resolved backend mode */
  BACKEND_MODE: resolveBackendMode(),

  /** Azure Functions API URL, e.g. 'https://infinity-portal-app-prod-001.azurewebsites.net/api' */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

  /** @deprecated Use BACKEND_MODE instead */
  USE_MOCK: resolveBackendMode() === 'mock',

  /** Azure AD B2C config */
  AUTH: {
    TENANT: import.meta.env.VITE_AZURE_AD_TENANT || '',
    CLIENT_ID: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
  },

  /** Azure Blob Storage base URL for images (stportalinfinityprod001) */
  STORAGE_URL: import.meta.env.VITE_AZURE_STORAGE_URL || '',

  /** Application Insights */
  APPINSIGHTS_CONNECTION_STRING: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING || '',

  /** Azure AI Search (query key — safe for frontend) */
  SEARCH: {
    URL: import.meta.env.VITE_AZURE_SEARCH_URL || '',
    KEY: import.meta.env.VITE_AZURE_SEARCH_KEY || '',
  },
};
