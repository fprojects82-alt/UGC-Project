import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getMyJobQueue } from '@/lib/staff-queries';
import { isOverdue } from '@/lib/pipeline';
import { Card } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CreatorDashboard({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const jobs = await getMyJobQueue();
  const t = await getTranslations('creator');
  const tEmpty = await getTranslations('dashboard.empty');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">{t('queueTitle')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('sortedByDeadline')}</p>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">{tEmpty('jobs')}</Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((j: any) => {
            const overdue = isOverdue(j.deadline, j.status);
            return (
              <Card
                key={j.id}
                className={`flex items-center justify-between gap-4 p-5 ${overdue ? 'border-accent' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">{j.title}</h2>
                    <StatusBadge status={j.status} />
                    {overdue && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                        <AlertTriangle className="h-3 w-3" /> {t('overdue')}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {j.deadline
                      ? `${t('dueBy')}: ${new Date(j.deadline).toLocaleDateString(locale)}`
                      : t('noDeadline')}
                  </p>
                </div>
                <Link href={`/dashboard/creator/${j.id}`}>
                  <Button variant="outline" size="sm">
                    {t('openJob')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
