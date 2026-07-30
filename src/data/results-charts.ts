/**
 * SINGLE SOURCE OF TRUTH for the Results section charts (Home §6).
 * Edit values here — every Recharts component reads from this object.
 * Each chart also renders a visible source/methodology caption (i18n keys in
 * messages/*.json → results.*.caption). Replace illustrative numbers with real
 * measured data before launch.
 *
 * PLACEHOLDER — REPLACE: values below are illustrative benchmarks.
 */

export interface CostPoint {
  key: string;
  labelEn: string;
  labelAr: string;
  traditional: number; // USD per finished asset
  sana: number;
}

export interface TurnaroundPoint {
  key: string;
  labelEn: string;
  labelAr: string;
  traditional: number; // business days
  sana: number;
}

export interface EngagementPoint {
  key: string;
  labelEn: string;
  labelAr: string;
  before: number; // engagement rate %
  after: number;
}

export const costPerAsset: CostPoint[] = [
  { key: 'product', labelEn: 'Product shot', labelAr: 'صورة منتج', traditional: 320, sana: 42 },
  { key: 'lifestyle', labelEn: 'Lifestyle', labelAr: 'مشهد حياتي', traditional: 480, sana: 55 },
  { key: 'carousel', labelEn: 'Carousel (6)', labelAr: 'كاروسيل (6)', traditional: 900, sana: 180 },
  { key: 'character', labelEn: 'Character set', labelAr: 'مجموعة شخصية', traditional: 1500, sana: 260 }
];

export const turnaround: TurnaroundPoint[] = [
  { key: 'concept', labelEn: 'Concept', labelAr: 'الفكرة', traditional: 5, sana: 1 },
  { key: 'production', labelEn: 'Production', labelAr: 'الإنتاج', traditional: 14, sana: 3 },
  { key: 'revision', labelEn: 'Revision', labelAr: 'التعديل', traditional: 7, sana: 1 }
];

export const engagementLift: EngagementPoint[] = [
  { key: 'ig', labelEn: 'Instagram', labelAr: 'إنستغرام', before: 1.8, after: 3.6 },
  { key: 'tiktok', labelEn: 'TikTok', labelAr: 'تيك توك', before: 2.4, after: 5.1 },
  { key: 'x', labelEn: 'X', labelAr: 'إكس', before: 0.9, after: 1.7 }
];
