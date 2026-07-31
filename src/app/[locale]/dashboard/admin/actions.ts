'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSessionUser, isConfigured } from '@/lib/auth';

/** Assign an unassigned job to a creator (admin / account_manager only via RLS). */
export async function assignJob(jobId: string, creatorId: string) {
  if (!isConfigured()) return { error: 'not_configured' };
  const user = await getSessionUser();
  if (!user || !['admin', 'account_manager'].includes(user.role)) return { error: 'unauthorized' };
  const supabase = createClient();
  const { error } = await supabase.from('jobs').update({ assignee_id: creatorId }).eq('id', jobId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/admin');
  return { ok: true };
}
