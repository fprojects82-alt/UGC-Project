'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PIPELINE, type PipelineStatus } from '@/lib/pipeline';
import { advanceStatus } from '@/app/[locale]/dashboard/creator/actions';

export function StatusControl({ jobId, current }: { jobId: string; current: string }) {
  const t = useTranslations('creator');
  const tStatus = useTranslations('dashboard.status');
  const [value, setValue] = useState<PipelineStatus>(current as PipelineStatus);
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as PipelineStatus)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      >
        {PIPELINE.map((s) => (
          <option key={s} value={s}>
            {tStatus(s)}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        disabled={pending || value === current}
        onClick={() =>
          start(async () => {
            const r = await advanceStatus(jobId, value);
            setNote(r.error ?? t('saved'));
          })
        }
      >
        {t('advance')}
      </Button>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
