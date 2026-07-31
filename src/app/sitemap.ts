import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const base = 'https://apexscale.ai';
const paths = ['', '/services', '/work', '/influencers', '/pricing', '/about', '/contact', '/legal/privacy', '/legal/terms', '/legal/ai-disclosure'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((p) => ({
      url: `${base}/${locale}${p}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${p}`]))
      }
    }))
  );
}
