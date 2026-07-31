import type { ServiceKey } from './site';

/**
 * Per-service detail content (Phase 2 service pages).
 * Copy is real marketing content; sample gallery images are PLACEHOLDER.
 */
export interface ServiceDetail {
  key: ServiceKey;
  slug: string;
  problemEn: string;
  problemAr: string;
  getEn: string[];
  getAr: string[];
  specsEn: string[];
  specsAr: string[];
  gallery: string[];
  priceFrom: number;
}

export const serviceDetails: Record<string, ServiceDetail> = {
  'ai-characters': {
    key: 'characters',
    slug: 'ai-characters',
    problemEn: 'Consistent faces are expensive to reshoot and impossible to scale with real talent.',
    problemAr: 'الوجوه الثابتة مكلفة لإعادة تصويرها ويصعب توسيعها بمواهب حقيقية.',
    getEn: ['A locked, reusable AI persona', 'On-brand styling system', 'Carousel-ready sets', 'Same face across every format'],
    getAr: ['شخصية افتراضية ثابتة وقابلة لإعادة الاستخدام', 'نظام تنسيق متوافق مع العلامة', 'مجموعات جاهزة للكاروسيل', 'الوجه نفسه في كل صيغة'],
    specsEn: ['4:5 & 1:1, up to 2048px', 'PNG/JPG', 'Locked reference set included'],
    specsAr: ['4:5 و1:1 حتى 2048 بكسل', 'PNG/JPG', 'مجموعة مرجعية ثابتة مضمّنة'],
    gallery: ['char1', 'char2', 'char3', 'char4'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    priceFrom: 260
  },
  'product-imagery': {
    key: 'product',
    slug: 'product-imagery',
    problemEn: 'Studio product shoots cost thousands per day and take weeks to book.',
    problemAr: 'تصوير المنتجات في الاستوديو يكلّف آلافاً يومياً ويستغرق أسابيع.',
    getEn: ['Studio-grade product shots', 'Lifestyle & in-context scenes', 'Unlimited backgrounds', 'Fast reshoots'],
    getAr: ['صور منتجات بجودة استوديو', 'مشاهد حياتية وسياقية', 'خلفيات غير محدودة', 'إعادة تصوير سريعة'],
    specsEn: ['Up to 4096px', 'Transparent PNG on request', 'Print & web variants'],
    specsAr: ['حتى 4096 بكسل', 'PNG شفاف عند الطلب', 'نسخ للطباعة والويب'],
    gallery: ['prod1', 'prod2', 'prod3', 'prod4'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    priceFrom: 42
  },
  'ai-influencers': {
    key: 'influencers',
    slug: 'ai-influencers',
    problemEn: 'Real influencer deals are costly, inconsistent, and hard to control.',
    problemAr: 'صفقات المؤثرين الحقيقيين مكلفة وغير ثابتة ويصعب التحكم بها.',
    getEn: ['A dedicated AI influencer for one product', 'Its own social page', 'Ongoing content calendar', 'Full likeness governance'],
    getAr: ['مؤثر افتراضي مخصص لمنتج واحد', 'صفحته الاجتماعية الخاصة', 'روزنامة محتوى مستمرة', 'حوكمة كاملة للشبه'],
    specsEn: ['Persona kit + page setup', 'Monthly content drops', 'AI disclosure included'],
    specsAr: ['حزمة شخصية + إعداد صفحة', 'دفعات محتوى شهرية', 'إفصاح ذكاء اصطناعي مضمّن'],
    gallery: ['infl1', 'infl2', 'infl3', 'infl4'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    priceFrom: 3900
  },
  'brand-ambassadors': {
    key: 'ambassadors',
    slug: 'brand-ambassadors',
    problemEn: 'Brands want a recognizable face without long-term talent contracts.',
    problemAr: 'تريد العلامات وجهاً معروفاً دون عقود مواهب طويلة.',
    getEn: ['A recurring brand face', 'Campaign-ready variations', 'Cross-channel consistency'],
    getAr: ['وجه علامة متكرر', 'تنويعات جاهزة للحملات', 'اتساق عبر القنوات'],
    specsEn: ['All standard ratios', 'Campaign kit', 'Usage license on payment'],
    specsAr: ['كل النسب القياسية', 'حزمة حملة', 'ترخيص استخدام عند السداد'],
    gallery: ['amb1', 'amb2', 'amb3', 'amb4'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    priceFrom: 1200
  },
  'carousel-packs': {
    key: 'carousels',
    slug: 'carousel-packs',
    problemEn: 'Great carousels need scripting, design, and consistency most teams lack.',
    problemAr: 'الكاروسيل الجيد يحتاج كتابة وتصميماً واتساقاً يفتقده معظم الفرق.',
    getEn: ['Scripted multi-slide stories', 'Designed to convert', 'Bilingual copy', 'Ready to post'],
    getAr: ['قصص متعددة الشرائح مكتوبة', 'مصممة للتحويل', 'نص ثنائي اللغة', 'جاهزة للنشر'],
    specsEn: ['6–10 slides', '4:5 & 1:1', 'Editable copy deck'],
    specsAr: ['6–10 شرائح', '4:5 و1:1', 'ملف نصوص قابل للتعديل'],
    gallery: ['caro1', 'caro2', 'caro3', 'caro4'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    priceFrom: 180
  }
};
