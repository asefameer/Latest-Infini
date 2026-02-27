# Azure Migration Guide — Infinity Portal

## Overview

This document describes how to migrate the Infinity Portal from **Lovable Cloud** (current deployment) to your **Azure** infrastructure. The application's three-tier backend architecture (`supabase` → `azure` → `mock`) makes this a configuration switch, not a rewrite.

## Current Architecture (Lovable Cloud)

```
User → Lovable Preview URL
         │
         ├── Vite SPA (React + TypeScript)
         │     └── API Service Layer (src/services/api/)
         │           └── Backend Mode: 'supabase'
         │                 └── Supabase Client → PostgreSQL
         │
         └── Lovable Cloud (Supabase)
               ├── PostgreSQL Database
               │     ├── products (JSONB columns for nested data)
               │     ├── events (JSONB columns)
               │     ├── categories
               │     ├── site_content (CMS key-value)
               │     ├── navigation_items
               │     └── homepage_banners
               └── Storage (cms-images bucket)
```

## Target Architecture (Azure)

```
User → GoDaddy DNS → Azure DNS → Azure Front Door (CDN + SSL)
                                       │
                      ┌────────────────┼────────────────────┐
                      ▼                                      ▼
            Blob Storage ($web)              Azure Functions v4 (API)
            (Vite SPA build)                 /api/products, /api/events
                                             /api/categories, /api/search
                                                      │
                                  ┌───────────────────┼──────────────────┐
                                  ▼                   ▼                  ▼
                           Azure SQL DB       Azure Blob Storage   Azure AI Search
                         (db-portal-imain)  (stportalinfinityprod) (search-portal)
                                  ▲                   ▲
                                  └───────┬───────────┘
                                 Azure Key Vault
                               (Managed Identity)
```

---

## Migration Steps

### Phase 1: Database Migration (PostgreSQL → Azure SQL)

#### 1.1 Schema Translation

The PostgreSQL schema uses `JSONB` columns. Azure SQL supports `NVARCHAR(MAX)` with `JSON` functions. Here's the mapping:

| PostgreSQL | Azure SQL |
|------------|-----------|
| `UUID DEFAULT gen_random_uuid()` | `UNIQUEIDENTIFIER DEFAULT NEWID()` |
| `JSONB` | `NVARCHAR(MAX)` with `ISJSON()` check |
| `TIMESTAMPTZ` | `DATETIMEOFFSET` |
| `NUMERIC(10,2)` | `DECIMAL(10,2)` |
| `BOOLEAN` | `BIT` |
| `TEXT` | `NVARCHAR(MAX)` or `NVARCHAR(n)` |

#### 1.2 Azure SQL Schema

Run this in Azure SQL Database (`db-portal-imain`):

