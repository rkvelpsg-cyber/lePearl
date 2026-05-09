alter table public.faculty_profiles
  add column if not exists must_reset_password boolean not null default false;

create table if not exists public.faculty_attendance (
  id bigserial primary key,
  faculty_user_id uuid not null references public.profiles (user_id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('present', 'absent', 'leave')),
  notes text,
  marked_by uuid references public.profiles (user_id) on delete set null,
  marked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_user_id, attendance_date)
);

alter table public.faculty_attendance enable row level security;

create trigger trg_faculty_attendance_updated_at
before update on public.faculty_attendance
for each row
execute function public.set_updated_at();

drop policy if exists faculty_attendance_admin_read on public.faculty_attendance;
create policy faculty_attendance_admin_read
on public.faculty_attendance
for select
using (public.current_user_role() = 'admin' or auth.uid() = faculty_user_id);

drop policy if exists faculty_attendance_admin_manage on public.faculty_attendance;
create policy faculty_attendance_admin_manage
on public.faculty_attendance
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');
