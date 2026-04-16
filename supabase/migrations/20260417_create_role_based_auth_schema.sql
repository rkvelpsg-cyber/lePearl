-- Supabase role-based auth schema for LePearl login portal.

create extension if not exists pgcrypto;

-- Shared role enum used across profile and domain tables.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'faculty', 'admin');
  end if;
end
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles (user_id) on delete cascade,
  registration_no text not null unique,
  target_exam text,
  joined_on date,
  guardian_name text,
  guardian_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faculty_profiles (
  user_id uuid primary key references public.profiles (user_id) on delete cascade,
  employee_code text not null unique,
  department text,
  designation text,
  specialization text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references public.profiles (user_id) on delete cascade,
  employee_code text not null unique,
  access_level text not null default 'super_admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id bigserial primary key,
  code text not null unique,
  title text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id bigserial primary key,
  course_id bigint not null references public.courses (id) on delete cascade,
  batch_name text not null,
  faculty_user_id uuid references public.profiles (user_id) on delete set null,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  unique (course_id, batch_name)
);

create table if not exists public.enrollments (
  id bigserial primary key,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  batch_id bigint not null references public.batches (id) on delete cascade,
  enrolled_on date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (student_user_id, batch_id)
);

create table if not exists public.class_sessions (
  id bigserial primary key,
  batch_id bigint not null references public.batches (id) on delete cascade,
  title text not null,
  session_date date not null,
  start_time time,
  end_time time,
  meeting_link text,
  created_by uuid not null references public.profiles (user_id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.student_attendance (
  id bigserial primary key,
  session_id bigint not null references public.class_sessions (id) on delete cascade,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'late')),
  marked_by uuid not null references public.profiles (user_id) on delete restrict,
  marked_at timestamptz not null default now(),
  unique (session_id, student_user_id)
);

create table if not exists public.mock_tests (
  id bigserial primary key,
  course_id bigint not null references public.courses (id) on delete cascade,
  title text not null,
  total_marks integer not null check (total_marks > 0),
  scheduled_at timestamptz,
  created_by uuid not null references public.profiles (user_id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.mock_test_attempts (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests (id) on delete cascade,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  scored_marks numeric(6,2) not null check (scored_marks >= 0),
  attempted_at timestamptz not null default now(),
  unique (mock_test_id, student_user_id)
);

create table if not exists public.payments (
  id bigserial primary key,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  payment_date date not null default current_date,
  payment_mode text,
  reference_no text,
  status text not null default 'paid',
  created_by uuid references public.profiles (user_id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id bigserial primary key,
  actor_user_id uuid references public.profiles (user_id) on delete set null,
  actor_role public.user_role,
  action text not null,
  entity_name text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_faculty_profiles_updated_at on public.faculty_profiles;
create trigger trg_faculty_profiles_updated_at
before update on public.faculty_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_admin_profiles_updated_at on public.admin_profiles;
create trigger trg_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
as $$
  select role
  from public.profiles
  where user_id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.faculty_profiles enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.enrollments enable row level security;
alter table public.class_sessions enable row level security;
alter table public.student_attendance enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_test_attempts enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles: owner can read own row, admin can manage all.
drop policy if exists profiles_read_own_or_admin on public.profiles;
create policy profiles_read_own_or_admin
on public.profiles
for select
using (auth.uid() = user_id or public.current_user_role() = 'admin');

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
on public.profiles
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists student_profiles_read_own_or_admin on public.student_profiles;
create policy student_profiles_read_own_or_admin
on public.student_profiles
for select
using (auth.uid() = user_id or public.current_user_role() = 'admin');

drop policy if exists student_profiles_admin_manage on public.student_profiles;
create policy student_profiles_admin_manage
on public.student_profiles
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists faculty_profiles_read_own_or_admin on public.faculty_profiles;
create policy faculty_profiles_read_own_or_admin
on public.faculty_profiles
for select
using (auth.uid() = user_id or public.current_user_role() = 'admin');

drop policy if exists faculty_profiles_admin_manage on public.faculty_profiles;
create policy faculty_profiles_admin_manage
on public.faculty_profiles
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists admin_profiles_admin_only on public.admin_profiles;
create policy admin_profiles_admin_only
on public.admin_profiles
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Shared catalog tables: authenticated users can read. Admin manages.
drop policy if exists courses_authenticated_read on public.courses;
create policy courses_authenticated_read
on public.courses
for select
to authenticated
using (true);

drop policy if exists courses_admin_manage on public.courses;
create policy courses_admin_manage
on public.courses
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists batches_authenticated_read on public.batches;
create policy batches_authenticated_read
on public.batches
for select
to authenticated
using (true);

drop policy if exists batches_admin_manage on public.batches;
create policy batches_admin_manage
on public.batches
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Enrollments: student sees own, faculty sees their batch, admin sees all.
drop policy if exists enrollments_role_read on public.enrollments;
create policy enrollments_role_read
on public.enrollments
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.batches b
      where b.id = enrollments.batch_id
      and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists enrollments_admin_manage on public.enrollments;
create policy enrollments_admin_manage
on public.enrollments
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists class_sessions_role_read on public.class_sessions;
create policy class_sessions_role_read
on public.class_sessions
for select
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.batches b
    where b.id = class_sessions.batch_id
    and (
      b.faculty_user_id = auth.uid()
      or exists (
        select 1
        from public.enrollments e
        where e.batch_id = b.id
        and e.student_user_id = auth.uid()
      )
    )
  )
);

drop policy if exists class_sessions_faculty_insert on public.class_sessions;
create policy class_sessions_faculty_insert
on public.class_sessions
for insert
with check (
  public.current_user_role() in ('faculty', 'admin')
);

drop policy if exists class_sessions_faculty_update on public.class_sessions;
create policy class_sessions_faculty_update
on public.class_sessions
for update
using (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.batches b
      where b.id = class_sessions.batch_id
      and b.faculty_user_id = auth.uid()
    )
  )
)
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.batches b
      where b.id = class_sessions.batch_id
      and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists student_attendance_role_read on public.student_attendance;
