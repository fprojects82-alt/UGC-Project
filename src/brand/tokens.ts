/**
 * Single source of truth for brand tokens (mirrored as CSS vars in globals.css).
 * Swap these when the real brand kit from "Prompt 1" is supplied.
 */
export const brand = {
  name: 'APEXSCALE',
  nameAr: 'APEXSCALE',
  domain: 'apexscale.ai',
  social: {
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    linkedin: 'https://linkedin.com/',
    x: 'https://x.com/'
  },
  colors: {
    primary: '252 83% 60%',
    accent: '38 78% 60%',
    background: '240 24% 6%',
    foreground: '240 20% 96%'
  }
} as const;

export type Brand = typeof brand;
