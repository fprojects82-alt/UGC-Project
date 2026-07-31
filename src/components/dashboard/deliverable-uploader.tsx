'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { addDeliverable } from '@/app/[locale]/dashboard/creator/actions';
import { Upload } from 'lucide-react';

/** Uploads directly to the private 'assets' bucket (creator-authorized via RLS),
 *  then registers the deliverable row. */
export function DeliverableUploader({ jobId }: { jobId: string }) {
  const t = useTranslations('creator');
  const [file, setFile] = useState<File | null>(null);
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  function upload() {
    if (!file) return;
    start(async () => {
      try {
        const supabase = createClient();
        const path = `deliverables/${jobId}/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage.from('assets').upload(path, file);
        if (error) throw error;
        const r = await addDeliverable({
          jobId,
          storagePath: path,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream'
        });
        setNote(r.error ?? t('saved'));
        if (!r.error) setFile(null);
      } catch {
        setNote(t('dropFile'));
      }
    });
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-muted-foreground file:me-3 file:rounded-md file:border-0 file:bg-card file:px-3 file:py-2 file:text-sm"
      />
      <Button size="sm" className="mt-3" onClick={upload} disabled={pending || !file}>
        <Upload className="h-4 w-4" /> {pending ? t('uploading') : t('upload')}
      </Button>
      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
