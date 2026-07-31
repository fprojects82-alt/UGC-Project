import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { IntakeForm } from '@/components/intake-form';
import { BookingWidget } from '@/components/booking-widget';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <>
      <PageHeader eyebrow="APEXSCALE" title={t('title')} subtitle={t('subtitle')} />
      <div className="container grid gap-8 py-16 lg:grid-cols-[1.3fr_1fr]">
        <IntakeForm />
        <div>
          <h2 className="mb-6 font-display text-xl font-bold">{t('bookTitle')}</h2>
          <BookingWidget />
        </div>
      </div>
    </>
  );
}
