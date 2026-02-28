/**
 * API Configuration
 * 
 * Azure-first backend strategy:
 * 1. Azure API (App Service) — default, always on in production
 * 2. Mock (in-memory) — set VITE_USE_MOCK=true for offline dev
 * 
 * Azure Architecture (when deployed):
 * - Azure SQL Database: Products, Events, Tickets, Discounts, Banners, Customers
 * - Azure App Service API: REST API endpoints
 * - Azure AD B2C: Admin authentication
 * - Azure Blob Storage: Product/banner images
 * - Azure App Service / Front Door: Frontend hosting
 */

export type BackendMode = 'azure' | 'mock';

function resolveBackendMode(): BackendMode {
  // Explicit mock mode (offline dev)
  if (import.meta.env.VITE_USE_MOCK === 'true') return 'mock';
  return 'azure';
}

export const API_CONFIG = {
  /** Resolved backend mode */
  BACKEND_MODE: resolveBackendMode(),

  /** Azure App Service API URL, e.g. 'https://infinitybd.live/api' */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

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
