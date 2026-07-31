import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { services } from '@/data/site';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'servicesPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('servicesPage');
  const s = await getTranslations('services');

  return (
    <>
      <PageHeader eyebrow="Sana Studio" title={t('title')} subtitle={t('subtitle')} />
      <div className="container grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ key, slug, sample }) => (
          <Link key={slug} href={`/services/${slug}`} className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50">
            <div className="relative h-44">
              <Image src={sample} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold">{s(`items.${key}.name`)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s(`items.${key}.summary`)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {s('learnMore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
