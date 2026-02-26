# BeatStore 🎵

A full-stack beat store built with **Next.js 14**, **Stripe**, and **Supabase**. Sell beats with tiered licensing, instant file delivery, and a slick dark UI.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Zustand (cart, persisted to localStorage) |
| Audio | Howler.js (preview player) |
| Payments | Stripe Checkout |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (signed URLs for delivery) |
| Hosting | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- **Supabase**: Go to [supabase.com](https://supabase.com) → New Project → Settings → API
- **Stripe**: Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys

### 3. Set up the database

Copy the contents of `supabase-schema.sql` and run it in your Supabase project:
**SQL Editor → New Query → Paste → Run**

### 4. Set up Supabase Storage

1. Go to **Storage** in your Supabase dashboard
2. Create a **private bucket** named `beats`
3. Create a **public bucket** named `previews` (for watermarked previews)

Upload structure:
```
beats/
  {beat-id}/
    mp3_lease.mp3
    wav_lease.wav
    trackout.zip
    exclusive.zip

previews/
  {beat-id}/
    preview.mp3      ← watermarked, public
```

### 5. Set up Stripe Webhook (local dev)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
beatstore/
├── app/
│   ├── api/
│   │   ├── beats/          # GET beats with filters
│   │   ├── checkout/       # POST create Stripe session
│   │   ├── orders/         # GET order by session ID
│   │   └── webhooks/       # Stripe webhook handler
│   ├── cart/               # Cart page
│   ├── success/            # Post-payment page with downloads
│   ├── layout.tsx
│   └── page.tsx            # Home / catalog
├── components/
│   ├── store/
│   │   ├── BeatCatalog.tsx # Filtered beat grid
│   │   └── BeatCard.tsx    # Beat card + audio preview
│   └── ui/
│       ├── Navbar.tsx
│       └── Hero.tsx
├── lib/
│   ├── cart-store.ts       # Zustand cart
│   ├── licenses.ts         # License definitions & pricing
│   ├── stripe.ts           # Stripe helpers
│   ├── supabase.ts         # Supabase clients
│   └── utils.ts
├── types/
│   └── index.ts            # All TypeScript types
└── supabase-schema.sql     # DB schema — run this first
```

---

## License Tiers

| License | Price | Streams | Sales | Exclusive? |
|---|---|---|---|---|
| MP3 Lease | $29.99 | 100K | 2,500 | No |
| WAV Lease | $49.99 | 500K | 5,000 | No |
| Trackout Stems | $99.99 | Unlimited | Unlimited | No |
| Exclusive Rights | $499.00 | Unlimited | Unlimited | ✅ Yes |

Prices are defined in `lib/licenses.ts` — edit them freely.

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

For the Stripe webhook in production:
1. Go to Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/webhooks`
3. Events to listen for: `checkout.session.completed`, `checkout.session.expired`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Next Steps

- [ ] Add individual beat pages (`/beats/[slug]`)
- [ ] Add producer dashboard for uploading beats
- [ ] Add order history page for customers
- [ ] Add email delivery with Resend or SendGrid
- [ ] Add beat preview watermarking pipeline (FFmpeg)
- [ ] Add analytics (plays, conversions)
