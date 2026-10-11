# Jain Vastar Bhandar (JVB) — Official Production Website & Store Manager

> **Elegance Woven Since 1977** • Exclusively Unstitched Ladies' Suits  
> Railway Road, Gharaunda, Karnal, Haryana – 132114, India  
> Primary Contact: 9416950256 | WhatsApp & Orders: 7015344280 | Instagram: [@jainvasterbhandar](https://www.instagram.com/jainvasterbhandar?exln=ZjU0a3Jwam43bmdo)

A modern, responsive, production-ready e-commerce catalog and private inventory management platform built for **Jain Vastar Bhandar (JVB)**.

---

## 🌟 Key Highlights

- **Boutique Storefront:** Dedicated exclusively to unstitched ladies' suits (Pure Cotton, Chanderi Silk, Georgette, Organza, Modal Silk, and more).
- **Direct WhatsApp Ordering:** Inquiry-based ordering via WhatsApp (+91 7015344280) with prefilled suit name, unique product code (SKU), requested quantity, and shareable URL.
- **Private Admin Dashboard (`/admin`):** Usable on mobile phones and laptops without technical skills. Manage inventory, upload photos, adjust stock, and edit prices without touching code or redeploying the site.
- **Bulk CSV Product Importer:** Import 100–200+ suits at once with built-in duplicate SKU detection, price validation, error reporting, and preview.
- **Supabase Cloud Backend:** PostgreSQL database with Row Level Security (RLS), Supabase Auth, and Supabase Storage for product images.
- **Netlify-Ready:** Optimized production build with SPA fallback routing configured in both `public/_redirects` and `netlify.toml`.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS with custom JVB royal palette (Fuchsia Rani Pink, Wine, Ivory, Charcoal)
- **Routing:** React Router v7
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Storage Buckets)
- **Icons & CSV:** Lucide React, PapaParse
- **Hosting:** Netlify (Zero-configuration SPA routing)

---

## 📁 Project Directory Structure

```text
jain-vastar-bhandar/
├── index.html                           # App entry point, typography & branding
├── netlify.toml                         # Netlify build & SPA redirect configuration
├── package.json
├── tailwind.config.js                   # JVB brand colors, fonts & shadows
├── vite.config.ts                       # Chunk-optimized Vite configuration
├── public/
│   ├── _redirects                       # Netlify SPA route fallback (/* /index.html 200)
│   ├── favicon.svg                      # Custom JVB 1977 SVG favicon
│   └── templates/
│       ├── jvb_product_import_blank_template.csv  # Blank CSV for Excel/Sheets
│       └── jvb_product_import_sample.csv          # Sample CSV with marked demo data
├── supabase/
│   ├── schema.sql                       # Complete PostgreSQL tables, triggers & RLS policies
│   ├── initial_admin.sql                # Secure administrator setup script
│   └── demo_seed.sql                    # Optional sample suits clearly marked as [DEMO DATA]
└── src/
    ├── types/                           # Strict TypeScript interfaces
    ├── utils/                           # Business constants, WhatsApp URL builders, INR formatter
    ├── lib/supabase/                    # Supabase client with safe unconfigured fallbacks
    ├── services/                        # productService, storageService, csvService
    ├── context/                         # AuthContext (session, login, admin verification)
    ├── components/common/               # Navbar, Footer, ProductCard, WhatsAppFloatingButton, etc.
    ├── layouts/                         # StorefrontLayout
    ├── pages/                           # HomePage, ShopPage, ProductDetailPage, AboutPage, ContactPage, NotFoundPage
    └── admin/                           # AdminLayout, AdminDashboardPage, AdminProductModal, AdminCSVImportModal, AdminSetupGuidePage
```

---

## 🚀 Beginner-Friendly Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**.
3. Choose a project name: `jain-vastar-bhandar`.
4. Enter a strong database password and select region (e.g., `Central India / Mumbai`).
5. Click **"Create new project"** and wait ~2 minutes.

---

### 2. Apply the Database Schema & Security Policies (RLS)

