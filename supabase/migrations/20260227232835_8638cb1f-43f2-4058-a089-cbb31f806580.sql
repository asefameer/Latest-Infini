
-- ══════════════════════════════════════════════════
-- Products table
-- Uses JSONB for nested arrays (Azure SQL also supports JSON)
-- ══════════════════════════════════════════════════
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('nova', 'live-the-moment', 'x-force')),
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'BDT',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════
-- Events table
-- ══════════════════════════════════════════════════
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('nova', 'live-the-moment', 'x-force')),
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  time TEXT NOT NULL DEFAULT '',
  venue TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  banner_image TEXT NOT NULL DEFAULT '/placeholder.svg',
  description TEXT NOT NULL DEFAULT '',
  lineup JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '[]'::jsonb,
  ticket_tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════
-- Categories table
-- ══════════════════════════════════════════════════
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '/placeholder.svg',
  product_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════
-- Indexes
-- ══════════════════════════════════════════════════
CREATE INDEX idx_products_brand ON public.products (brand);
CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_slug ON public.products (slug);
CREATE INDEX idx_events_brand ON public.events (brand);
CREATE INDEX idx_events_slug ON public.events (slug);
CREATE INDEX idx_events_date ON public.events (date);

-- ══════════════════════════════════════════════════
-- RLS policies (public read, authenticated write)
-- ══════════════════════════════════════════════════
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "Auth users can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Auth users can delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Auth users can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Auth users can delete events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Auth users can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Auth users can delete categories" ON public.categories FOR DELETE USING (true);

-- Updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
