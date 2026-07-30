-- Seed the extensible service catalog (Phase 1 = static/carousel; video later).
insert into public.service_types (slug, name_en, name_ar, category, base_price, sort_order) values
  ('ai-characters',     'Recurring AI Characters',   'شخصيات افتراضية متكررة',  'static',   260, 1),
  ('product-imagery',   'Product Marketing Imagery', 'صور تسويقية للمنتجات',    'static',    42, 2),
  ('ai-influencers',    'Dedicated AI Influencers',  'مؤثرون افتراضيون مخصصون', 'static',  3900, 3),
  ('brand-ambassadors', 'AI Brand Ambassadors',      'سفراء علامة افتراضيون',   'static',  1200, 4),
  ('carousel-packs',    'Carousel Content Packs',    'باقات محتوى كاروسيل',     'carousel', 180, 5)
on conflict (slug) do nothing;

-- NOTE: no seed rows for clients/orders/influencers — those are created via the
-- app. Placeholder marketing personas live in src/data/site.ts (front-end only)
-- and are clearly marked PLACEHOLDER — REPLACE.
