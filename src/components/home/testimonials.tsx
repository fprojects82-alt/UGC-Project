'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Section, SectionHeader, Card } from '@/components/ui/primitives';
import { testimonialsToShow } from '@/data/testimonials';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/**
 * Empty-state-capable: if there are no real (non-placeholder) testimonials,
 * this renders NOTHING rather than fabricating entries.
 */
export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const [i, setI] = useState(0);

  if (testimonialsToShow.length === 0) return null;

  const item = testimonialsToShow[i];
  const move = (d: number) =>
    setI((prev) => (prev + d + testimonialsToShow.length) % testimonialsToShow.length);

  return (
    <Section>
      <SectionHeader title={t('title')} />
      <Card className="mx-auto max-w-3xl p-8 md:p-12">
        <Quote className="h-8 w-8 text-accent" />
        <blockquote className="mt-5 text-xl font-medium leading-relaxed md:text-2xl">
          “{locale === 'ar' ? item.quoteAr : item.quote}”
        </blockquote>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.role} · {item.company}
            </p>
          </div>
          {item.metric && (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
              {item.metric}
            </span>
          )}
        </div>
        {testimonialsToShow.length > 1 && (
          <div className="mt-8 flex justify-end gap-2">
            <button onClick={() => move(-1)} aria-label="Previous" className="rounded-md border border-border p-2 hover:bg-muted">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button onClick={() => move(1)} aria-label="Next" className="rounded-md border border-border p-2 hover:bg-muted">
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        )}
      </Card>
    </Section>
  );
}
