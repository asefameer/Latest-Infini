# Azure Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────┐
│  Azure Static Web Apps                      │
│  (React SPA — Vite build)                   │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Editions │  │ Encounter│  │ Admin CMS │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘ │
│       └──────────────┼──────────────┘       │
│                      ▼                      │
│            API Service Layer                │
│         (src/services/api/index.ts)         │
└──────────────────────┬──────────────────────┘
                       │  VITE_API_BASE_URL
                       ▼
         ┌─────────────────────────┐
         │  Azure Functions (API)  │
         │  /api/products          │
         │  /api/events            │
         │  /api/discounts         │
         │  /api/banners           │
         │  /api/crm/*             │
         └────────────┬────────────┘
                      ▼
         ┌─────────────────────────┐
         │  Azure SQL Database     │
         └─────────────────────────┘
```

## Step 1 — Create Azure Resources

1. **Azure Static Web App** — In Azure Portal → Create Resource → Static Web App
2. **Azure Functions** — Create a Function App (Node.js 20, Consumption plan)
3. **Azure SQL** — Create a SQL Database for products, events, discounts, etc.
4. **(Optional) Azure AD B2C** — For admin authentication
5. **(Optional) Azure Blob Storage** — For product/banner images

## Step 2 — GitHub Secrets

In your GitHub repo → Settings → Secrets → Actions, add:

| Secret | Description |
|--------|-------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From Azure Static Web App → Deployment token |
| `VITE_API_BASE_URL` | Your Azure Functions URL, e.g. `https://infinity-api.azurewebsites.net/api` |
| `VITE_AZURE_AD_TENANT` | Azure AD B2C tenant name (optional) |
| `VITE_AZURE_AD_CLIENT_ID` | Azure AD B2C client ID (optional) |
| `VITE_AZURE_STORAGE_URL` | Azure Blob Storage URL (optional) |

## Step 3 — Deploy

1. Connect your Lovable project to GitHub (Settings → GitHub → Connect)
2. Push to `main` → GitHub Actions will build and deploy automatically
3. PRs get automatic staging environments

## Step 4 — Switch from Mock to Live

Once Azure Functions + SQL are provisioned, set `VITE_API_BASE_URL` in GitHub Secrets. The API service layer (`src/services/api/config.ts`) automatically detects this and routes all calls to your Azure backend instead of the in-memory mock store.

## Azure Function Endpoints to Implement

Each endpoint maps 1:1 to methods in `src/services/api/index.ts`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List all products (supports `?category=`, `?brand=`, `?trending=true`, `?new=true`) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/slug/:slug` | Get product by slug |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get event by ID |
| GET | `/api/events/slug/:slug` | Get event by slug |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/api/categories` | List categories |
| GET | `/api/brands` | List brands |
| GET | `/api/discounts` | List discounts |
| GET | `/api/discounts/code/:code` | Validate promo code |
| POST | `/api/discounts` | Create discount |
| PUT | `/api/discounts/:id` | Update discount |
| DELETE | `/api/discounts/:id` | Delete discount |
| GET | `/api/banners` | List banners |
| GET | `/api/crm/customers` | List customers |
| GET | `/api/crm/conversations` | List chatbot conversations |
