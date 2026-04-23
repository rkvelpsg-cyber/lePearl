-- ============================================================
-- Faculty Tasks table — allows faculty to assign tasks/homework
-- to individual students or an entire batch.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.faculty_tasks (
  id          bigserial primary key,
  faculty_user_id uuid not null references public.profiles (user_id) on delete cascade,
  batch_id    bigint references public.batches (id) on delete set null,
  -- null = task assigned to entire batch; non-null = individual student
  student_user_id uuid references public.student_profiles (user_id) on delete cascade,
  title       text not null,
  description text,
  due_date    date,
  -- faculty can control progress of each student's task
  status      text not null default 'pending'
                check (status in ('pending', 'submitted', 'reviewed', 'completed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.faculty_tasks enable row level security;

drop trigger if exists trg_faculty_tasks_updated_at on public.faculty_tasks;
create trigger trg_faculty_tasks_updated_at
before update on public.faculty_tasks
for each row execute function public.set_updated_at();

-- Faculty can see and manage tasks they created
drop policy if exists faculty_tasks_faculty_manage on public.faculty_tasks;
create policy faculty_tasks_faculty_manage
on public.faculty_tasks
for all
using (faculty_user_id = auth.uid() or public.current_user_role() = 'admin')
with check (faculty_user_id = auth.uid() or public.current_user_role() = 'admin');

-- Students can see tasks assigned to them (individually or via batch)
drop policy if exists faculty_tasks_student_read on public.faculty_tasks;
create policy faculty_tasks_student_read
on public.faculty_tasks
for select
using (
  student_user_id = auth.uid()
  or (
    student_user_id is null
    and batch_id in (
      select batch_id from public.enrollments where student_user_id = auth.uid()
    )
  )
  or public.current_user_role() in ('faculty', 'admin')
);
