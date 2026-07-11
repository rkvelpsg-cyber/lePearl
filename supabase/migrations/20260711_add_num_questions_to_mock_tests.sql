-- Add num_questions column to mock_tests for descriptive tests.
-- For MCQ tests the actual count comes from mcq_questions; for descriptive
-- tests the faculty declares the total number of questions at creation time.

alter table public.mock_tests
  add column if not exists num_questions integer check (num_questions is null or num_questions > 0);
