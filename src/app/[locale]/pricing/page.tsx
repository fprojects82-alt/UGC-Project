import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Pricing } from '@/components/home/pricing';
import { Faq } from '@/components/home/faq';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'pricing' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  return (
    <>
      <PageHeader eyebrow="APEXSCALE" title={t('title')} subtitle={t('subtitle')} />
      <Pricing />
      <Faq />
    </>
  );
}
