'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Section, SectionHeader, Card } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { pricing, PRICING_TIERS } from '@/data/site';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pricing() {
  const t = useTranslations('pricing');
  const [monthly, setMonthly] = useState(true);

  return (
    <Section id="pricing" className="bg-card/20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
          <button
            onClick={() => setMonthly(true)}
            className={cn('rounded-full px-4 py-1.5 transition-colors', monthly && 'bg-primary text-primary-foreground')}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setMonthly(false)}
            className={cn('rounded-full px-4 py-1.5 transition-colors', !monthly && 'bg-primary text-primary-foreground')}
          >
            {t('perPack')}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {PRICING_TIERS.map((key) => {
          const tier = pricing[key];
          const features = t.raw(`tiers.${key}.features`) as string[];
          const amount = monthly ? tier.monthly : tier.perPack;
          const unit = monthly ? t('perMonth') : t('perPackUnit');

          return (
            <Card
              key={key}
              className={cn('relative flex flex-col p-6', tier.popular && 'border-primary shadow-lg shadow-primary/10')}
            >
              {tier.popular && (
                <span className="absolute -top-3 start-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {t('popular')}
                </span>
              )}
              <h3 className="text-lg font-semibold">{t(`tiers.${key}.name`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`tiers.${key}.tagline`)}</p>
              <div className="mt-5 min-h-[3rem]">
                {tier.custom ? (
                  <span className="font-display text-2xl font-bold">—</span>
                ) : amount == null ? (
                  <span className="text-sm text-muted-foreground">{t('customCta')}</span>
                ) : (
                  <span className="font-display text-3xl font-bold">
                    ${amount}
                    <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                  </span>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="mt-6">
                <Button className="w-full" variant={tier.popular ? 'primary' : 'outline'}>
                  {tier.custom ? t('customCta') : t('cta')}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
