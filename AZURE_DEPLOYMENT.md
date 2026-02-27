# Azure Deployment Guide — Infinity Portal

## Architecture Overview

```
User → GoDaddy DNS → Azure DNS (infinitybd.live) → Azure Front Door (CDN + SSL)
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    ▼                                         ▼
                          Blob Storage ($web)                    Azure Functions (API)
                          (Vite SPA build)                       /api/products, /api/events
                                                                 /api/search, /api/orders
                                                                        │
                                                    ┌───────────────────┼───────────────────┐
                                                    ▼                   ▼                   ▼
                                             Azure SQL DB      Azure Blob Storage    Azure AI Search
                                           (sql-portal-prod)  (stportalinfinityprod) (search-portal-prod)
                                                    ▲                   ▲
                                                    └───────┬───────────┘
                                                   Azure Key Vault
                                                 (Managed Identity)
```

## Azure Resources

| Resource | Name | Type | Resource Group |
|----------|------|------|----------------|
| Front Door | afd-portal-prod | CDN + WAF | rg-portal-network |
| DNS Zone | infinitybd.live | DNS | rg-portal-network |
| App Service | infinity-portal-app-prod-001 | Functions Host | rg-portal-app-prod |
| SQL Server | sql-portal-prod-i001 | Database | rg-portal-app-prod |
| SQL Database | db-portal-imain | Database | rg-portal-app-prod |
| Blob Storage | stportalinfinityprod001 | Static files + images | rg-portal-shared |
| Key Vault | kv-portal-infinity-i001 | Secrets | rg-portal-shared |
| AI Search | search-portal-prod-i001 | Search | rg-portal-app-prod |
| App Insights | insight-portal-prod | Monitoring | rg-portal-shared |
| Log Analytics | log-portal-prod | Logging | rg-portal-shared |
| Managed Identity | oidc-msi-861a | Auth | rg-portal-app-prod |
| Virtual Network | vnet-portal-prod | Networking | rg-portal-network |
| Bastion | bastion-portal-prod | Secure access | rg-portal-network |

## Step 1 — Key Vault Secrets

Add these secrets to `kv-portal-infinity-i001`:

| Secret Name | Description |
|-------------|-------------|
| `sql-server` | `sql-portal-prod-i001.database.windows.net` |
| `sql-database` | `db-portal-imain` |
| `sql-user` | SQL admin username |
| `sql-password` | SQL admin password |
| `azure-search-endpoint` | `https://search-portal-prod-i001.search.windows.net` |
| `azure-search-api-key` | AI Search admin key |
| `storage-connection-string` | Blob Storage connection string |

Grant the Function App's **system-assigned managed identity** the `Key Vault Secrets User` role.

## Step 2 — Function App Settings

In `infinity-portal-app-prod-001` → Configuration → Application Settings:

| Setting | Value |
|---------|-------|
| `KEY_VAULT_URL` | `https://kv-portal-infinity-i001.vault.azure.net` |
| `B2C_TENANT_NAME` | Your Azure AD B2C tenant |
| `B2C_POLICY_NAME` | `B2C_1_signupsignin` |
| `B2C_CLIENT_ID` | B2C application client ID |
| `B2C_ADMIN_ROLE` | `Admin` |
| `AZURE_SEARCH_ENDPOINT` | `https://search-portal-prod-i001.search.windows.net` |
| `AZURE_SEARCH_API_KEY` | AI Search query key |

## Step 3 — Blob Storage Static Website

1. Go to `stportalinfinityprod001` → **Static website** → Enable
2. Set index document: `index.html`
3. Set error document: `index.html` (SPA fallback)
4. Note the primary endpoint URL

## Step 4 — Front Door Configuration

1. **Origin Group**: Add Blob Storage static website as origin
2. **Route**: `/*` → Blob Storage origin
3. **Route**: `/api/*` → Function App origin (`infinity-portal-app-prod-001.azurewebsites.net`)
4. **Custom Domain**: `infinitybd.live` with managed SSL certificate
5. **Caching**: Enable for static assets, disable for `/api/*`
6. **Rules Engine**:
   - Rewrite non-file requests to `/index.html` (SPA routing)
   - Set `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`

## Step 5 — GitHub Secrets

In your GitHub repo → Settings → Secrets → Actions:

### Production

| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Service principal JSON for `az login` |
| `VITE_API_BASE_URL` | `https://infinitybd.live/api` (or Front Door endpoint) |
| `VITE_AZURE_AD_TENANT` | B2C tenant name |
| `VITE_AZURE_AD_CLIENT_ID` | B2C client ID |
| `VITE_AZURE_STORAGE_URL` | `https://stportalinfinityprod001.blob.core.windows.net` |
| `VITE_APPINSIGHTS_CONNECTION_STRING` | From Application Insights → Properties |
| `VITE_AZURE_SEARCH_URL` | `https://search-portal-prod-i001.search.windows.net` |
| `VITE_AZURE_SEARCH_KEY` | AI Search **query** key (read-only, safe for frontend) |

### Staging (for PR previews)

| Secret | Description |
|--------|-------------|
| `VITE_API_BASE_URL_STAGING` | Staging Functions URL, e.g. `https://infinity-portal-app-staging-001.azurewebsites.net/api` |
| `VITE_AZURE_STORAGE_URL_STAGING` | `https://stportalinfinitystaging.blob.core.windows.net` |

### Staging Azure Resources Required

| Resource | Name | Purpose |
|----------|------|---------|
| Storage Account | `stportalinfinitystaging` | PR preview static files (enable Static Website) |
| Function App | `infinity-portal-app-staging-001` | Staging API (create a `staging` deployment slot) |
| Front Door Endpoint | `infinity-frontend-staging` | Staging CDN endpoint on `afd-portal-prod` |

Each PR gets its own path (`/pr-{number}/`) inside the staging storage. A comment with the preview URL is automatically posted on the PR. Files are cleaned up when the PR is closed.

## Step 6 — Azure AI Search Setup

1. Go to `search-portal-prod-i001` → **Indexes**
2. Create index `products-index` with fields: `id`, `name`, `brand`, `category`, `description`, `price`, `tags`
3. Create index `events-index` with fields: `id`, `title`, `brand`, `description`, `venue`, `date`
4. Create **suggesters**: `products-suggester` (on `name`), `events-suggester` (on `title`)
5. Set up **indexers** to pull from Azure SQL tables

## Step 7 — Deploy

1. Connect your repo to GitHub
2. Push to `main` → GitHub Actions will:
   - Build Vite frontend → Upload to Blob Storage `$web` container
   - Build Azure Functions → Deploy to App Service
   - Purge Front Door cache
3. PRs get staging environments

## Step 8 — Application Insights

Telemetry is automatically initialized in the frontend when `VITE_APPINSIGHTS_CONNECTION_STRING` is set:
- **Page views** and route changes (auto-tracked)
- **Exceptions** and unhandled promise rejections
- **Performance** (page load, AJAX timing, CORS correlation)
- **Custom events**: Use `trackEvent()` from `src/services/telemetry.ts`

Backend telemetry: Enable Application Insights in the Function App's configuration panel.

## Local Development

```bash
# Frontend (mock data, no Azure needed)
npm install
npm run dev

# Azure Functions (requires local.settings.json with SQL credentials)
cd azure-functions
npm install
npm start
```

Set `VITE_API_BASE_URL=http://localhost:7071/api` in a `.env.local` file to point the frontend at local Functions.

## SQL Schema

Run `azure-functions/schema.sql` against `db-portal-imain` to create all tables.
Run `azure-functions/seed.sql` to populate sample data.
