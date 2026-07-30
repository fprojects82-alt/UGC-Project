import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { BookingWidget } from '@/components/booking-widget';

export function FinalCta() {
  const t = useTranslations('cta');

  return (
    <Section id="book" className="bg-card/20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto max-w-3xl">
        <BookingWidget />
      </div>
    </Section>
  );
}
