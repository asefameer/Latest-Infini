
-- Fix RLS policies: Change RESTRICTIVE to PERMISSIVE for all CMS tables
-- The admin panel uses a custom auth, not Supabase Auth, so we need permissive policies

-- homepage_banners
DROP POLICY IF EXISTS "Anyone can read active banners" ON public.homepage_banners;
DROP POLICY IF EXISTS "Authenticated users can insert banners" ON public.homepage_banners;
DROP POLICY IF EXISTS "Authenticated users can update banners" ON public.homepage_banners;
DROP POLICY IF EXISTS "Authenticated users can delete banners" ON public.homepage_banners;

CREATE POLICY "Anyone can read banners" ON public.homepage_banners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert banners" ON public.homepage_banners FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update banners" ON public.homepage_banners FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete banners" ON public.homepage_banners FOR DELETE TO anon, authenticated USING (true);

-- site_content
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;

CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert site content" ON public.site_content FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update site content" ON public.site_content FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete site content" ON public.site_content FOR DELETE TO anon, authenticated USING (true);

-- navigation_items
DROP POLICY IF EXISTS "Anyone can read navigation" ON public.navigation_items;
DROP POLICY IF EXISTS "Authenticated users can insert navigation" ON public.navigation_items;
DROP POLICY IF EXISTS "Authenticated users can update navigation" ON public.navigation_items;
DROP POLICY IF EXISTS "Authenticated users can delete navigation" ON public.navigation_items;

CREATE POLICY "Anyone can read navigation" ON public.navigation_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert navigation" ON public.navigation_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update navigation" ON public.navigation_items FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete navigation" ON public.navigation_items FOR DELETE TO anon, authenticated USING (true);

-- products
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Auth users can insert products" ON public.products;
DROP POLICY IF EXISTS "Auth users can update products" ON public.products;
DROP POLICY IF EXISTS "Auth users can delete products" ON public.products;

CREATE POLICY "Anyone can read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

-- events
DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
DROP POLICY IF EXISTS "Auth users can insert events" ON public.events;
DROP POLICY IF EXISTS "Auth users can update events" ON public.events;
DROP POLICY IF EXISTS "Auth users can delete events" ON public.events;

CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE TO anon, authenticated USING (true);

-- categories
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
DROP POLICY IF EXISTS "Auth users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Auth users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Auth users can delete categories" ON public.categories;

CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE TO anon, authenticated USING (true);
