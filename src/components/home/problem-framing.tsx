import { useTranslations } from 'next-intl';
import { Section, SectionHeader, Card } from '@/components/ui/primitives';
import { Clock, DollarSign, Layers } from 'lucide-react';

const cards = [
  { key: 'cost', Icon: DollarSign },
  { key: 'speed', Icon: Clock },
  { key: 'scale', Icon: Layers }
] as const;

export function ProblemFraming() {
  const t = useTranslations('problem');

  return (
    <Section>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(({ key, Icon }) => (
          <Card key={key} className="p-6">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{t(`cards.${key}.title`)}</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-muted-foreground line-through decoration-muted-foreground/40">
                {t(`cards.${key}.traditional`)}
              </p>
              <p className="font-semibold text-accent">{t(`cards.${key}.ours`)}</p>
            </div>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              {t(`cards.${key}.note`)}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
