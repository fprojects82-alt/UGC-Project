import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { PlaceholderBadge, Card } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { serviceDetails } from '@/data/services-detail';
import { Check } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(serviceDetails).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const svc = serviceDetails[params.slug];
  if (!svc) return {};
  const s = await getTranslations({ locale: params.locale, namespace: 'services' });
  return { title: s(`items.${svc.key}.name`), description: s(`items.${svc.key}.summary`) };
}

export default async function ServiceDetailPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const svc = serviceDetails[slug];
  if (!svc) notFound();
  const ar = locale === 'ar';
  const t = await getTranslations('servicesPage');
  const s = await getTranslations('services');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s(`items.${svc.key}.name`),
    description: s(`items.${svc.key}.summary`),
    provider: { '@type': 'Organization', name: 'APEXSCALE' },
    areaServed: 'MENA'
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow={t('title')} title={s(`items.${svc.key}.name`)} subtitle={s(`items.${svc.key}.summary`)} />

      <div className="container grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <Block title={t('problem')}>
            <p className="text-muted-foreground">{ar ? svc.problemAr : svc.problemEn}</p>
          </Block>

          <Block title={t('whatYouGet')}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(ar ? svc.getAr : svc.getEn).map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title={t('process')}>
            <ol className="grid gap-4 sm:grid-cols-4">
              {(['brief', 'concept', 'production', 'delivery'] as const).map((step, i) => (
                <li key={step} className="rounded-lg border border-border p-4">
                  <div className="text-xs font-semibold text-accent">0{i + 1}</div>
                  <div className="mt-1 text-sm font-medium capitalize">{step}</div>
                </li>
              ))}
            </ol>
          </Block>

          <Block title={t('specs')}>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(ar ? svc.specsAr : svc.specsEn).map((sp) => <li key={sp}>• {sp}</li>)}
            </ul>
          </Block>

          <Block title={t('samples')}>
            <div className="relative">
              <PlaceholderBadge className="absolute -top-2 start-0 z-10" />
              <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                {svc.gallery.map((g, i) => (
                  <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image src={g} alt="" fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </Block>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">{t('pricingCta')}</div>
            <div className="mt-1 font-display text-3xl font-bold">
              {ar ? 'من' : 'From'} ${svc.priceFrom}
            </div>
            <Link href="/contact" className="mt-6 block">
              <Button className="w-full">{t('cta')}</Button>
            </Link>
            <Link href="/pricing" className="mt-3 block text-center text-sm text-primary hover:underline">
              {t('pricingCta')}
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
