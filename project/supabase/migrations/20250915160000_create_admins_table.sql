-- Migration: create admins table

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  role text default 'admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists admins_email_idx on public.admins (lower(email));

-- trigger to keep updated_at current
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tg_set_updated_at
before update on public.admins
for each row
execute procedure public.set_updated_at();
