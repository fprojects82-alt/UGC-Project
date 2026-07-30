import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { services } from '@/data/site';
import { ArrowRight } from 'lucide-react';

export function ServicesGrid() {
  const t = useTranslations('services');

  return (
    <Section id="services" className="bg-card/20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ key, slug, sample }) => (
          <Link
            key={key}
            href={`/services/${slug}`}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
          >
            {/* Sample output revealed on hover (CSS-only, no JS). */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={sample}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 to-accent/10 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
                {t('hoverHint')}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold">{t(`items.${key}.name`)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(`items.${key}.summary`)}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {t('learnMore')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
