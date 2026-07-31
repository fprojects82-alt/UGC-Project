import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getSessionUser } from '@/lib/auth';
import { getOrder, getOrderJobs, getDeliverables, getMessages, signedAssetUrl } from '@/lib/queries';
import { Card } from '@/components/ui/primitives';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { DeliverableReview, type DeliverableVM } from '@/components/dashboard/deliverable-review';
import { MessageThread } from '@/components/dashboard/message-thread';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({
  params: { locale, id }
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('dashboard.order');
  const tNav = await getTranslations('dashboard');
  const user = await getSessionUser();

  const order = await getOrder(id);
  if (!order) notFound();

  const jobs = await getOrderJobs(id);
  const jobIds = jobs.map((j: any) => j.id);
  const [deliverablesRaw, messages] = await Promise.all([getDeliverables(jobIds), getMessages(id)]);

  // Sign each deliverable's private URL server-side (expiring).
  const revByJob = new Map(jobs.map((j: any) => [j.id, j.revisions_used ?? 0]));
  const deliverables: DeliverableVM[] = await Promise.all(
    (deliverablesRaw as any[]).map(async (d) => ({
      id: d.id,
      jobId: d.job_id,
      fileName: d.file_name,
      status: d.status,
      version: d.version,
      downloadUrl: d.storage_path ? await signedAssetUrl(d.storage_path) : null
    }))
  );

  const totalRevUsed = jobs.reduce((a: number, j: any) => a + (j.revisions_used ?? 0), 0);

  return (
    <div className="space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {tNav('nav.orders')}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{order.title}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t('brief')}
            </h2>
            <p className="text-sm leading-relaxed">{order.brief || '—'}</p>
          </Card>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{t('deliverables')}</h2>
              <span className="text-xs text-muted-foreground">
                {t('revisionsUsed')}: {totalRevUsed} {t('of')} {order.revision_limit}
              </span>
            </div>
            {deliverables.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted-foreground">
                {(await getTranslations('dashboard.empty'))('deliverables')}
              </Card>
            ) : (
              <div className="space-y-3">
                {deliverables.map((d) => (
                  <DeliverableReview
                    key={d.id}
                    deliverable={d}
                    revisionsUsed={(revByJob.get(d.jobId) as number) ?? 0}
                    revisionLimit={order.revision_limit}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <Card className="flex h-[520px] flex-col p-5">
          <h2 className="mb-3 font-display text-lg font-bold">{t('thread')}</h2>
          <MessageThread orderId={id} messages={messages as any} currentUserId={user?.id ?? null} />
        </Card>
      </div>
    </div>
  );
}