```sql
-- Products table
CREATE TABLE dbo.products (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  slug NVARCHAR(255) NOT NULL UNIQUE,
  name NVARCHAR(500) NOT NULL,
  brand NVARCHAR(50) NOT NULL CHECK (brand IN ('nova', 'live-the-moment', 'x-force')),
  category NVARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2) NULL,
  currency NVARCHAR(10) NOT NULL DEFAULT 'BDT',
  images NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  description NVARCHAR(MAX) NOT NULL DEFAULT '',
  specs NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  variants NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  tags NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  in_stock BIT NOT NULL DEFAULT 1,
  is_new BIT NOT NULL DEFAULT 0,
  is_trending BIT NOT NULL DEFAULT 0,
  seo_title NVARCHAR(255) NULL,
  seo_description NVARCHAR(500) NULL,
  og_image NVARCHAR(500) NULL,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  CONSTRAINT CK_products_images CHECK (ISJSON(images) = 1),
  CONSTRAINT CK_products_specs CHECK (ISJSON(specs) = 1),
  CONSTRAINT CK_products_variants CHECK (ISJSON(variants) = 1),
  CONSTRAINT CK_products_tags CHECK (ISJSON(tags) = 1)
);

-- Events table
CREATE TABLE dbo.events (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  slug NVARCHAR(255) NOT NULL UNIQUE,
  title NVARCHAR(500) NOT NULL,
  brand NVARCHAR(50) NOT NULL CHECK (brand IN ('nova', 'live-the-moment', 'x-force')),
  date DATETIMEOFFSET NOT NULL,
  end_date DATETIMEOFFSET NULL,
  time NVARCHAR(50) NOT NULL DEFAULT '',
  venue NVARCHAR(500) NOT NULL DEFAULT '',
  city NVARCHAR(200) NOT NULL DEFAULT '',
  banner_image NVARCHAR(500) NOT NULL DEFAULT '/placeholder.svg',
  description NVARCHAR(MAX) NOT NULL DEFAULT '',
  lineup NVARCHAR(MAX) DEFAULT '[]',
  schedule NVARCHAR(MAX) DEFAULT '[]',
  ticket_tiers NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  faq NVARCHAR(MAX) NOT NULL DEFAULT '[]',
  is_featured BIT NOT NULL DEFAULT 0,
  seo_title NVARCHAR(255) NULL,
  seo_description NVARCHAR(500) NULL,
  og_image NVARCHAR(500) NULL,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  CONSTRAINT CK_events_lineup CHECK (ISJSON(lineup) = 1),
  CONSTRAINT CK_events_schedule CHECK (ISJSON(schedule) = 1),
  CONSTRAINT CK_events_tiers CHECK (ISJSON(ticket_tiers) = 1),
  CONSTRAINT CK_events_faq CHECK (ISJSON(faq) = 1)
);

-- Categories table
CREATE TABLE dbo.categories (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  slug NVARCHAR(255) NOT NULL UNIQUE,
  name NVARCHAR(255) NOT NULL,
  description NVARCHAR(MAX) NOT NULL DEFAULT '',
  image NVARCHAR(500) NOT NULL DEFAULT '/placeholder.svg',
  product_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- CMS: Site Content
CREATE TABLE dbo.site_content (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  section NVARCHAR(100) NOT NULL,
  content_key NVARCHAR(100) NOT NULL,
  content_value NVARCHAR(MAX) NOT NULL DEFAULT '',
  content_type NVARCHAR(50) NOT NULL DEFAULT 'text',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  CONSTRAINT UQ_site_content UNIQUE (section, content_key)
);

-- CMS: Navigation Items
CREATE TABLE dbo.navigation_items (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  location NVARCHAR(50) NOT NULL DEFAULT 'header',
  label NVARCHAR(255) NOT NULL,
  href NVARCHAR(500) NOT NULL,
  parent_id UNIQUEIDENTIFIER NULL REFERENCES dbo.navigation_items(id),
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BIT NOT NULL DEFAULT 1,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- CMS: Homepage Banners
CREATE TABLE dbo.homepage_banners (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(255) NOT NULL,
  tagline NVARCHAR(500) NOT NULL DEFAULT '',
  image_url NVARCHAR(500) NOT NULL,
  link NVARCHAR(500) NOT NULL DEFAULT '/',
  accent_color NVARCHAR(50) NOT NULL DEFAULT '180 100% 50%',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BIT NOT NULL DEFAULT 1,
  created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- Indexes
CREATE INDEX idx_products_brand ON dbo.products (brand);
CREATE INDEX idx_products_category ON dbo.products (category);
CREATE INDEX idx_products_slug ON dbo.products (slug);
CREATE INDEX idx_events_brand ON dbo.events (brand);
CREATE INDEX idx_events_slug ON dbo.events (slug);
CREATE INDEX idx_events_date ON dbo.events (date);
```

#### 1.3 Data Export & Import

Export data from Lovable Cloud PostgreSQL and import into Azure SQL:

```bash
# Option A: Use the Supabase CLI to export as CSV
# Then use Azure Data Studio or bcp to import

# Option B: Write a one-time script using the Supabase JS client
# to read all data and POST it to your Azure Functions
```

The column names are identical between PostgreSQL and Azure SQL (both use `snake_case`), so data export/import is straightforward.

### Phase 2: Azure Functions API

#### 2.1 Existing Functions

Your Azure Functions are already defined in `azure-functions/src/functions/`. They use the same column names as the database. The key functions to verify:

| Function File | Endpoint | Description |
|--------------|----------|-------------|
| `products.ts` | `/api/products` | CRUD for products |
| `events.ts` | `/api/events` | CRUD for events |
| `catalog.ts` | `/api/catalog` | Categories listing |
| `search.ts` | `/api/search` | Azure AI Search proxy |
| `orders.ts` | `/api/orders` | Order management |
| `discounts.ts` | `/api/discounts` | Promo code management |

#### 2.2 Column Mapping in Functions

The `toProduct()` and `toDbProduct()` mapper functions in `src/services/api/supabase-store.ts` show the exact camelCase ↔ snake_case mapping. **Reuse these mappers** in your Azure Functions to maintain API compatibility:

```typescript
// azure-functions/src/shared/mappers.ts
// Copy toProduct, toEvent, toDbProduct, toDbEvent from
// src/services/api/supabase-store.ts
```

#### 2.3 Image Storage Migration

- **Current**: Images stored in Lovable Cloud storage bucket `cms-images`
- **Target**: Azure Blob Storage container `cms-images` in `stportalinfinityprod001`

Steps:
1. Create container `cms-images` in Azure Blob Storage with public read access
2. Download all files from the Supabase storage bucket
3. Upload to Azure Blob container
4. Update `image_url` values in the database to point to Azure Blob URLs

