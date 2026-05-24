-- Cocuna initial schema — locked 2026-05-23 via /design-consultation + blueprint section 03.A
-- RLS is enabled on every user-scoped table from the start (blueprint critical step).

-- =============================================================================
-- Profiles — one row per auth.users row; tracks stage + name
-- =============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  stage text not null check (stage in ('ttc', 'pregnant', 'postpartum', 'toddler')),
  weeks_pregnant int,
  days_postpartum int,
  baby_age_days int,
  next_checkin text,
  bp_streak_days int default 0,
  kick_streak_days int default 0,
  -- Clinic dashboards: lets us filter by clinic. NULL = demo / no clinic yet.
  clinic_id uuid,
  is_demo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- =============================================================================
-- Logs — one row per data point the mother enters (BP, mood, kicks, etc.)
-- =============================================================================
create table public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('bp', 'mood', 'feeding', 'diapers', 'glucose', 'kicks')),
  -- Numeric fields are nullable so each kind picks what it needs
  systolic int,
  diastolic int,
  mood_score int check (mood_score between 0 and 10),
  energy_score int check (energy_score between 0 and 10),
  pain_score int check (pain_score between 0 and 10),
  glucose_mg_dl int,
  kicks_in_hour int,
  feeding_minutes int,
  diapers_count int,
  note text,
  logged_at timestamptz default now()
);

alter table public.logs enable row level security;

create policy "logs_self_select" on public.logs
  for select using (auth.uid() = user_id);
create policy "logs_self_insert" on public.logs
  for insert with check (auth.uid() = user_id);
create policy "logs_self_update" on public.logs
  for update using (auth.uid() = user_id);
create policy "logs_self_delete" on public.logs
  for delete using (auth.uid() = user_id);

create index logs_user_logged_at_idx on public.logs (user_id, logged_at desc);

-- =============================================================================
-- Chat messages — the RAD conversation thread per user
-- =============================================================================
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid not null default gen_random_uuid(),
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "messages_self_select" on public.chat_messages
  for select using (auth.uid() = user_id);
create policy "messages_self_insert" on public.chat_messages
  for insert with check (auth.uid() = user_id);

create index chat_messages_thread_created_idx on public.chat_messages (thread_id, created_at);

-- =============================================================================
-- Triage decisions — every RAD output is persisted, joined to a thread
-- =============================================================================
create table public.triage_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid not null,
  level text not null check (level in ('red', 'orange', 'yellow', 'green', 'gray')),
  score int not null default 0,
  reason text not null,
  contributions jsonb not null default '[]'::jsonb,
  recommended_action text not null,
  when_to_escalate text not null,
  notify_clinic boolean not null default false,
  source_protocol text not null,
  -- Surfaces in the clinic queue
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  created_at timestamptz default now()
);

alter table public.triage_decisions enable row level security;

create policy "triage_self_select" on public.triage_decisions
  for select using (auth.uid() = user_id);
create policy "triage_self_insert" on public.triage_decisions
  for insert with check (auth.uid() = user_id);

create index triage_decisions_user_created_idx on public.triage_decisions (user_id, created_at desc);

-- =============================================================================
-- Auto-create a profile when a user signs up (anonymous or otherwise)
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, stage, is_demo)
  values (new.id, 'postpartum', new.is_anonymous)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
