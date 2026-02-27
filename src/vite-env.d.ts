/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AZURE_AD_TENANT: string;
  readonly VITE_AZURE_AD_CLIENT_ID: string;
  readonly VITE_AZURE_STORAGE_URL: string;
  readonly VITE_APPINSIGHTS_CONNECTION_STRING: string;
  readonly VITE_AZURE_SEARCH_URL: string;
  readonly VITE_AZURE_SEARCH_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
