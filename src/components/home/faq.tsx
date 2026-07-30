'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeader title={t('title')} />
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-lg border border-border">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <h3>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-medium"
                >
                  {item.q}
                  <ChevronDown className={cn('h-5 w-5 shrink-0 transition-transform', isOpen && 'rotate-180')} />
                </button>
              </h3>
              <div
                className={cn(
                  'grid overflow-hidden transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="min-h-0">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
