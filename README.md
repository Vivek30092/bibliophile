# Bibliophile Vibes — Modern Book Rental Web Application (Phase 1)

Modern, mobile-first bookstore and rental web application for **Bibliophile Vibes** (home library in Sukhliya, Indore). Built with React, Vite, TypeScript, Tailwind CSS, React Router, and Supabase.

---

## 🌟 Key Features Implemented (Phase 1)

1. **Responsive Mobile-First Bookstore Experience**:
   - Polished bookstore aesthetic preserving original warm dark design tokens (`#141210`, `#1E1A16`, gold accent `#C4945A`, Cormorant Garamond serif headings, Inter body).
   - Fluid 2-column card layout on small/mobile screens, scaling to 3 and 4 columns on tablets and desktops.
   - Ambient glow effects and floating hero book covers.
2. **Fast Book Catalogue**:
   - Comprehensive catalogue of books with responsive cover presentation, genre badges, rental rates, and availability statuses.
   - Featured "Book of the Week" spotlight section.
   - Complete library stats strip, "How It Works" 5-step process, transparent "Rental Rules", and "Reader's Corner".
3. **Dedicated Book Detail Pages & URL Sharing**:
   - Dedicated `/books/:id` route for every book.
   - Full cover image display (with thumbnail gallery for multi-cover books), full synopsis, duration, condition, pages, ISBN, rental rate, and refundable security deposit.
   - Social sharing and link copy button.
4. **Correct Browser & Mobile Back-Button Navigation**:
   - Replaced modal overlay with client-side React Router navigation.
   - When a customer navigates from a searched/filtered catalogue to a book and presses the phone or browser Back button, they return to the exact previous catalogue state (search queries, active filters, and scroll position preserved).
   - "Back to Catalogue" button with intelligent history detection and safe fallback to `/`.
   - Direct links (e.g. `/books/BK001`) and page refreshes work reliably via SPA redirects.
5. **Real-Time Search & Dynamic Filters**:
   - Instant case-insensitive search by book title, author, or genre.
   - Dynamic genre filter tags extracted automatically from current inventory.
   - Availability filters (All, Available Now, Coming Soon, Rented).
   - Combined multi-filter support with one-click "Reset Filters" and friendly empty state.
6. **WhatsApp Enquiry & Rental Action**:
   - One-click click-to-chat integration with official WhatsApp API URL scheme.
   - Prefills book title, author, and book ID (e.g., `Hi Bibliophile Vibes! I would like to enquire about renting "The Alchemist" by Paulo Coelho (Book ID: BK016). Is it available?`).
   - Sticky WhatsApp button for mobile screens and general WhatsApp chat link.
7. **Database-Powered Inventory with Supabase**:
   - Complete PostgreSQL schema (`supabase/schema.sql`) with Row Level Security (RLS).
   - Public visitors have read-only access to active books.
   - Authenticated administrators have full write permissions.
   - Ready-to-run seed data (`supabase/seed.sql`) containing all 54 original inventory books migrated from the Google Sheet.
   - Automatic fallback dataset (`src/data/initialBooks.json`) so the website runs locally and previews seamlessly even before Supabase is connected.
8. **Secure Admin Portal (`/admin`)**:
   - Protected route requiring admin authentication via Supabase Auth.
   - Live inventory counters (Total Books, Available, Rented, Coming Soon).
   - Searchable, filterable inventory table.
   - Form to Add and Edit books with live image file upload to Supabase Storage (or direct image URLs).
   - Safe archive functionality with confirmation step.
9. **Zero-Configuration Netlify Deployment**:
   - `_redirects` and `netlify.toml` configured for SPA routing (`/* -> /index.html 200`).
   - Optimized asset chunking in `vite.config.ts`.

---

## 📁 Project Structure

