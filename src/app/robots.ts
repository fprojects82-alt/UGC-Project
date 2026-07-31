import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/admin', '/api'] },
    sitemap: 'https://apexscale.ai/sitemap.xml'
  };
}
