import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBadge } from '@/components/ui/primitives';
import { influencerShowcase } from '@/data/site';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'influencers' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function InfluencersPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('influencers');
  const ar = locale === 'ar';

  return (
    <>
      <PageHeader eyebrow="APEXSCALE" title={t('title')} subtitle={t('subtitle')} />
      <div className="container grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {influencerShowcase.map((p) => (
          <Link key={p.slug} href={`/influencers/${p.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[4/5]">
              <Image src={p.avatar} alt={p.name} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              {p.placeholder && <PlaceholderBadge className="absolute left-2 top-2" />}
            </div>
            <div className="p-4">
              <p className="font-display text-lg font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{ar ? p.nicheAr : p.niche}</p>
              <p className="mt-1 text-xs text-accent">{p.platform} · {p.followers} {t('followers')}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
