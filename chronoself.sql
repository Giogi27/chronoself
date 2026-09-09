-- Incolla in Supabase → SQL Editor, poi Run.
create table if not exists chronoself_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table chronoself_saves enable row level security;

drop policy if exists cs_select on chronoself_saves;
drop policy if exists cs_upsert on chronoself_saves;

create policy cs_select on chronoself_saves
  for select using (auth.uid() = user_id);

create policy cs_insert on chronoself_saves
  for insert with check (auth.uid() = user_id);

create policy cs_update on chronoself_saves
  for update using (auth.uid() = user_id);
