
-- ============================================
-- CMS Content Management System
-- ============================================

-- 1. Site Content: key-value store for all editable text, grouped by section
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,        -- e.g. 'hero', 'trinity', 'define_style', 'footer'
  content_key TEXT NOT NULL,    -- e.g. 'heading', 'tagline', 'cta_label'
  content_value TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'url', 'image', 'html'
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section, content_key)
);

-- 2. Navigation Items: editable nav and footer links
CREATE TABLE public.navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'header', -- 'header', 'footer', 'footer_social'
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Homepage Banners: carousel slides
CREATE TABLE public.homepage_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '/',
  accent_color TEXT NOT NULL DEFAULT '180 100% 50%',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;

-- Public read access (all visitors can read CMS content)
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read navigation" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read active banners" ON public.homepage_banners FOR SELECT USING (true);

-- Authenticated users can manage (admin check will be done in app layer for now)
CREATE POLICY "Authenticated users can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site content" ON public.site_content FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert navigation" ON public.navigation_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update navigation" ON public.navigation_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete navigation" ON public.navigation_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert banners" ON public.homepage_banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update banners" ON public.homepage_banners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete banners" ON public.homepage_banners FOR DELETE TO authenticated USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_homepage_banners_updated_at BEFORE UPDATE ON public.homepage_banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
