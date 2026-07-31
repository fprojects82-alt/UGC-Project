'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { saveInternalNotes } from '@/app/[locale]/dashboard/creator/actions';

export function NotesEditor({ jobId, initial }: { jobId: string; initial: string }) {
  const t = useTranslations('creator');
  const [value, setValue] = useState(initial);
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button
          size="sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await saveInternalNotes(jobId, value);
              setNote(r.error ?? t('saved'));
            })
          }
        >
          {t('saveNotes')}
        </Button>
        {note && <span className="text-xs text-muted-foreground">{note}</span>}
      </div>
    </div>
  );
}
