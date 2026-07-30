/** Static site data: services, influencer showcase, pricing structure. */

export const SERVICE_KEYS = [
  'characters',
  'product',
  'influencers',
  'ambassadors',
  'carousels'
] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

/** slug → i18n key mapping for service detail routes (Phase 2). */
export const services: { key: ServiceKey; slug: string; sample: string }[] = [
  { key: 'characters', slug: 'ai-characters', sample: 'https://picsum.photos/seed/char/640/800' },
  { key: 'product', slug: 'product-imagery', sample: 'https://picsum.photos/seed/prod/640/800' },
  { key: 'influencers', slug: 'ai-influencers', sample: 'https://picsum.photos/seed/infl/640/800' },
  { key: 'ambassadors', slug: 'brand-ambassadors', sample: 'https://picsum.photos/seed/amb/640/800' },
  { key: 'carousels', slug: 'carousel-packs', sample: 'https://picsum.photos/seed/caro/640/800' }
];

/**
 * AI influencer showcase.
 * PLACEHOLDER — REPLACE: personas, niches and follower counts are illustrative.
 */
export interface InfluencerCard {
  slug: string;
  name: string;
  niche: string;
  nicheAr: string;
  platform: string;
  followers: string;
  avatar: string;
  placeholder?: boolean;
}

export const influencerShowcase: InfluencerCard[] = [
  { slug: 'layla', name: 'Layla', niche: 'Beauty & skincare', nicheAr: 'الجمال والعناية', platform: 'Instagram', followers: '128K', avatar: 'https://picsum.photos/seed/layla/400/500', placeholder: true },
  { slug: 'omar', name: 'Omar', niche: 'Fitness & supplements', nicheAr: 'اللياقة والمكملات', platform: 'TikTok', followers: '94K', avatar: 'https://picsum.photos/seed/omar/400/500', placeholder: true },
  { slug: 'noor', name: 'Noor', niche: 'Home & lifestyle', nicheAr: 'المنزل ونمط الحياة', platform: 'Instagram', followers: '61K', avatar: 'https://picsum.photos/seed/noor/400/500', placeholder: true },
  { slug: 'ziad', name: 'Ziad', niche: 'Tech & gadgets', nicheAr: 'التقنية والأجهزة', platform: 'X', followers: '47K', avatar: 'https://picsum.photos/seed/ziad/400/500', placeholder: true }
];

/** Pricing structure. Amounts in USD. Edit here. */
export const PRICING_TIERS = ['starter', 'growth', 'scale', 'custom'] as const;
export type PricingTierKey = (typeof PRICING_TIERS)[number];

export const pricing: Record<
  PricingTierKey,
  { monthly: number | null; perPack: number | null; popular?: boolean; custom?: boolean }
> = {
  starter: { monthly: 490, perPack: 390 },
  growth: { monthly: 1490, perPack: null, popular: true },
  scale: { monthly: 3900, perPack: null },
  custom: { monthly: null, perPack: null, custom: true }
};

/** Hero background masonry — replace with real sample renders in /public/samples. */
export const heroSamples: string[] = Array.from({ length: 12 }, (_, i) =>
  `https://picsum.photos/seed/sana${i}/400/${i % 2 ? 560 : 460}`
);
