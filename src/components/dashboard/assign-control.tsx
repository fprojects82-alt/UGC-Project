'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { assignJob } from '@/app/[locale]/dashboard/admin/actions';

export function AssignControl({
  jobId,
  creators
}: {
  jobId: string;
  creators: { id: string; name: string | null; load: number; capacity: number }[];
}) {
  const t = useTranslations('admin');
  const [creatorId, setCreatorId] = useState('');
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <select
        value={creatorId}
        onChange={(e) => setCreatorId(e.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
      >
        <option value="">{t('assignTo')}</option>
        {creators.map((c) => (
          <option key={c.id} value={c.id} disabled={c.load >= c.capacity}>
            {c.name || c.id.slice(0, 6)} ({c.load}/{c.capacity})
          </option>
        ))}
      </select>
      <Button
        size="sm"
        disabled={pending || !creatorId}
        onClick={() =>
          start(async () => {
            const r = await assignJob(jobId, creatorId);
            setNote(r.error ?? '✓');
          })
        }
      >
        {t('assign')}
      </Button>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
