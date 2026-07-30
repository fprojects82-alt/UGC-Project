'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { FileText, CheckCircle2, Wand2, Send } from 'lucide-react';

const steps = [
  { key: 'brief', Icon: FileText },
  { key: 'concept', Icon: CheckCircle2 },
  { key: 'production', Icon: Wand2 },
  { key: 'delivery', Icon: Send }
] as const;

export function HowItWorks() {
  const t = useTranslations('how');

  return (
    <Section>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <LazyMotion features={domAnimation}>
        <ol className="relative grid gap-8 md:grid-cols-4">
          {/* connector line (horizontal desktop / vertical mobile handled by border) */}
          {steps.map(({ key, Icon }, i) => (
            <m.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex gap-4 md:flex-col md:gap-0"
            >
              <div className="flex flex-col items-center md:mb-5 md:flex-row md:items-center md:gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                {i < steps.length - 1 && (
                  <span className="mt-2 h-full w-px flex-1 bg-border md:mt-0 md:h-px md:w-full" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">
                  0{i + 1}
                </div>
                <h3 className="mt-1 text-lg font-semibold">{t(`steps.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(`steps.${key}.body`)}</p>
              </div>
            </m.li>
          ))}
        </ol>
      </LazyMotion>
    </Section>
  );
}
