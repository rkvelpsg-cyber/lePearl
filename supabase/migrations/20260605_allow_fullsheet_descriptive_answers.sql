-- Migration: Allow full-sheet descriptive answer submissions without a specific question_id
-- When faculty creates a descriptive test with only a question paper (no individual questions added),
-- students upload one combined PDF for the whole test, which must be stored without question_id.

-- 1. Make question_id nullable (FK still enforced when not null — PostgreSQL allows NULL FK values)
alter table public.descriptive_student_answers
  alter column question_id drop not null;

-- 2. Drop the old UNIQUE constraint (cannot include nullable column reliably with a plain unique constraint)
alter table public.descriptive_student_answers
  drop constraint if exists unique_descriptive_answer;

-- 3. Re-create as two partial unique indexes:
--    a) For per-question answers (question_id IS NOT NULL) — same semantics as before
create unique index if not exists unique_descriptive_answer_with_question
  on public.descriptive_student_answers (mock_test_id, student_user_id, question_id)
  where question_id is not null;

--    b) For full-sheet answers (question_id IS NULL) — one row per student per test
create unique index if not exists unique_descriptive_answer_full_sheet
  on public.descriptive_student_answers (mock_test_id, student_user_id)
  where question_id is null;
