import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getSessionUser } from '@/lib/auth';
import { getMyOrders, getMyInvoices } from '@/lib/queries';
import { Card } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientDashboard({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const user = await getSessionUser();
  // Staff/creator roles have their own dashboards (linked in the sidebar);
  // this route renders the client view.
  const [orders, invoices] = await Promise.all([getMyOrders(), getMyInvoices()]);
  const t = await getTranslations('dashboard');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold">{t('nav.orders')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('welcome')}{user?.name ? `, ${user.name}` : ''}.
        </p>
      </div>

      <section>
        {orders.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">{t('empty.orders')}</Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <Card key={o.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">{o.title}</h2>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('order.revisionsUsed')}: 0 {t('order.of')} {o.revision_limit}
                  </p>
                </div>
                <Link href={`/dashboard/orders/${o.id}`}>
                  <Button variant="outline" size="sm">
                    {t('order.viewOrder')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section id="invoices">
        <h2 className="mb-4 font-display text-xl font-bold">{t('nav.invoices')}</h2>
        {invoices.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">{t('empty.invoices')}</Card>
        ) : (
          <Card className="divide-y divide-border">
            {invoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-4 text-sm">
                <span className="font-medium">{t('invoice.number')} {inv.number}</span>
                <span>{inv.currency} {inv.amount}</span>
                <StatusBadge status={inv.status} />
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
