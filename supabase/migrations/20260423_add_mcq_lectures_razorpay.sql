-- ============================================================
-- MCQ Questions, Recorded Lectures, Razorpay columns
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── 1. Extend mock_tests ────────────────────────────────────
alter table public.mock_tests
  add column if not exists time_limit_minutes integer not null default 60,
  add column if not exists batch_id bigint references public.batches(id) on delete set null,
  add column if not exists is_published boolean not null default false,
  add column if not exists exam_type text not null default 'mock'
    check (exam_type in ('mock','original'));

-- ─── 2. MCQ questions ────────────────────────────────────────
create table if not exists public.mcq_questions (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests(id) on delete cascade,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option char(1) not null check (correct_option in ('A','B','C','D')),
  marks integer not null default 1 check (marks > 0),
  question_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- ─── 3. Student MCQ answers ───────────────────────────────────
create table if not exists public.mcq_student_answers (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests(id) on delete cascade,
  student_user_id uuid not null references public.student_profiles(user_id) on delete cascade,
  question_id bigint not null references public.mcq_questions(id) on delete cascade,
  chosen_option char(1) check (chosen_option in ('A','B','C','D')),
  is_correct boolean,
  created_at timestamptz not null default now(),
  unique (mock_test_id, student_user_id, question_id)
);

-- ─── 4. Recorded lectures ─────────────────────────────────────
create table if not exists public.recorded_lectures (
  id bigserial primary key,
  batch_id bigint references public.batches(id) on delete cascade,
  faculty_user_id uuid references public.profiles(user_id) on delete set null,
  title text not null,
  description text,
  subject text,
  drive_link text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 5. Extend class_sessions with is_live ───────────────────
alter table public.class_sessions
  add column if not exists is_live boolean not null default false;

-- ─── 6. Extend payments for Razorpay ─────────────────────────
alter table public.payments
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text,
  add column if not exists description text;

-- ─── 7. RLS ──────────────────────────────────────────────────
alter table public.mcq_questions enable row level security;
alter table public.mcq_student_answers enable row level security;
alter table public.recorded_lectures enable row level security;

-- mcq_questions: all authenticated can read published tests; faculty/admin manage
drop policy if exists mcq_questions_read on public.mcq_questions;
create policy mcq_questions_read on public.mcq_questions
  for select to authenticated using (true);

drop policy if exists mcq_questions_faculty_manage on public.mcq_questions;
create policy mcq_questions_faculty_manage on public.mcq_questions
  for all
  using (public.current_user_role() in ('faculty','admin'))
  with check (public.current_user_role() in ('faculty','admin'));

-- mcq_student_answers: student sees own; faculty/admin see all
drop policy if exists mcq_student_answers_read on public.mcq_student_answers;
create policy mcq_student_answers_read on public.mcq_student_answers
  for select
  using (
    student_user_id = auth.uid()
    or public.current_user_role() in ('faculty','admin')
  );

drop policy if exists mcq_student_answers_insert on public.mcq_student_answers;
create policy mcq_student_answers_insert on public.mcq_student_answers
  for insert
  with check (
    student_user_id = auth.uid()
    or public.current_user_role() in ('faculty','admin')
  );

-- recorded_lectures: authenticated can read active; faculty/admin manage
drop policy if exists recorded_lectures_read on public.recorded_lectures;
create policy recorded_lectures_read on public.recorded_lectures
  for select to authenticated using (is_active = true);

drop policy if exists recorded_lectures_faculty_manage on public.recorded_lectures;
create policy recorded_lectures_faculty_manage on public.recorded_lectures
  for all
  using (public.current_user_role() in ('faculty','admin'))
  with check (public.current_user_role() in ('faculty','admin'));

-- ─── 8. Trigger for recorded_lectures updated_at ─────────────
drop trigger if exists trg_recorded_lectures_updated_at on public.recorded_lectures;
create trigger trg_recorded_lectures_updated_at
  before update on public.recorded_lectures
  for each row execute function public.set_updated_at();

-- ─── 9. Update student_fee_plans policy (exclude faculty) ────
-- Faculty should NOT see fee details
drop policy if exists student_fee_plans_role_read on public.student_fee_plans;
create policy student_fee_plans_role_read on public.student_fee_plans
  for select
  using (
    student_user_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

-- ─── 10. Update payments policy (exclude faculty) ────────────
drop policy if exists payments_role_read on public.payments;
create policy payments_role_read on public.payments
  for select
  using (
    student_user_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

drop policy if exists payments_admin_manage on public.payments;
create policy payments_admin_manage on public.payments
  for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Allow students to insert their own payment records (after Razorpay verification)
drop policy if exists payments_student_insert on public.payments;
create policy payments_student_insert on public.payments
  for insert
  with check (
    student_user_id = auth.uid()
    or public.current_user_role() = 'admin'
  );