### Phase 3: Frontend Configuration Switch

#### 3.1 Environment Variables

The frontend automatically switches backends based on environment variables. To switch to Azure:

```bash
# .env.production (for Azure deployment)
VITE_API_BASE_URL=https://infinitybd.live/api
VITE_AZURE_AD_TENANT=your-b2c-tenant
VITE_AZURE_AD_CLIENT_ID=your-client-id
VITE_AZURE_STORAGE_URL=https://stportalinfinityprod001.blob.core.windows.net
VITE_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
VITE_AZURE_SEARCH_URL=https://search-portal-prod-i001.search.windows.net
VITE_AZURE_SEARCH_KEY=your-query-key
```

When `VITE_API_BASE_URL` is set, the API service layer (`src/services/api/config.ts`) automatically resolves to `'azure'` mode. All data operations route through `httpClient` → Azure Functions.

#### 3.2 What Changes Automatically

| Component | Lovable Cloud | Azure |
|-----------|--------------|-------|
| Products API | Supabase client | Azure Functions `/api/products` |
| Events API | Supabase client | Azure Functions `/api/events` |
| Categories API | Supabase client | Azure Functions `/api/catalog` |
| CMS Content | Supabase client (use-cms hooks) | *See 3.3* |
| Banners | Supabase client (use-cms hooks) | *See 3.3* |
| Image Upload | Supabase Storage | Azure Blob Storage |
| Authentication | Supabase Auth (if enabled) | Azure AD B2C |
| Search | Supabase full-text | Azure AI Search |
| Telemetry | None | Application Insights |

#### 3.3 CMS Hooks Migration

The CMS hooks (`src/hooks/use-cms.ts`) currently use the Supabase client directly. To migrate to Azure:

1. Create Azure Functions endpoints for `site_content`, `navigation_items`, `homepage_banners`
2. Update `use-cms.ts` to use `httpClient` when in Azure mode:

```typescript
import { API_CONFIG } from '@/services/api/config';
import { httpClient } from '@/services/api/http-client';

export function useSiteContent(section?: string) {
  return useQuery({
    queryKey: ['site_content', section],
    queryFn: async () => {
      if (API_CONFIG.BACKEND_MODE === 'azure') {
        return httpClient.get(`/cms/content${section ? `?section=${section}` : ''}`);
      }
      // Current Supabase implementation
      let query = supabase.from('site_content').select('*').order('sort_order');
      if (section) query = query.eq('section', section);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
```

### Phase 4: CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/azure-deploy.yml`) handles:

1. **Build** Vite frontend with Azure env vars
2. **Upload** to Azure Blob Storage `$web` container
3. **Build & Deploy** Azure Functions
4. **Purge** Front Door cache

See `AZURE_DEPLOYMENT.md` for detailed resource configuration.

### Phase 5: Verification Checklist

- [ ] Azure SQL tables created with all indexes
- [ ] Data exported from Lovable Cloud and imported to Azure SQL
- [ ] All Azure Functions endpoints return correct data format
- [ ] Column mappers (toProduct, toEvent) produce identical output
- [ ] Images migrated to Azure Blob Storage
- [ ] CMS content accessible via Azure Functions
- [ ] Frontend builds with Azure env vars
- [ ] Front Door routes `/api/*` to Functions, `/*` to Blob Storage
- [ ] Azure AI Search indexers configured for products and events
- [ ] Application Insights receiving telemetry
- [ ] Staging environment functional for PR previews

---

## Architecture Decision: Three-Tier Backend

The API service layer (`src/services/api/config.ts`) supports three modes:

| Mode | Trigger | Use Case |
|------|---------|----------|
| `supabase` | Default (no env vars) | Current Lovable Cloud deployment |
| `azure` | `VITE_API_BASE_URL` is set | Production Azure deployment |
| `mock` | `VITE_USE_MOCK=true` | Offline development, testing |

This architecture ensures:
- **Zero UI changes** when switching backends
- **Gradual migration** — move one service at a time
- **Rollback safety** — revert to Lovable Cloud by removing the env var
- **Local development** — mock mode works without any backend

## File Reference

| File | Purpose |
|------|---------|
| `src/services/api/config.ts` | Backend mode resolution |
| `src/services/api/index.ts` | Unified API with three-way routing |
| `src/services/api/supabase-store.ts` | Supabase CRUD + column mappers |
| `src/services/api/http-client.ts` | Azure Functions HTTP client |
| `src/services/api/mock-store.ts` | In-memory mock data |
| `src/hooks/use-cms.ts` | CMS content hooks (Supabase direct) |
| `azure-functions/` | Azure Functions source code |
| `azure-functions/schema.sql` | Azure SQL schema (update with above) |
