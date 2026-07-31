'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSessionUser, isConfigured } from '@/lib/auth';
import type { PipelineStatus } from '@/lib/pipeline';

/** Advance a job's status and write an attributed, timestamped audit event. */
export async function advanceStatus(jobId: string, to: PipelineStatus) {
  if (!isConfigured()) return { error: 'not_configured' };
  const user = await getSessionUser();
  if (!user) return { error: 'unauthorized' };
  const supabase = createClient();

  const { data: job } = await supabase.from('jobs').select('status,order_id').eq('id', jobId).single();
  const { error } = await supabase.from('jobs').update({ status: to }).eq('id', jobId);
  if (error) return { error: error.message };

  await supabase.from('status_events').insert({
    job_id: jobId,
    order_id: job?.order_id,
    from_status: job?.status,
    to_status: to,
    changed_by: user.id
  });

  revalidatePath('/dashboard/creator');
  return { ok: true };
}

/** Save internal notes on a job. */
export async function saveInternalNotes(jobId: string, notes: string) {
  if (!isConfigured()) return { error: 'not_configured' };
  const supabase = createClient();
  const { error } = await supabase.from('jobs').update({ internal_notes: notes }).eq('id', jobId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/creator');
  return { ok: true };
}

/** Register an uploaded deliverable (file already pushed to the private bucket). */
export async function addDeliverable(input: {
  jobId: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
}) {
  if (!isConfigured()) return { error: 'not_configured' };
  const user = await getSessionUser();
  if (!user) return { error: 'unauthorized' };
  const supabase = createClient();

  const { count } = await supabase
    .from('deliverables')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', input.jobId);

  const { error } = await supabase.from('deliverables').insert({
    job_id: input.jobId,
    uploaded_by: user.id,
    storage_path: input.storagePath,
    file_name: input.fileName,
    mime_type: input.mimeType,
    status: 'submitted',
    version: (count ?? 0) + 1
  });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/creator');
  return { ok: true };
}
