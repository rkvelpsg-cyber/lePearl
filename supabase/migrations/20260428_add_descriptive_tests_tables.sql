-- Create tables for Descriptive Tests support
-- Adds tables to track descriptive test questions and student submissions

-- Add test_type column to mock_tests if it doesn't exist (to differentiate MCQ vs Descriptive)
-- Note: exam_type already exists; we'll use a new 'test_type' to distinguish MCQ vs Descriptive

alter table public.mock_tests
add column if not exists test_type text not null default 'mcq' check (test_type in ('mcq', 'descriptive'));

-- Descriptive test questions table
create table if not exists public.descriptive_questions (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests (id) on delete cascade,
  question_text text not null,
  marks integer not null check (marks > 0),
  question_order integer not null default 1,
  category text, -- e.g., "History", "Geography" - for filtering
  created_at timestamptz not null default now(),
  constraint unique_order_per_test unique (mock_test_id, question_order)
);

-- Student descriptive answers (submissions)
create table if not exists public.descriptive_student_answers (
  id bigserial primary key,
  mock_test_id bigint not null references public.mock_tests (id) on delete cascade,
  student_user_id uuid not null references public.student_profiles (user_id) on delete cascade,
  question_id bigint not null references public.descriptive_questions (id) on delete cascade,
  answer_file_url text, -- URL to uploaded scanned answer PDF/image
  submitted_at timestamptz,
  marks_obtained integer,
  faculty_notes text,
  evaluated_at timestamptz,
  constraint unique_descriptive_answer unique (mock_test_id, student_user_id, question_id)
);

-- Create indexes for performance
create index if not exists idx_descriptive_questions_mock_test on public.descriptive_questions(mock_test_id);
create index if not exists idx_descriptive_answers_mock_test on public.descriptive_student_answers(mock_test_id);
create index if not exists idx_descriptive_answers_student on public.descriptive_student_answers(student_user_id);