1. In your Supabase Dashboard, open the **SQL Editor** tab on the left sidebar.
2. Click **"New Query"**.
3. Open the file `supabase/schema.sql` from this repository, copy all the SQL code, and paste it into the query box.
4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`).

> **What this does:**
> - Creates the `products`, `product_images`, and `admin_users` tables.
> - Adds constraints (prices and stock must be non-negative).
> - Creates the public storage bucket `product-images`.
> - Enables **Row Level Security (RLS)**: Public visitors can ONLY view published suits; only authorized administrators can add, update, archive, or delete products.

---

### 3. Create Your Administrator Login

1. In Supabase Dashboard, go to **Authentication > Users**.
2. Click **"Add user" > "Create user"**.
3. Enter your email (e.g. `admin@jainvastarbhandar.com`) and choose a strong password.
4. Click **"Create User"**.
5. *(Recommended Security Step)*: Go to **Authentication > Providers > Email** and turn **OFF "Allow new users to sign up"**. This guarantees that no outsider can ever register an admin account.

---

### 4. Configure Local Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In your Supabase Dashboard, go to **Project Settings > API**.
3. Copy **Project URL** and paste it into `VITE_SUPABASE_URL`.
4. Copy the **anon public key** and paste it into `VITE_SUPABASE_ANON_KEY`.

Example `.env`:
```ini
VITE_SUPABASE_URL=https://your-ref-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...
```

---

### 5. Run Locally

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the storefront, and `http://localhost:5173/admin` to sign in to the management dashboard.

---

### 6. Deploying to Netlify (Step-by-Step)

1. Initialize git and push the repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Production release for Jain Vastar Bhandar"
   git branch -M main
   git remote add origin https://github.com/your-username/jain-vastar-bhandar.git
   git push -u origin main
   ```
2. Go to [Netlify](https://app.netlify.com) and log in.
3. Click **"Add new site" > "Import an existing project"**.
4. Choose **GitHub** and select your `jain-vastar-bhandar` repository.
5. Netlify will configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Add environment variables"** and add:
   - `VITE_SUPABASE_URL`: (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY`: (your Supabase anon key)
7. Click **"Deploy jain-vastar-bhandar"**.

Netlify will build and deploy your site in ~1 minute. Because `public/_redirects` and `netlify.toml` are included, direct URLs (e.g. `/collection`, `/product/:slug`, `/admin`) reload smoothly without 404s.

---

### 7. Adding a Custom Domain

1. In your Netlify dashboard, go to **Site configuration > Domain management**.
2. Click **"Add a domain"** and enter your domain name (e.g., `jainvastarbhandar.com`).
3. Follow the DNS instructions (pointing A Record or CNAME to Netlify).
4. Netlify will automatically provision a free SSL/TLS certificate (HTTPS).

---

## 📦 Managing Inventory After Deployment

Once the site is deployed, **you do not need to edit code or redeploy to update your catalog**.

Log in to `your-site.netlify.app/admin` using your admin credentials to:
- **Add Suits:** Upload up to 5 photos per suit, set price, sale price, fabric type (Pure Cotton, Chanderi Silk, Georgette, etc.), and measurements.
- **Update Stock & Prices:** Click `+` or `-` to adjust live stock quantity instantly.
- **Publish / Unpublish:** Toggle visibility with one click.
- **Bulk Import (100–200 suits):** Click **"Import CSV"** to upload an Excel/Sheets spreadsheet using the provided template (`/templates/jvb_product_import_blank_template.csv`).
- **Export Catalog:** Click **"Export"** to download your complete live inventory as a backup CSV file.

---

## 🔒 Security Architecture

- **No Secrets in Frontend:** Only the Supabase `anon` public key is used in client code. The privileged `service_role` key is **never** committed or exposed.
- **PostgreSQL Row Level Security (RLS):** Permissions are enforced on the database level:
  - Public visitors can only run `SELECT` on products where `status = 'published'`.
  - Only users authenticated as administrators can run `INSERT`, `UPDATE`, or `DELETE`.
- **Closed Signups:** Public user registration is disabled in Supabase Auth to prevent unauthorized administrator creation.
- **Client Fallback:** If Supabase environment variables are missing, the website displays an informative setup prompt instead of crashing with a blank screen.

---

## 📋 Verification & Testing Checklist

- [x] TypeScript compiles cleanly with zero errors (`npm run build`).
- [x] Mobile-first, fully responsive design tested across breakpoints.
- [x] Business name spelled strictly as **Jain Vastar Bhandar** (JVB).
- [x] Specialization strictly limited to **unstitched ladies' suits**.
- [x] WhatsApp ordering button links to **7015344280** with prefilled suit details.
- [x] Phone numbers **9416950256** and **7015344280** are clickable (`tel:`).
- [x] Physical address displayed: **Railway Road, Gharaunda, Karnal, Haryana – 132114**.
- [x] Instagram links to **https://www.instagram.com/jainvasterbhandar?exln=ZjU0a3Jwam43bmdo** (@jainvasterbhandar).
- [x] Private admin dashboard available at `/admin` with protected routes.
- [x] Multi-photo uploads, validation, stock tracking, and bulk CSV import implemented.
- [x] Netlify deployment configured with SPA redirects.

---

© 1977 – 2026 Jain Vastar Bhandar. All rights reserved.
