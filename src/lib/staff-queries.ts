import { createClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/auth';

/** Creator: jobs assigned to me, soonest deadline first. */
export async function getMyJobQueue() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('jobs')
    .select('id,title,status,deadline,revisions_used,brief,output_specs,internal_notes,order_id,service_type_id')
    .order('deadline', { ascending: true, nullsFirst: false });
  return data ?? [];
}

/** Creator/staff: a single job with its brief, specs, notes. */
export async function getJob(jobId: string) {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from('jobs')
    .select('id,title,status,deadline,revisions_used,brief,output_specs,internal_notes,order_id')
    .eq('id', jobId)
    .single();
  return data ?? null;
}

/** Revision history for a job, with the client's feedback attached to each asset. */
export async function getJobRevisions(jobId: string) {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('revisions')
    .select('id,deliverable_id,feedback,resolved,created_at')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

/** Admin/AM: all orders for the pipeline board. */
export async function getAllOrders() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('id,title,status,total_amount,cost_amount,created_at,client_id')
    .order('created_at', { ascending: false });
  return data ?? [];
}

/** Admin: unassigned jobs pool. */
export async function getUnassignedJobs() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('jobs')
    .select('id,title,status,deadline,order_id')
    .is('assignee_id', null);
  return data ?? [];
}

/** Admin: creators + their active workload for the capacity view. */
export async function getCreatorWorkload() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data: creators } = await supabase
    .from('profiles')
    .select('id,full_name,capacity')
    .eq('role', 'creator');
  if (!creators) return [];
  const { data: jobs } = await supabase
    .from('jobs')
    .select('assignee_id,status')
    .not('assignee_id', 'is', null);
  const active = new Map<string, number>();
  (jobs ?? []).forEach((j: any) => {
    if (!['delivered', 'closed'].includes(j.status)) {
      active.set(j.assignee_id, (active.get(j.assignee_id) ?? 0) + 1);
    }
  });
  return creators.map((c: any) => ({
    id: c.id,
    name: c.full_name,
    capacity: c.capacity,
    load: active.get(c.id) ?? 0
  }));
}

/** Admin: revenue + margin summary. */
export async function getRevenueSummary() {
  if (!isConfigured()) return { revenue: 0, cost: 0, margin: 0, count: 0 };
  const supabase = createClient();
  const { data } = await supabase.from('orders').select('total_amount,cost_amount');
  const revenue = (data ?? []).reduce((a: number, o: any) => a + Number(o.total_amount ?? 0), 0);
  const cost = (data ?? []).reduce((a: number, o: any) => a + Number(o.cost_amount ?? 0), 0);
  return { revenue, cost, margin: revenue - cost, count: (data ?? []).length };
}

/** Admin: influencer library joined with license availability (block if not selectable). */
export async function getInfluencerLibrary() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data: influencers } = await supabase
    .from('influencers')
    .select('id,name,niche,platform,approval_required,per_campaign_rate');
  const { data: availability } = await supabase.from('influencer_availability').select('*');
  const availById = new Map((availability ?? []).map((a: any) => [a.id, a]));
  const { data: licenses } = await supabase
    .from('influencer_licenses')
    .select('influencer_id,status,license_start,license_expiry,permitted_categories,forbidden_categories');
  const licById = new Map((licenses ?? []).map((l: any) => [l.influencer_id, l]));

  return (influencers ?? []).map((i: any) => {
    const a: any = availById.get(i.id);
    const l: any = licById.get(i.id);
    return {
      id: i.id,
      name: i.name,
      niche: i.niche,
      platform: i.platform,
      approvalRequired: i.approval_required,
      rate: i.per_campaign_rate,
      status: l?.status ?? 'none',
      start: l?.license_start ?? null,
      expiry: l?.license_expiry ?? null,
      permitted: l?.permitted_categories ?? [],
      forbidden: l?.forbidden_categories ?? [],
      selectable: Boolean(a?.is_selectable)
    };
  });
}
