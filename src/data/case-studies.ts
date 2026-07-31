/**
 * Case studies. Empty-state-capable: the /work index renders a call-to-action
 * instead of fake entries when this array is empty.
 *
 * PLACEHOLDER — REPLACE: entries below are illustrative and marked. Remove or
 * replace with real, permissioned case studies before launch.
 */
export interface CaseStudy {
  slug: string;
  client: string;
  title: string;
  titleAr: string;
  cover: string;
  metric: string;
  challengeEn: string;
  challengeAr: string;
  approachEn: string;
  approachAr: string;
  resultEn: string;
  resultAr: string;
  gallery: string[];
  placeholder?: boolean;
}

const caseStudiesRaw: CaseStudy[] = [
  {
    slug: 'sample-skincare-launch',
    client: 'Sample Skincare Co.',
    title: 'AI character launch for a skincare line',
    titleAr: 'إطلاق شخصية افتراضية لخط عناية بالبشرة',
    cover: 'https://picsum.photos/seed/case1/1200/800',
    metric: '+00% engagement',
    challengeEn: 'PLACEHOLDER — replace with the real challenge.',
    challengeAr: 'عنصر مؤقت — استبدله بالتحدي الحقيقي.',
    approachEn: 'PLACEHOLDER — replace with the real approach.',
    approachAr: 'عنصر مؤقت — استبدله بالمقاربة الحقيقية.',
    resultEn: 'PLACEHOLDER — replace with the measured result.',
    resultAr: 'عنصر مؤقت — استبدله بالنتيجة المقاسة.',
    gallery: ['c1a', 'c1b', 'c1c'].map((s) => `https://picsum.photos/seed/${s}/600/750`),
    placeholder: true
  }
];

export const caseStudies: CaseStudy[] = caseStudiesRaw.filter((c) => !c.placeholder);
/** Kept separate so the template route can still render a marked demo in dev. */
export const allCaseStudies: CaseStudy[] = caseStudiesRaw;
