/**
 * Testimonials data. The <Testimonials> component renders NOTHING when this
 * array is empty (empty-state-capable) — it never fabricates entries.
 *
 * PLACEHOLDER — REPLACE: the entries below are fake and marked. Either delete
 * them (the section disappears) or replace with real, permissioned quotes.
 */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  logo?: string; // /public path or remote URL
  quote: string;
  quoteAr: string;
  metric?: string; // e.g. "+38% CTR"
  placeholder?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 'ph-1',
    name: 'PLACEHOLDER — REPLACE',
    role: 'Founder',
    company: 'Sample D2C Brand',
    quote: 'Replace this with a real, permissioned client quote before launch.',
    quoteAr: 'استبدل هذا باقتباس عميل حقيقي ومصرّح به قبل الإطلاق.',
    metric: '+00% metric',
    placeholder: true
  }
];

/** Toggle to simulate the empty state locally. When empty → section renders nothing. */
export const testimonialsToShow: Testimonial[] = testimonials.filter((t) => !t.placeholder);
