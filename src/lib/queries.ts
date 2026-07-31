import { createClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/auth';

/**
 * Read helpers for the dashboards. Every query runs under the caller's session,
 * so Postgres RLS — not this code — enforces who can see what. All helpers
 * degrade to empty results when Supabase isn't configured yet.
 */

export type OrderRow = {
  id: string;
  title: string;
  status: string;
  brief: string | null;
  brief_approved: boolean;
  revision_limit: number;
  created_at: string;
  client_id: string;
};

export async function getMyOrders(): Promise<OrderRow[]> {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('id,title,status,brief,brief_approved,revision_limit,created_at,client_id')
    .order('created_at', { ascending: false });
  return (data as OrderRow[]) ?? [];
}

export async function getOrder(id: string): Promise<OrderRow | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('id,title,status,brief,brief_approved,revision_limit,created_at,client_id')
    .eq('id', id)
    .single();
  return (data as OrderRow) ?? null;
}

export async function getOrderJobs(orderId: string) {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('jobs')
    .select('id,title,status,revisions_used,deadline')
    .eq('order_id', orderId);
  return data ?? [];
}

export async function getDeliverables(jobIds: string[]) {
  if (!isConfigured() || jobIds.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('deliverables')
    .select('id,job_id,file_name,storage_path,status,version,created_at')
    .in('job_id', jobIds)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMessages(orderId: string) {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('messages')
    .select('id,body,sender_id,created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  return data ?? [];
}

export async function getMyInvoices() {
  if (!isConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('invoices')
    .select('id,number,amount,currency,status,issued_at,due_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

/** Signed, expiring URL for a private asset (default 60 min). */
export async function signedAssetUrl(path: string, expiresIn = 3600): Promise<string | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase.storage.from('assets').createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}
