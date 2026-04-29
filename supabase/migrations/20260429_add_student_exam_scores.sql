-- ============================================================
-- Student Exam Scores Table
-- Stores faculty-entered MCQ and Descriptive scores per student per test
-- ============================================================

create table if not exists public.student_mock_test_scores (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests (id) on delete cascade,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  mcq_score numeric(6, 2) default null,
  descriptive_score numeric(6, 2) default null,
  entered_by uuid references public.profiles (user_id) on delete set null,
  updated_at timestamptz not null default now (),
  constraint unique_student_test_score unique (mock_test_id, student_user_id)
);

create index if not exists idx_student_test_scores_student on public.student_mock_test_scores (student_user_id);
create index if not exists idx_student_test_scores_test on public.student_mock_test_scores (mock_test_id);

-- RLS
alter table public.student_mock_test_scores enable row level security;

-- Faculty / admin can manage all scores
drop policy if exists smts_faculty_manage on public.student_mock_test_scores;
create policy smts_faculty_manage on public.student_mock_test_scores
  for all using (
    public.current_user_role () in ('faculty', 'admin')
  )
  with check (
    public.current_user_role () in ('faculty', 'admin')
  );

-- Students can read only their own scores
drop policy if exists smts_student_read on public.student_mock_test_scores;
create policy smts_student_read on public.student_mock_test_scores
  for select to authenticated using (student_user_id = auth.uid ());
