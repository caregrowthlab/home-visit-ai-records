create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'user')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  patient_name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text not null,
  visit_date date not null,
  focus text,
  memo_text text not null,
  previous_record_text text,
  output_type text not null check (output_type in ('dar', 'letter')),
  generated_text text not null,
  created_by text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists records_patient_name_idx on public.records(patient_name);
create index if not exists records_visit_date_idx on public.records(visit_date);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists records_set_updated_at on public.records;
create trigger records_set_updated_at
before update on public.records
for each row
execute function public.set_updated_at();
