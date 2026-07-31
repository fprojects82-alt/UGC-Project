-- Security hardening (from Supabase advisors after 0001–0004).

-- 1) influencer_availability must respect the querying user's RLS (staff-only),
--    not the view creator's — otherwise a SECURITY DEFINER view leaks rows.
alter view public.influencer_availability set (security_invoker = on);

-- 2) Pin search_path on helper/trigger functions to avoid search_path hijacking.
create or replace function public.is_admin()
returns boolean language sql stable set search_path = public as $$ select public.my_role() = 'admin'; $$;

create or replace function public.is_staff()
returns boolean language sql stable set search_path = public as $$
  select public.my_role() in ('admin', 'account_manager');
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- 3) Trigger-only functions must not be REST/RPC-callable.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.touch_updated_at() from anon, authenticated, public;
