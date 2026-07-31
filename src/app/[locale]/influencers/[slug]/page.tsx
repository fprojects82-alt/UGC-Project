import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link, routing } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, PlaceholderBadge } from '@/components/ui/primitives';
import { influencerShowcase } from '@/data/site';
import { Sparkles } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    influencerShowcase.map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function InfluencerProfilePage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const p = influencerShowcase.find((x) => x.slug === slug);
  if (!p) notFound();
  const ar = locale === 'ar';
  const t = await getTranslations('influencerProfile');

  const grid = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${slug}${i}/500/500`);

  return (
    <>
      <PageHeader eyebrow={t('aiDisclosure')} title={p.name} subtitle={ar ? p.nicheAr : p.niche} />
      <div className="container grid gap-10 py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image src={p.avatar} alt={p.name} fill sizes="400px" className="object-cover" priority />
            {p.placeholder && <PlaceholderBadge className="absolute left-2 top-2" />}
          </div>
          <Card className="mt-4 space-y-3 p-5 text-sm">
            <Row label={t('niche')} value={ar ? p.nicheAr : p.niche} />
            <Row label={t('platform')} value={p.platform} />
            <Row label={t('followers')} value={p.followers} />
          </Card>
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent/10 px-3 py-2 text-xs text-accent">
            <Sparkles className="h-4 w-4" /> {t('aiDisclosure')}
          </div>
        </aside>

        <div>
          <h2 className="font-display text-2xl font-bold">{t('content')}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {grid.map((g, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={g} alt="" fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>

          <Card className="mt-10 p-6">
            <h3 className="font-display text-xl font-bold">{t('partnership')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('partnershipBody')}</p>
            <Link href="/contact" className="mt-5 inline-block">
              <Button>{t('partnership')}</Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
