/**
 * API Configuration
 * 
 * This file centralizes API endpoint configuration.
 * Currently uses mock data (in-memory). When Azure Functions are deployed,
 * simply update API_BASE_URL and the api client will route all calls to Azure.
 * 
 * Azure Architecture:
 * - Azure SQL Database: Products, Events, Tickets, Discounts, Banners, Customers
 * - Azure Functions (HTTP triggers): REST API endpoints
 * - Azure AD B2C: Admin authentication
 * - Azure Blob Storage: Product/banner images
 * - Azure Static Web Apps: Frontend hosting
 */

export const API_CONFIG = {
  /** Azure Functions API URL, e.g. 'https://infinity-portal-app-prod-001.azurewebsites.net/api' */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  /** When true, uses in-memory mock data. Set to false once Azure backend is live. */
  USE_MOCK: !import.meta.env.VITE_API_BASE_URL,

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
