

# INFINITY Platform — Full Implementation Plan

## Phase 1: Frontend — Pixel-Perfect Infinity Website
Build the customer-facing website matching the PDF design exactly:

- **Splash Screen** — Dark background with glowing infinity logo animation
- **Ground Zero (Hero)** — Full-screen hero with "INFINITY" title, tagline "Towards infinite possibilities", abstract colorful visuals, navigation bar (Ground Zero, The Trinity, Editions, Encounter), cart icon, user icon, and "SCROLL" indicator
- **Scrolled Hero State** — Shows description text, NOVA | LIVE THE MOMENT | XFORCE links, and EDITIONS/ENCOUNTER CTA buttons
- **The Trinity Section** — "The Trinity Collective" heading with three image cards for NOVA, Live The Moment, and X Force, each with descriptions
- **Navigation** — Sticky top nav with infinity logo, section links with active state pill, cart and profile icons
- **Dark premium theme** — Deep dark backgrounds, neon gradient accents (cyan-to-purple), modern typography
- Copy all images from the PDF into the project assets

## Phase 2: Editions (E-Commerce) — Shopify Integration
Enable Shopify for the physical product storefront:

- **Product Listings** — Browse products by category (NOVA, Live The Moment, X Force collections)
- **Product Detail Pages** — Images, variants (sizes, colors), pricing, add to cart
- **Shopping Cart** — Slide-out cart with quantity management
- **Checkout** — Shopify-powered checkout with Stripe payment
- **Order History** — Customers can view past orders

> Note: Shopify creates a development store for free. A paid Shopify subscription is only needed when you're ready to sell live. Claiming the store starts a 30-day free trial.

## Phase 3: Encounter (Event Ticketing)
Custom-built event/ticket platform using Supabase:

- **Event Listings** — Browse upcoming events with images, dates, venues
- **Event Detail Pages** — Full event info, ticket tiers, availability
- **Ticket Purchase** — Select quantity/tier, checkout with Stripe + bKash option
- **Digital Tickets** — QR code-based e-tickets sent to customer
- **My Tickets** — Dashboard for customers to view purchased tickets

## Phase 4: Authentication & User Accounts
Supabase Auth with user profiles:

- **Sign Up / Login** — Email + password, optional Google sign-in
- **User Profile** — Name, avatar, contact info, preferences
- **Order & Ticket History** — Unified view of purchases
- **Role-Based Access** — Separate roles table for admin/customer distinction

## Phase 5: AI Chatbot
Customer-facing chatbot using Lovable AI:

- **Chat Widget** — Floating chat bubble on the website
- **Conversational AI** — Answers questions about products, events, orders
- **Context-Aware** — Knows about the Infinity brand, NOVA, Live The Moment, X Force

## Phase 6: Admin Editor Tool
Admin-only dashboard for content management:

- **Admin Login** — Role-based access (admin role required)
- **Banner Manager** — Upload/change hero banners and images
- **Content Editor** — Edit section text, descriptions, taglines
- **Discount Manager** — Create/edit discount codes and promotions
- **Layout Controls** — Toggle sections, reorder content blocks
- **Live Preview** — See changes before publishing

## Phase 7: CRM Tool
Admin-only customer relationship management:

- **Customer List** — View all registered customers with search/filter
- **Email Campaigns** — Compose and send emails to customer segments
- **Push Notifications** — Send browser push notifications to users
- **Live Chat Management** — Admin view of customer chat conversations
- **Chatbot Knowledge Base** — Upload documents, add/remove/update knowledge entries that the chatbot uses to answer questions

## Azure Deployment
For going live on Azure:

- **Azure Static Web Apps** — Host the React frontend (export from Lovable, deploy via GitHub Actions)
- **Supabase** — Handles database, auth, edge functions, and storage (hosted on Supabase infrastructure)
- **Azure CDN** (optional) — For faster asset delivery
- **Custom Domain** — Configure your domain to point to Azure Static Web Apps

### Azure Services Summary:
1. **Azure Static Web Apps** — Frontend hosting
2. **Azure DNS** (optional) — Domain management
3. **Azure CDN** (optional) — Performance optimization
4. Supabase (external) — Backend, database, auth, serverless functions
5. Shopify (external) — E-commerce product management

