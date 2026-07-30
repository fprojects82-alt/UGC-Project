import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Section, SectionHeader, PlaceholderBadge } from '@/components/ui/primitives';
import { influencerShowcase } from '@/data/site';
import { ArrowUpRight } from 'lucide-react';

export function InfluencerShowcase() {
  const t = useTranslations('influencers');
  const locale = useLocale();

  return (
    <Section>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {influencerShowcase.map((p) => (
          <Link
            key={p.slug}
            href={`/influencers/${p.slug}`}
            className="group relative overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={p.avatar}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {p.placeholder && <PlaceholderBadge className="absolute left-2 top-2" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-bold">{p.name}</p>
                  <ArrowUpRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'ar' ? p.nicheAr : p.niche}
                </p>
                <p className="mt-1 text-xs text-accent">
                  {p.platform} · {p.followers} {t('followers')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
