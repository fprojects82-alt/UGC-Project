-- Public intake submissions from the Contact page (Home §11 / /contact).
-- Anonymous visitors may INSERT (lead capture); only staff may read.
create table public.intake_submissions (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  company         text,
  email           text not null,
  whatsapp        text,
  service_type    text,
  target_platform text,
  budget_band     text,
  timeline        text,
  content_language text,
  asset_path      text,           -- object key in the private 'assets' bucket
  message         text,
  handled         boolean not null default false,
  created_at      timestamptz not null default now()
);

alter table public.intake_submissions enable row level security;

-- Anyone (including anon) can submit a lead. No SELECT for anon.
create policy intake_insert on public.intake_submissions
  for insert to anon, authenticated
  with check (true);

-- Only staff can read / manage submissions.
create policy intake_staff_read on public.intake_submissions
  for select using (public.is_staff());
create policy intake_staff_update on public.intake_submissions
  for update using (public.is_staff());
