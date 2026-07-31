-- =====================================================================
-- APEXSCALE — core schema
-- Roles: admin, account_manager, creator, client
-- Pipeline: New → Brief Confirmed → In Production → Internal QA →
--           Client Review → Revision → Delivered → Closed
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- enums ----------
create type user_role as enum ('admin', 'account_manager', 'creator', 'client');

create type job_status as enum (
  'new',
  'brief_confirmed',
  'in_production',
  'internal_qa',
  'client_review',
  'revision',
  'delivered',
  'closed'
);

create type deliverable_status as enum ('draft', 'submitted', 'approved', 'revision_requested');
create type license_status as enum ('active', 'expired', 'pending', 'none');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'void');

-- ---------- profiles (1:1 with auth.users) ----------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         user_role not null default 'client',
  full_name    text,
  avatar_url   text,
  phone        text,
  -- capacity for creators: max concurrent active jobs
  capacity     int not null default 5,
  created_at   timestamptz not null default now()
);

-- ---------- clients ----------
create table public.clients (
  id             uuid primary key default gen_random_uuid(),
  -- the client-role profile that owns this account (portal login)
  owner_id       uuid references public.profiles(id) on delete set null,
  account_manager_id uuid references public.profiles(id) on delete set null,
  company        text not null,
  contact_name   text,
  email          text,
  whatsapp       text,
  content_language text default 'both', -- 'ar' | 'en' | 'both'
  created_at     timestamptz not null default now()
);

-- ---------- service catalog (extensible: static now, video later) ----------
create table public.service_types (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name_en       text not null,
  name_ar       text not null,
  description_en text,
  description_ar text,
  category      text not null default 'static', -- 'static' | 'carousel' | 'video' ...
  base_price    numeric(10,2),
  active        boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------- orders (a client purchase; contains one or more jobs) ----------
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients(id) on delete cascade,
  title           text not null,
  brief           text,
  brief_approved  boolean not null default false,
  status          job_status not null default 'new',
  revision_limit  int not null default 2,     -- contractual revision cap
  target_platform text,
  budget_band     text,
  timeline        text,
  total_amount    numeric(10,2),
  cost_amount     numeric(10,2),               -- internal cost, for margin calc
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- jobs (a unit of production work; assigned to a creator) ----------
create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  service_type_id uuid references public.service_types(id) on delete set null,
  assignee_id     uuid references public.profiles(id) on delete set null, -- creator
  influencer_id   uuid,  -- FK added after influencers table below
  title           text not null,
  brief           text,
  output_specs    text,
  status          job_status not null default 'new',
  deadline        timestamptz,
  revisions_used  int not null default 0,
  internal_notes  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index on public.jobs (assignee_id);
create index on public.jobs (status);
create index on public.jobs (deadline);

-- ---------- deliverables (files produced for a job) ----------
create table public.deliverables (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references public.jobs(id) on delete cascade,
  uploaded_by   uuid references public.profiles(id) on delete set null,
  storage_path  text not null,              -- object key in the private bucket
  file_name     text,
  mime_type     text,
  status        deliverable_status not null default 'submitted',
  version       int not null default 1,
  created_at    timestamptz not null default now()
);
create index on public.deliverables (job_id);

-- ---------- revisions (client feedback attached to a specific asset) ----------
create table public.revisions (
  id             uuid primary key default gen_random_uuid(),
  deliverable_id uuid not null references public.deliverables(id) on delete cascade,
  job_id         uuid not null references public.jobs(id) on delete cascade,
  requested_by   uuid references public.profiles(id) on delete set null,
  feedback       text not null,
  resolved       boolean not null default false,
  created_at     timestamptz not null default now()
);
create index on public.revisions (job_id);

-- ---------- messages (client ↔ account manager thread, per order) ----------
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index on public.messages (order_id, created_at);

-- ---------- invoices ----------
create table public.invoices (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete set null,
  number      text unique not null,
  amount      numeric(10,2) not null,
  currency    text not null default 'USD',
  status      invoice_status not null default 'draft',
  issued_at   timestamptz,
  due_at      timestamptz,
  paid_at     timestamptz,
  pdf_path    text,
  created_at  timestamptz not null default now()
);
create index on public.invoices (client_id);

-- ---------- influencers (sensitive: likeness governance) ----------
create table public.influencers (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique,
  name               text not null,
  niche              text,
  platform           text,
  followers          text,
  avatar_path        text,
  approval_required  boolean not null default false,
  per_campaign_rate  numeric(10,2),
  created_at         timestamptz not null default now()
);

-- jobs → influencers FK (deferred until influencers exists)
alter table public.jobs
  add constraint jobs_influencer_fk
  foreign key (influencer_id) references public.influencers(id) on delete set null;

-- ---------- influencer_licenses ----------
create table public.influencer_licenses (
  id                    uuid primary key default gen_random_uuid(),
  influencer_id         uuid not null references public.influencers(id) on delete cascade,
  status                license_status not null default 'none',
  license_start         date,
  license_expiry        date,
  permitted_categories  text[] not null default '{}',
  forbidden_categories  text[] not null default '{}',
  notes                 text,
  created_at            timestamptz not null default now()
);
create index on public.influencer_licenses (influencer_id);

-- Convenience view: an influencer is selectable only with an active, unexpired
-- license. The admin UI uses is_selectable to visually BLOCK (not merely flag).
create view public.influencer_availability as
select
  i.id,
  i.name,
  i.slug,
  i.approval_required,
  l.status,
  l.license_expiry,
  (
    l.status = 'active'
    and l.license_expiry is not null
    and l.license_expiry >= current_date
  ) as is_selectable
from public.influencers i
left join lateral (
  select * from public.influencer_licenses il
  where il.influencer_id = i.id
  order by il.license_expiry desc nulls last
  limit 1
) l on true;

-- ---------- status transition audit (timestamped + attributed) ----------
create table public.status_events (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid references public.jobs(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete cascade,
  from_status job_status,
  to_status   job_status not null,
  changed_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index on public.status_events (job_id, created_at);

-- ---------- auto-provision a profile on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- updated_at maintenance ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();
create trigger jobs_touch before update on public.jobs
  for each row execute function public.touch_updated_at();
