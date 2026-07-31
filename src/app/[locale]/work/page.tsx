import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/primitives';
import { caseStudies } from '@/data/case-studies';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'work' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function WorkPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('work');
  const ar = locale === 'ar';

  return (
    <>
      <PageHeader eyebrow="APEXSCALE" title={t('title')} subtitle={t('subtitle')} />
      <div className="container py-16">
        {caseStudies.length === 0 ? (
          // Empty-state: no fabricated case studies.
          <Card className="mx-auto max-w-xl p-10 text-center">
            <p className="text-muted-foreground">{t('emptyState')}</p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button>{t('readCase')}</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((c) => (
              <Link key={c.slug} href={`/work/${c.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-[3/2]">
                  <Image src={c.cover} alt={c.client} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="text-sm text-accent">{c.metric}</div>
                  <h2 className="mt-1 text-lg font-semibold">{ar ? c.titleAr : c.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{c.client}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
