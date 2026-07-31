'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSessionUser, isConfigured } from '@/lib/auth';

/** Client approves a deliverable. */
export async function approveDeliverable(deliverableId: string) {
  if (!isConfigured()) return { error: 'not_configured' };
  const supabase = createClient();
  const { error } = await supabase
    .from('deliverables')
    .update({ status: 'approved' })
    .eq('id', deliverableId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  return { ok: true };
}

/**
 * Client requests a revision on a specific asset. Enforces the contractual
 * revision limit server-side (RLS lets clients insert; this caps the count).
 */
export async function requestRevision(input: {
  deliverableId: string;
  jobId: string;
  feedback: string;
}) {
  if (!isConfigured()) return { error: 'not_configured' };
  const user = await getSessionUser();
  if (!user) return { error: 'unauthorized' };
  const supabase = createClient();

  const { data: job } = await supabase
    .from('jobs')
    .select('id,order_id,revisions_used')
    .eq('id', input.jobId)
    .single();
  if (!job) return { error: 'not_found' };

  const { data: order } = await supabase
    .from('orders')
    .select('revision_limit')
    .eq('id', job.order_id)
    .single();

  if (order && job.revisions_used >= order.revision_limit) {
    return { error: 'revision_limit_reached' };
  }

  const { error } = await supabase.from('revisions').insert({
    deliverable_id: input.deliverableId,
    job_id: input.jobId,
    requested_by: user.id,
    feedback: input.feedback
  });
  if (error) return { error: error.message };

  await supabase
    .from('deliverables')
    .update({ status: 'revision_requested' })
    .eq('id', input.deliverableId);
  await supabase
    .from('jobs')
    .update({ revisions_used: job.revisions_used + 1, status: 'revision' })
    .eq('id', input.jobId);

  revalidatePath('/dashboard');
  return { ok: true };
}

/** Post a message to an order's thread. */
export async function sendMessage(orderId: string, body: string) {
  if (!isConfigured()) return { error: 'not_configured' };
  const user = await getSessionUser();
  if (!user) return { error: 'unauthorized' };
  const supabase = createClient();
  const { error } = await supabase
    .from('messages')
    .insert({ order_id: orderId, sender_id: user.id, body });
  if (error) return { error: error.message };
  revalidatePath(`/dashboard/orders/${orderId}`);
  return { ok: true };
}
