# Sana Studio — AI Content Marketing Agency

Public website **+** internal operations platform for an AI-content marketing
agency serving the Middle East. Bilingual (Arabic / English) with full RTL
mirroring, mobile-first, built to extend from static imagery today to video
later without a rebuild.

> **Branding note:** the "Prompt 1" brand kit was not supplied to this build, so
> a coherent placeholder brand ("Sana Studio") was invented per the instruction
> to pick one. Everything brand-related is centralized in `src/brand/` +
> `src/app/globals.css` for a one-file swap. See `src/brand/brand.md`.

## Stack

| Concern      | Choice                                    |
| ------------ | ----------------------------------------- |
| Framework    | Next.js 14 (App Router) + TypeScript      |
| Styling      | Tailwind CSS (shadcn/ui-style primitives) |
| Animation    | Framer Motion (`LazyMotion`)              |
| i18n / RTL   | next-intl (`en`, `ar`, `localePrefix: always`) |
| Charts       | Recharts                                  |
| Backend      | Supabase (Auth, Postgres, Storage)        |
| Booking      | Cal.com / Calendly embed                  |
| Deploy       | Vercel                                    |

> **shadcn/ui note:** rather than pull the full generator, the handful of
> primitives needed for Phase 1 (`Button`, `Card`, `Badge`, `Section`) are
> written in shadcn's exact idiom (`cva` + `cn`) under `src/components/ui`. Add
> the real CLI later with zero refactor.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + booking URL
npm run dev                  # http://localhost:3000 → redirects to /en
```

Type-check / lint:

```bash
npm run typecheck && npm run lint && npm run build
```

## Database

SQL migrations live in `supabase/migrations/`:

- `0001_schema.sql` — all tables, enums, the 8-state pipeline, status-event
  audit, `influencer_availability` view, signup + `updated_at` triggers.
- `0002_rls.sql` — **row-level security** (clients read only their own rows,
  creators only their assigned jobs, staff scoped, admin full) + a **private**
  storage bucket served exclusively through signed, expiring URLs.
- `0003_seed.sql` — the extensible service catalog.

Apply with the Supabase CLI (`supabase db push`) or the SQL editor.

## Status pipeline

`New → Brief Confirmed → In Production → Internal QA → Client Review → Revision → Delivered → Closed`
Every transition is written to `status_events` (timestamp + `changed_by`).

## File tree (current)

```
src/
├─ app/
│  ├─ globals.css                 # brand tokens (CSS vars) + RTL/reduced-motion
│  ├─ robots.ts  ·  sitemap.ts    # SEO
│  └─ [locale]/
│     ├─ layout.tsx               # <html dir> shell, fonts, nav/footer, JSON-LD
│     └─ page.tsx                 # Home — all 12 sections
├─ brand/                         # tokens.ts + brand.md  (single source of truth)
├─ components/
│  ├─ ui/                         # button, primitives (Card/Badge/Section)
│  ├─ layout/                     # navbar, footer, language-switcher
│  ├─ charts/result-charts.tsx    # RTL-aware Recharts (reads data/results-charts)
│  ├─ home/                       # hero, trust-bar, problem, services-grid,
│  │                              #   how-it-works, results, influencer-showcase,
│  │                              #   testimonials, pricing, faq, final-cta
│  └─ booking-widget.tsx          # embedded Cal.com/Calendly
├─ data/
│  ├─ results-charts.ts           # ← EDIT charts in ONE place
│  ├─ testimonials.ts             # empty-state-capable, PLACEHOLDER marked
│  └─ site.ts                     # services, influencers, pricing, hero samples
├─ i18n/  ·  messages/{en,ar}.json
├─ lib/supabase/{client,server}.ts
└─ middleware.ts                  # locale routing
supabase/migrations/              # 0001 schema · 0002 RLS · 0003 seed
```

## Build order

- [x] **Phase 1** — Home page, responsive, bilingual, placeholder content marked. **← current**
- [ ] Phase 2 — Remaining public pages + intake form → Supabase + notification
- [ ] Phase 3 — Auth, roles, client dashboard
- [ ] Phase 4 — Creator dashboard + job pipeline
- [ ] Phase 5 — Admin dashboard + influencer library

The **full data model + RLS (0001–0003)** is shipped now so Phases 2–5 build on
a stable schema.

## Non-functional coverage (Phase 1)

- **RTL**: `dir` on `<html>`, logical CSS properties, mirrored icons
  (`rtl:rotate-180`), charts reverse their category axis under `ar`.
- **Arabic type**: IBM Plex Sans Arabic loaded first-class at all weights.
- **Perf**: `next/image` everywhere, `priority` only on above-the-fold tiles,
  `LazyMotion`, lazy iframes.
- **A11y**: semantic landmarks, skip link, keyboard-navigable nav/FAQ/pricing,
  `prefers-reduced-motion` honored globally.
- **SEO**: per-locale metadata, OG, sitemap, robots, Organization JSON-LD.