```
bibliophile/
├── public/
│   ├── _redirects                  ← Netlify SPA redirect rule
│   ├── assets/
│   │   └── favicon.svg             ← Library favicon
│   └── Terms & Conditions _ Bibliophile.pdf
├── src/
│   ├── components/                 ← UI components
│   │   ├── AdminBookModal.tsx      ← Modal form for Add/Edit book
│   │   ├── BookCard.tsx            ← Catalogue book card
│   │   ├── FeaturedBook.tsx        ← Spotlight Book of the Week
│   │   ├── FilterChips.tsx         ← Genre & status filter chips
│   │   ├── Footer.tsx              ← Bookstore footer & contacts
│   │   ├── Hero.tsx                ← Hero section & floating covers
│   │   ├── HowItWorks.tsx          ← 5-step rental guide
│   │   ├── Navbar.tsx              ← Responsive navbar & mobile menu
│   │   ├── ReadersCorner.tsx       ← Community quotes & reading notes
│   │   ├── RentalRules.tsx         ← Guidelines & deposit policies
│   │   ├── SearchBar.tsx           ← Fast search input
│   │   └── StatsStrip.tsx          ← Key metrics strip
│   ├── data/
│   │   └── initialBooks.json       ← 54 migrated books fallback data
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx  ← Inventory management dashboard
│   │   ├── AdminLoginPage.tsx      ← Admin sign-in portal
│   │   ├── BookDetailPage.tsx      ← Individual book page & WhatsApp CTA
│   │   └── CataloguePage.tsx       ← Public catalogue & homepage
│   ├── services/
│   │   ├── authService.ts          ← Supabase authentication wrapper
│   │   ├── bookService.ts          ← Inventory CRUD & Supabase/fallback sync
│   │   └── supabase.ts             ← Supabase client initialization
│   ├── types/
│   │   └── book.ts                 ← TypeScript data interfaces
│   ├── utils/
│   │   └── whatsapp.ts             ← WhatsApp click-to-chat URL helpers
│   ├── App.tsx                     ← React Router setup
│   ├── index.css                   ← Tailwind CSS & design tokens
│   ├── main.tsx                    ← Application entry point
│   └── vite-env.d.ts               ← Environment variable typings
├── supabase/
│   ├── schema.sql                  ← PostgreSQL table, indexes & RLS policies
│   └── seed.sql                    ← Complete SQL seed with 54 books
├── scripts/
│   ├── migrate-inventory.js        ← CSV parser & seed generator
│   └── import-to-supabase.js       ← Programmatic REST migration script
├── existing_inventory.csv          ← Preserved 54-row inventory data
├── index.html                      ← Vite HTML entry
├── netlify.toml                    ← Netlify deployment configuration
├── package.json                    ← Project dependencies & scripts
├── tailwind.config.js              ← Tailwind configuration & custom theme
└── vite.config.ts                  ← Vite build configuration & chunking
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env


### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

> **Note**: Even without Supabase credentials filled, the website operates seamlessly in local fallback mode with all 54 books, search, filters, detail views, and a local demo admin login (`admin@bibliophile.com` / `admin123`)!

---

## 🗄️ Supabase Setup & Migration Guide

### Step 1: Create a Supabase Project (Free Tier)
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and select your preferred region (e.g. Mumbai, India `ap-south-1`).
3. Set your database password and wait ~1 minute for setup to complete.

### Step 2: Apply Database Schema & RLS Policies
1. In the Supabase Dashboard, go to the **SQL Editor** (left sidebar).
2. Open or copy the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Paste into the SQL Editor and click **Run**.
4. This creates:
   - The `books` table with columns, data types, and timestamps.
   - Search indexes on `title`, `author`, `genre`, and `availability`.
   - Row Level Security (RLS) policies allowing public `SELECT` and authenticated admin `ALL` operations.
   - The public storage bucket `book-covers` with upload policies.

### Step 3: Populate Inventory Seed Data
You have two easy options:

**Option A (Via SQL Editor — Fastest):**
1. In Supabase Dashboard → **SQL Editor**, open [`supabase/seed.sql`](supabase/seed.sql).
2. Paste and click **Run**.
3. All 54 books are immediately inserted with correct pricing, categories, and cover URLs.

**Option B (Via Node Script):**
```bash
node scripts/import-to-supabase.js
```

### Step 4: Create the First Administrator Account
1. In Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter your administrator email and a strong password (e.g. `owner@bibliophile.in`).
4. Toggle **Auto Confirm User?** to `ON` so the account is immediately active without email verification.
5. You can now use these credentials to log in at `https://bibliophilebooks.netlify.app/admin/login`!

---



1. **Push Changes to GitHub**:
   ```bash
   git add .
   git commit -m "Modernise website to Phase 1: React + Vite + Supabase"
   git push origin main
   ```
2. **Netlify Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Configure Environment Variables on Netlify**:
   - Go to your site settings on Netlify: **Site configuration** → **Environment variables**.
   - Add:

4. Netlify will automatically build and deploy. All routes (`/`, `/books/:id`, `/admin`) and page refreshes work properly thanks to `_redirects` and `netlify.toml`.

---

## 🧪 Acceptance Testing Summary

| Requirement | Status | Notes |
|---|---|---|
| Responsive mobile-first design | ✅ Passed | Tested across mobile (2-column grid), tablet (3-column), and desktop (4-column) |
| Fast book catalogue | ✅ Passed | Instant render of book cards with covers, pricing, genre badges, and status |
| Individual book detail pages | ✅ Passed | Route `/books/:id` renders full details, ISBN, condition, deposit, and synopsis |
| Browser & Mobile Back Navigation | ✅ Passed | Mobile/browser Back button accurately returns user to filtered catalogue state |
| Search by title and author | ✅ Passed | Case-insensitive multi-field search with instant query updates |
| Dynamic Genre & Status Filters | ✅ Passed | Filter chips derived dynamically from inventory + status toggle + reset |
| WhatsApp enquiry button | ✅ Passed | Official click-to-chat URL with prefilled book title, author, and book ID |
| Database-backed inventory | ✅ Passed | Supabase PostgreSQL schema, RLS policies, and seed data migration |
| Secure Admin Dashboard | ✅ Passed | Protected route `/admin`, stats counters, Add/Edit book modal, and Archive |
| Netlify SPA Deployment Ready | ✅ Passed | Production build verified (`dist/` generated with `_redirects` and `netlify.toml`) |
