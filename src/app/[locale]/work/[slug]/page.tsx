import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link, routing } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlaceholderBadge } from '@/components/ui/primitives';
import { allCaseStudies } from '@/data/case-studies';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allCaseStudies.map((c) => ({ locale, slug: c.slug }))
  );
}

export default async function CaseStudyPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const c = allCaseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  const ar = locale === 'ar';
  const t = await getTranslations('work');

  const blocks = [
    { title: t('challenge'), body: ar ? c.challengeAr : c.challengeEn },
    { title: t('approach'), body: ar ? c.approachAr : c.approachEn },
    { title: t('result'), body: ar ? c.resultAr : c.resultEn }
  ];

  return (
    <>
      <PageHeader eyebrow={c.client} title={ar ? c.titleAr : c.title} subtitle={c.metric} />
      <div className="container max-w-3xl py-16">
        {c.placeholder && <PlaceholderBadge className="mb-6" />}
        <div className="relative mb-10 aspect-[3/2] overflow-hidden rounded-lg">
          <Image src={c.cover} alt={c.client} fill sizes="768px" className="object-cover" priority />
        </div>
        {blocks.map((b) => (
          <section key={b.title} className="mb-10">
            <h2 className="mb-3 font-display text-2xl font-bold">{b.title}</h2>
            <p className="text-muted-foreground">{b.body}</p>
          </section>
        ))}
        <div className="grid grid-cols-3 gap-3">
          {c.gallery.map((g, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image src={g} alt="" fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
        <Link href="/contact" className="mt-12 inline-block">
          <Button size="lg">{t('readCase')}</Button>
        </Link>
      </div>
    </>
  );
}
