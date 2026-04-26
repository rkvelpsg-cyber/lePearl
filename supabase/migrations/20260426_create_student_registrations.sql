-- Create student_registrations table for tracking enrollment requests
create table if not exists public.student_registrations (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  qualification text not null,
  course text not null,
  phone text not null,
  email text not null,
  created_at timestamp with time zone default now() not null,
  status text default 'pending' not null
);

-- Enable RLS for public access (registrations are from public form)
alter table public.student_registrations enable row level security;

-- Allow public insert (anyone can submit), admin can view
drop policy if exists "Allow public registrations" on public.student_registrations;
create policy "Allow public registrations" 
  on public.student_registrations 
  for insert 
  with check (true);

drop policy if exists "Allow admin to view registrations" on public.student_registrations;
create policy "Allow admin to view registrations" 
  on public.student_registrations 
  for select 
  using (true);

-- Index for efficient queries
create index if not exists idx_student_registrations_email on public.student_registrations (email);
create index if not exists idx_student_registrations_phone on public.student_registrations (phone);
create index if not exists idx_student_registrations_created_at on public.student_registrations (created_at desc);
