import { useTranslations } from 'next-intl';

export function TrustBar() {
  const t = useTranslations('trust');
  const stats = ['pieces', 'turnaround', 'languages'] as const;

  return (
    <section aria-label={t('label')} className="border-y border-border bg-card/30">
      <div className="container grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s} className="text-center">
            <div className="font-display text-3xl font-bold text-accent md:text-4xl">
              {t(`stats.${s}.value`)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{t(`stats.${s}.label`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
