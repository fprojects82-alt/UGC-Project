'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { approveDeliverable, requestRevision } from '@/app/[locale]/dashboard/actions';
import { Download, Check } from 'lucide-react';

export interface DeliverableVM {
  id: string;
  jobId: string;
  fileName: string;
  status: string;
  version: number;
  downloadUrl: string | null;
}

export function DeliverableReview({
  deliverable,
  revisionsUsed,
  revisionLimit
}: {
  deliverable: DeliverableVM;
  revisionsUsed: number;
  revisionLimit: number;
}) {
  const t = useTranslations('dashboard.order');
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const limitReached = revisionsUsed >= revisionLimit;
  const decided = deliverable.status === 'approved' || deliverable.status === 'revision_requested';

  function approve() {
    start(async () => {
      const r = await approveDeliverable(deliverable.id);
      setNote(r.error ? r.error : t('approved'));
    });
  }

  function submitRevision() {
    if (!feedback.trim()) return;
    start(async () => {
      const r = await requestRevision({
        deliverableId: deliverable.id,
        jobId: deliverable.jobId,
        feedback
      });
      if (r.error === 'revision_limit_reached') setNote(t('revisionLimitReached'));
      else setNote(r.error ?? t('requestRevision'));
      if (!r.error) setOpen(false);
    });
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{deliverable.fileName || `Asset v${deliverable.version}`}</p>
          <p className="text-xs text-muted-foreground">
            {deliverable.status === 'approved'
              ? t('approved')
              : deliverable.status === 'revision_requested'
                ? t('requestRevision')
                : t('pendingReview')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {deliverable.downloadUrl && (
            <a href={deliverable.downloadUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" /> {t('download')}
              </Button>
            </a>
          )}
          {!decided && (
            <>
              <Button size="sm" onClick={approve} disabled={pending}>
                <Check className="h-4 w-4" /> {t('approve')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen((v) => !v)}
                disabled={pending || limitReached}
              >
                {t('requestRevision')}
              </Button>
            </>
          )}
        </div>
      </div>

      {limitReached && !decided && (
        <p className="mt-2 text-xs text-accent">{t('revisionLimitReached')}</p>
      )}

      {open && (
        <div className="mt-3 space-y-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder={t('feedback')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <Button size="sm" onClick={submitRevision} disabled={pending || !feedback.trim()}>
            {t('submitFeedback')}
          </Button>
        </div>
      )}

      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
