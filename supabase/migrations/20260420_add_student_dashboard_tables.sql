-- Student dashboard-specific data model additions.
-- Keeps analytics and fee planning explicit instead of overloading transactional tables.

create table if not exists public.student_fee_plans (
  id bigserial primary key,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  total_fee numeric(12,2) not null check (total_fee > 0),
  next_due_amount numeric(12,2) not null check (next_due_amount >= 0),
  next_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_user_id)
);

create table if not exists public.student_course_progress (
  id bigserial primary key,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  course_id bigint not null references public.courses (id) on delete cascade,
  instructor_name text,
  duration_label text,
  exam_label text,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_user_id, course_id)
);

alter table public.student_fee_plans enable row level security;
alter table public.student_course_progress enable row level security;

drop trigger if exists trg_student_fee_plans_updated_at on public.student_fee_plans;
create trigger trg_student_fee_plans_updated_at
before update on public.student_fee_plans
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_course_progress_updated_at on public.student_course_progress;
create trigger trg_student_course_progress_updated_at
before update on public.student_course_progress
for each row execute function public.set_updated_at();

drop policy if exists student_fee_plans_role_read on public.student_fee_plans;
create policy student_fee_plans_role_read
on public.student_fee_plans
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() in ('faculty', 'admin')
);

drop policy if exists student_fee_plans_admin_manage on public.student_fee_plans;
create policy student_fee_plans_admin_manage
on public.student_fee_plans
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists student_course_progress_role_read on public.student_course_progress;
create policy student_course_progress_role_read
on public.student_course_progress
for select
using (
  student_user_id = auth.uid()
  or public.current_user_role() in ('faculty', 'admin')
);

drop policy if exists student_course_progress_faculty_admin_manage on public.student_course_progress;
create policy student_course_progress_faculty_admin_manage
on public.student_course_progress
for all
using (public.current_user_role() in ('faculty', 'admin'))
with check (public.current_user_role() in ('faculty', 'admin'));
