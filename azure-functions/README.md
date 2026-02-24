# Azure Functions — Infinity API

## Setup

```bash
cd azure-functions
npm install
```

## Local Development

1. Copy `local.settings.json` and fill in your Azure SQL credentials
2. Install [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
3. Run `func start`

## Database Setup

Run `schema.sql` against your Azure SQL Database to create all tables.

## Deploy

```bash
func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
```

## Environment Variables (App Settings)

| Name | Description |
|------|-------------|
| `SQL_SERVER` | Azure SQL server (e.g. `myserver.database.windows.net`) |
| `SQL_DATABASE` | Database name |
| `SQL_USER` | SQL admin username |
| `SQL_PASSWORD` | SQL admin password |
| `B2C_TENANT_NAME` | Azure AD B2C tenant name (e.g. `mycompanyb2c`) |
| `B2C_POLICY_NAME` | B2C user flow policy (e.g. `B2C_1_signupsignin`) |
| `B2C_CLIENT_ID` | Application (client) ID registered in B2C |
| `B2C_ADMIN_ROLE` | Role claim value for admin access (default: `Admin`) |

## Authentication

Admin-only endpoints (POST/PUT/DELETE for products, events, discounts, banners, and all CRM endpoints) are protected by Azure AD B2C JWT validation. Requests must include a valid `Authorization: Bearer <token>` header with the `Admin` role claim.

Public GET endpoints (products, events, categories, brands, discount code validation) remain unauthenticated.

## Endpoints

| Method | Route | Handler |
|--------|-------|---------|
| GET | `/api/products` | List/filter products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/slug/{slug}` | Get product by slug |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/events` | List/filter events |
| GET | `/api/events/{id}` | Get event by ID |
| GET | `/api/events/slug/{slug}` | Get event by slug |
| POST | `/api/events` | Create event |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |
| GET | `/api/discounts` | List discounts |
| GET | `/api/discounts/code/{code}` | Validate promo code |
| POST | `/api/discounts` | Create discount |
| PUT | `/api/discounts/{id}` | Update discount |
| DELETE | `/api/discounts/{id}` | Delete discount |
| GET | `/api/categories` | List categories |
| GET | `/api/brands` | List brands |
| GET | `/api/brands/{id}` | Get brand |
| GET | `/api/banners` | List banners |
| POST | `/api/banners` | Create banner |
| PUT | `/api/banners/{id}` | Update banner |
| DELETE | `/api/banners/{id}` | Delete banner |
| GET | `/api/crm/customers` | List customers (?segment) |
| GET | `/api/crm/customers/{id}` | Get customer |
| POST | `/api/crm/customers` | Create customer |
| PUT | `/api/crm/customers/{id}` | Update customer |
| DELETE | `/api/crm/customers/{id}` | Delete customer |
| GET | `/api/crm/conversations` | List conversations (?status) |
| GET | `/api/crm/conversations/{id}` | Get conversation with messages |
| PUT | `/api/crm/conversations/{id}/status` | Update conversation status |
| POST | `/api/crm/conversations/{id}/messages` | Add message to conversation |
| GET | `/api/crm/email-campaigns` | List email campaigns |
| POST | `/api/crm/email-campaigns` | Create campaign |
| PUT | `/api/crm/email-campaigns/{id}` | Update/schedule campaign |
| GET | `/api/crm/push-notifications` | List push notifications |
| POST | `/api/crm/push-notifications` | Create notification |
| PUT | `/api/crm/push-notifications/{id}` | Update notification |
| GET | `/api/crm/kb-articles` | List KB articles |
| POST | `/api/crm/kb-articles` | Create article |
| PUT | `/api/crm/kb-articles/{id}` | Update article |
| DELETE | `/api/crm/kb-articles/{id}` | Delete article |
| GET | `/api/orders` | List orders (?status, ?customerId, ?email) 🔒 |
| GET | `/api/orders/{id}` | Get order by ID 🔒 |
| POST | `/api/orders` | Create order (from checkout) |
| PUT | `/api/orders/{id}` | Update order 🔒 |
| PUT | `/api/orders/{id}/cancel` | Cancel order (customer) |
| GET | `/api/orders/customer/{email}` | Get orders by customer email |
