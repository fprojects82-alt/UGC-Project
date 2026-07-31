import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/primitives';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const values = t.raw('values') as { t: string; d: string }[];

  return (
    <>
      <PageHeader eyebrow="APEXSCALE" title={t('title')} subtitle={t('subtitle')} />
      <div className="container max-w-3xl py-16">
        <h2 className="font-display text-2xl font-bold">{t('missionTitle')}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('mission')}</p>

        <h2 className="mt-14 font-display text-2xl font-bold">{t('valuesTitle')}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <Card key={v.t} className="p-6">
              <h3 className="font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
