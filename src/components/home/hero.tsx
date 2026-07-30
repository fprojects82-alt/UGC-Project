'use client';

import Image from 'next/image';
import { m, LazyMotion, domAnimation, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { heroSamples } from '@/data/site';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  const t = useTranslations('hero');
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Drifting masonry of AI samples behind the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-fade opacity-40">
        <LazyMotion features={domAnimation}>
          <m.div
            className="grid grid-cols-3 gap-3 p-3 sm:grid-cols-4 md:grid-cols-6"
            animate={reduce ? undefined : { y: [0, -40] }}
            transition={{ duration: 24, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          >
            {heroSamples.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                  priority={i < 4}
                />
              </div>
            ))}
          </m.div>
        </LazyMotion>
      </div>
      {/* Readability scrim over the imagery. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background"
      />

      <div className="container relative flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          {t('eyebrow')}
        </span>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{t('subline')}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact">
            <Button size="lg" className="w-full sm:w-auto">
              {t('primaryCta')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
          <Link href="/work">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Play className="h-4 w-4" />
              {t('secondaryCta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