create policy student_attendance_role_read
on public.student_attendance
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists student_attendance_faculty_manage on public.student_attendance;
create policy student_attendance_faculty_manage
on public.student_attendance
for all
using (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
    )
  )
)
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists mock_tests_role_read on public.mock_tests;
create policy mock_tests_role_read
on public.mock_tests
for select
using (
  public.current_user_role() = 'admin'
  or public.current_user_role() = 'faculty'
  or exists (
    select 1
    from public.enrollments e
    join public.batches b on b.id = e.batch_id
    where e.student_user_id = auth.uid()
    and b.course_id = mock_tests.course_id
  )
);

drop policy if exists mock_tests_faculty_admin_manage on public.mock_tests;
create policy mock_tests_faculty_admin_manage
on public.mock_tests
for all
using (public.current_user_role() in ('faculty', 'admin'))
with check (public.current_user_role() in ('faculty', 'admin'));

drop policy if exists mock_attempts_role_read on public.mock_test_attempts;
create policy mock_attempts_role_read
on public.mock_test_attempts
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() = 'admin'
  or public.current_user_role() = 'faculty'
);

drop policy if exists mock_attempts_student_insert on public.mock_test_attempts;
create policy mock_attempts_student_insert
on public.mock_test_attempts
for insert
with check (
  public.current_user_role() = 'student'
  and student_user_id = auth.uid()
);

drop policy if exists payments_role_read on public.payments;
create policy payments_role_read
on public.payments
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() = 'admin'
  or public.current_user_role() = 'faculty'
);

drop policy if exists payments_admin_manage on public.payments;
create policy payments_admin_manage
on public.payments
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists activity_logs_admin_read on public.activity_logs;
create policy activity_logs_admin_read
on public.activity_logs
for select
using (public.current_user_role() = 'admin');

drop policy if exists activity_logs_system_insert on public.activity_logs;
create policy activity_logs_system_insert
on public.activity_logs
for insert
with check (true);
