-- ============================================================
-- BIBLIOPHILE VIBES — SUPABASE SCHEMA & RLS SETUP
-- Phase 1: Database-Powered Book Inventory
-- ============================================================

-- 1. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT,
    isbn TEXT,
    pages INTEGER DEFAULT 0,
    condition TEXT DEFAULT 'Good',
    rental_price NUMERIC(10,2) DEFAULT 30.00,
    rental_duration INTEGER DEFAULT 7,
    security_deposit NUMERIC(10,2) DEFAULT 100.00,
    availability TEXT DEFAULT 'Available', -- 'Available', 'Rented', 'Reserved', 'Coming Soon', 'Unavailable'
    cover_image TEXT,
    cover_images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    mrp NUMERIC(10,2),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Indexes for Fast Public Search and Filtering
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING gin (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books USING gin (to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_genre ON public.books (genre);
CREATE INDEX IF NOT EXISTS idx_books_availability ON public.books (availability);
CREATE INDEX IF NOT EXISTS idx_books_featured ON public.books (featured);
CREATE INDEX IF NOT EXISTS idx_books_archived ON public.books (is_archived);

-- 3. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 5. Define Access Policies
-- Public Visitors: Can SELECT any non-archived book
DROP POLICY IF EXISTS "Public can view active books" ON public.books;
CREATE POLICY "Public can view active books"
ON public.books
FOR SELECT
TO anon, authenticated
USING (is_archived = FALSE);

-- Authenticated Admins: Can perform SELECT, INSERT, UPDATE, DELETE on all books
DROP POLICY IF EXISTS "Admins have full access to books" ON public.books;
CREATE POLICY "Admins have full access to books"
ON public.books
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Storage Bucket for Book Covers
-- Note: You can create the bucket 'book-covers' via the Supabase dashboard or via SQL below:
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view covers
DROP POLICY IF EXISTS "Public can view book covers" ON storage.objects;
CREATE POLICY "Public can view book covers"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'book-covers');

-- Storage RLS: Authenticated admin can upload covers
DROP POLICY IF EXISTS "Admins can upload book covers" ON storage.objects;
CREATE POLICY "Admins can upload book covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "Admins can update book covers" ON storage.objects;
CREATE POLICY "Admins can update book covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "Admins can delete book covers" ON storage.objects;
CREATE POLICY "Admins can delete book covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'book-covers');
