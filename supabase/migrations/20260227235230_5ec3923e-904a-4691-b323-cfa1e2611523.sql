
-- Add is_live column to products table (default false = draft/saved for later)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_live boolean NOT NULL DEFAULT false;
