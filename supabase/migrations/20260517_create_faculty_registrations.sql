create table if not exists public.faculty_registrations (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  whatsapp text not null,
  education text not null,
  net_category text not null,
  address text not null,
  guardian_name text,
  skills text not null,
  teaching_mode text not null,
  research_experience text,
  papers_published text,
  expertise text not null,
  status text not null default 'pending',
  reviewed_by text,
  reviewed_at timestamp with time zone,
  review_notes text,
  created_at timestamp with time zone not null default now()
);

alter table public.faculty_registrations enable row level security;

drop policy if exists "Allow public faculty registrations" on public.faculty_registrations;
create policy "Allow public faculty registrations"
  on public.faculty_registrations
  for insert
  with check (true);

drop policy if exists "Allow admin to view faculty registrations" on public.faculty_registrations;
create policy "Allow admin to view faculty registrations"
  on public.faculty_registrations
  for select
  using (true);

drop policy if exists "Allow admin to update faculty registrations" on public.faculty_registrations;
create policy "Allow admin to update faculty registrations"
  on public.faculty_registrations
  for update
  using (true)
  with check (true);

create index if not exists idx_faculty_registrations_email on public.faculty_registrations (email);
create index if not exists idx_faculty_registrations_status on public.faculty_registrations (status);
create index if not exists idx_faculty_registrations_created_at on public.faculty_registrations (created_at desc);
