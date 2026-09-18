-- Preserve the earlier contact_submissions migration/table and any existing data.
-- Only new submissions use this table.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  organisation text check (char_length(organisation) <= 150),
  inquiry_type text not null check (inquiry_type in (
    'Collaborations', 'Sponsorships', 'Workshops',
    'Technical Partnerships', 'Student Opportunities'
  )),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  dedupe_key text not null constraint contact_messages_dedupe_key_unique unique
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_status_idx on public.contact_messages (status);
create index contact_messages_inquiry_type_idx on public.contact_messages (inquiry_type);

alter table public.contact_messages enable row level security;
revoke all on table public.contact_messages from public, anon, authenticated;
-- Explicit service-role grant also supports projects with automatic API grants disabled.
grant select, insert on table public.contact_messages to service_role;
-- No browser policies: all writes go through the Edge Function.
