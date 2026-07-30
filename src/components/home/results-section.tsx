import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { CostChart, TurnaroundChart, EngagementChart } from '@/components/charts/result-charts';

export function ResultsSection() {
  const t = useTranslations('results');

  return (
    <Section id="results" className="bg-card/20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="grid gap-6 lg:grid-cols-3">
        <CostChart />
        <TurnaroundChart />
        <EngagementChart />
      </div>
    </Section>
  );
}
