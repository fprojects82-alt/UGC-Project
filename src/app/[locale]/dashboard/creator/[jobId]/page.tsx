import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getJob, getJobRevisions } from '@/lib/staff-queries';
import { getDeliverables } from '@/lib/queries';
import { Card } from '@/components/ui/primitives';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { StatusControl } from '@/components/dashboard/status-control';
import { DeliverableUploader } from '@/components/dashboard/deliverable-uploader';
import { NotesEditor } from '@/components/dashboard/notes-editor';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CreatorJobDetail({
  params: { locale, jobId }
}: {
  params: { locale: string; jobId: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('creator');
  const job = await getJob(jobId);
  if (!job) notFound();

  const [revisions, deliverables] = await Promise.all([
    getJobRevisions(jobId),
    getDeliverables([jobId])
  ]);

  return (
    <div className="space-y-8">
      <Link href="/dashboard/creator" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('backToQueue')}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{job.title}</h1>
        <StatusBadge status={job.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('brief')}</h2>
            <p className="text-sm leading-relaxed">{job.brief || '—'}</p>
          </Card>
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('specs')}</h2>
            <p className="text-sm leading-relaxed">{job.output_specs || '—'}</p>
          </Card>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold">{t('upload')}</h2>
            <DeliverableUploader jobId={jobId} />
            {deliverables.length > 0 && (
              <ul className="mt-4 space-y-2">
                {(deliverables as any[]).map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                    <span>{d.file_name || `v${d.version}`}</span>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold">{t('revisionHistory')}</h2>
            {revisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noRevisions')}</p>
            ) : (
              <ul className="space-y-3">
                {(revisions as any[]).map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-4">
                    <p className="text-sm">{r.feedback}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString(locale)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('statusControl')}</h2>
            <StatusControl jobId={jobId} current={job.status} />
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('internalNotes')}</h2>
            <NotesEditor jobId={jobId} initial={job.internal_notes || ''} />
          </Card>
        </div>
      </div>
    </div>
  );
}
