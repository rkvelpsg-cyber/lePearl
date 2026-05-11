-- Add negative marking support for MCQ tests
-- negative_marking represents marks deducted per wrong answer.

alter table public.mock_tests
add column if not exists negative_marking numeric(6,2) not null default 0;

-- Ensure existing rows are initialized.
update public.mock_tests
set negative_marking = 0
where negative_marking is null;

comment on column public.mock_tests.negative_marking is 'Marks deducted per wrong answer in MCQ tests';

-- Allow negative total scored marks in case wrong answers exceed correct answers.
alter table public.mock_test_attempts
drop constraint if exists mock_test_attempts_scored_marks_check;

alter table public.mock_test_attempts
add constraint mock_test_attempts_scored_marks_check
check (scored_marks >= -9999);
