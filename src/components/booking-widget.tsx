'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/primitives';

/**
 * Booking widget. Embeds Cal.com / Calendly directly (Home §11 — embedded, not
 * a link away). Set NEXT_PUBLIC_BOOKING_URL to your scheduling link.
 * Analytics/conversion tracking hook fires on load (see onBookingView).
 */
export function BookingWidget() {
  const t = useTranslations('cta');
  const url = process.env.NEXT_PUBLIC_BOOKING_URL;

  if (!url) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center p-8 text-center text-sm text-muted-foreground">
        {t('bookingUnavailable')}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <iframe
        src={url}
        title="Booking"
        className="h-[640px] w-full border-0"
        loading="lazy"
        onLoad={() => {
          // Conversion tracking hook — wire to your analytics in Phase 2.
          if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('booking_widget_view');
          }
        }}
      />
    </Card>
  );
}
