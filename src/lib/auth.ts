import { createClient } from '@/lib/supabase/server';

export type Role = 'admin' | 'account_manager' | 'creator' | 'client';

export interface SessionUser {
  id: string;
  email: string | null;
  role: Role;
  name: string | null;
}

export function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Returns the authenticated user + role, or null. Server-side only. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isConfigured()) return null;
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as Role) ?? 'client',
    name: profile?.full_name ?? null
  };
}

/** Home path for each role after login. */
export function dashboardHome(role: Role): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'account_manager':
      return '/dashboard/admin';
    case 'creator':
      return '/dashboard/creator';
    default:
      return '/dashboard';
  }
}
