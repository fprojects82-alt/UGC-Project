-- =====================================================================
-- Row Level Security. Access control lives in Postgres, NOT client routes.
-- Clients read only their own rows; creators only their assigned jobs;
-- account managers their book of clients; admins everything.
-- =====================================================================

-- ---------- role helpers (security definer to read profiles safely) ----------
create or replace function public.my_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$ select public.my_role() = 'admin'; $$;

create or replace function public.is_staff()
returns boolean language sql stable as $$
  select public.my_role() in ('admin', 'account_manager');
$$;

-- Client account ids owned by the current user (portal login).
create or replace function public.my_client_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.clients where owner_id = auth.uid();
$$;

-- Client ids an account manager is responsible for (staff also see all via is_staff).
create or replace function public.managed_client_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.clients where account_manager_id = auth.uid();
$$;

-- ---------- enable RLS ----------
alter table public.profiles            enable row level security;
alter table public.clients             enable row level security;
alter table public.service_types       enable row level security;
alter table public.orders              enable row level security;
alter table public.jobs                enable row level security;
alter table public.deliverables        enable row level security;
alter table public.revisions           enable row level security;
alter table public.messages            enable row level security;
alter table public.invoices            enable row level security;
alter table public.influencers         enable row level security;
alter table public.influencer_licenses enable row level security;
alter table public.status_events       enable row level security;

-- ---------- profiles ----------
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- service_types: readable by all authenticated; writable by staff ----------
create policy service_read on public.service_types
  for select using (true);
create policy service_write on public.service_types
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- clients ----------
create policy clients_read on public.clients
  for select using (
    owner_id = auth.uid()
    or account_manager_id = auth.uid()
    or public.is_staff()
  );
create policy clients_staff_write on public.clients
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- orders ----------
create policy orders_client_read on public.orders
  for select using (
    client_id in (select public.my_client_ids())
    or public.is_staff()
    -- creators can read orders that contain a job assigned to them
    or exists (select 1 from public.jobs j where j.order_id = orders.id and j.assignee_id = auth.uid())
  );
create policy orders_staff_write on public.orders
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- jobs: creators see ONLY their assigned jobs ----------
create policy jobs_read on public.jobs
  for select using (
    assignee_id = auth.uid()
    or public.is_staff()
    or order_id in (
      select o.id from public.orders o where o.client_id in (select public.my_client_ids())
    )
  );
-- creators may update status/notes/uploads on their own jobs; staff anything
create policy jobs_creator_update on public.jobs
  for update using (assignee_id = auth.uid() or public.is_staff())
  with check (assignee_id = auth.uid() or public.is_staff());
create policy jobs_staff_write on public.jobs
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- deliverables ----------
create policy deliverables_read on public.deliverables
  for select using (
    public.is_staff()
    or exists (select 1 from public.jobs j where j.id = deliverables.job_id and j.assignee_id = auth.uid())
    or exists (
      select 1 from public.jobs j join public.orders o on o.id = j.order_id
      where j.id = deliverables.job_id and o.client_id in (select public.my_client_ids())
    )
  );
create policy deliverables_creator_write on public.deliverables
  for insert with check (
    public.is_staff()
    or exists (select 1 from public.jobs j where j.id = deliverables.job_id and j.assignee_id = auth.uid())
  );
create policy deliverables_creator_modify on public.deliverables
  for update using (
    public.is_staff()
    or exists (select 1 from public.jobs j where j.id = deliverables.job_id and j.assignee_id = auth.uid())
  );

-- ---------- revisions: clients create feedback on their own deliverables ----------
create policy revisions_read on public.revisions
  for select using (
    public.is_staff()
    or requested_by = auth.uid()
    or exists (select 1 from public.jobs j where j.id = revisions.job_id and j.assignee_id = auth.uid())
    or exists (
      select 1 from public.jobs j join public.orders o on o.id = j.order_id
      where j.id = revisions.job_id and o.client_id in (select public.my_client_ids())
    )
  );
create policy revisions_client_insert on public.revisions
  for insert with check (
    public.is_staff()
    or exists (
      select 1 from public.jobs j join public.orders o on o.id = j.order_id
      where j.id = revisions.job_id and o.client_id in (select public.my_client_ids())
    )
  );

-- ---------- messages: participants of the order's thread ----------
create policy messages_read on public.messages
  for select using (
    public.is_staff()
    or order_id in (select o.id from public.orders o where o.client_id in (select public.my_client_ids()))
  );
create policy messages_insert on public.messages
  for insert with check (
    sender_id = auth.uid() and (
      public.is_staff()
      or order_id in (select o.id from public.orders o where o.client_id in (select public.my_client_ids()))
    )
  );

-- ---------- invoices: clients read own; staff manage ----------
create policy invoices_read on public.invoices
  for select using (client_id in (select public.my_client_ids()) or public.is_staff());
create policy invoices_staff_write on public.invoices
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- influencers + licenses: STAFF ONLY (sensitive) ----------
create policy influencers_staff on public.influencers
  for all using (public.is_staff()) with check (public.is_staff());
create policy licenses_staff on public.influencer_licenses
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- status events ----------
create policy status_read on public.status_events
  for select using (
    public.is_staff()
    or exists (select 1 from public.jobs j where j.id = status_events.job_id and j.assignee_id = auth.uid())
    or order_id in (select o.id from public.orders o where o.client_id in (select public.my_client_ids()))
  );
create policy status_insert on public.status_events
  for insert with check (
    changed_by = auth.uid() and (
      public.is_staff()
      or exists (select 1 from public.jobs j where j.id = status_events.job_id and j.assignee_id = auth.uid())
    )
  );

-- =====================================================================
-- Storage: a PRIVATE bucket. Assets are served ONLY via signed, expiring
-- URLs generated server-side (createSignedUrl). No public read policy.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do nothing;

-- Staff + creators may upload; reads happen through signed URLs minted by the
-- server after an RLS-authorized check, so no broad SELECT policy is granted.
create policy storage_staff_creator_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'assets' and (public.is_staff() or public.my_role() = 'creator')
  );
create policy storage_staff_creator_update on storage.objects
  for update to authenticated
  using (bucket_id = 'assets' and (public.is_staff() or public.my_role() = 'creator'));
