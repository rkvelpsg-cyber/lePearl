-- ============================================================
-- Faculty RLS policies for descriptive tests and student profiles
-- ============================================================

-- Allow faculty to read student profiles (needed to display names in evaluation)
drop policy if exists student_profiles_faculty_read on public.student_profiles;
create policy student_profiles_faculty_read
on public.student_profiles
for select
using (public.current_user_role() = 'faculty');

-- Enable RLS on descriptive_questions (if not already enabled)
alter table public.descriptive_questions enable row level security;

-- All authenticated users can read descriptive questions (students take tests, faculty evaluate)
drop policy if exists descriptive_questions_authenticated_read on public.descriptive_questions;
create policy descriptive_questions_authenticated_read
on public.descriptive_questions
for select
using (auth.role() = 'authenticated');

-- Admin can manage descriptive questions
drop policy if exists descriptive_questions_admin_manage on public.descriptive_questions;
create policy descriptive_questions_admin_manage
on public.descriptive_questions
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

-- Enable RLS on descriptive_student_answers (if not already enabled)
alter table public.descriptive_student_answers enable row level security;

-- Faculty and admin can read all descriptive student answers (to evaluate)
drop policy if exists descriptive_answers_faculty_admin_read on public.descriptive_student_answers;
create policy descriptive_answers_faculty_admin_read
on public.descriptive_student_answers
for select
using (public.current_user_role() in ('faculty', 'admin'));

-- Students can read their own answers
drop policy if exists descriptive_answers_student_read_own on public.descriptive_student_answers;
create policy descriptive_answers_student_read_own
on public.descriptive_student_answers
for select
using (auth.uid() = student_user_id);

-- Students can insert their own answers
drop policy if exists descriptive_answers_student_insert on public.descriptive_student_answers;
create policy descriptive_answers_student_insert
on public.descriptive_student_answers
for insert
with check (auth.uid() = student_user_id);

-- Students can update their own answers (resubmit before deadline)
drop policy if exists descriptive_answers_student_update on public.descriptive_student_answers;
create policy descriptive_answers_student_update
on public.descriptive_student_answers
for update
using (auth.uid() = student_user_id)
with check (auth.uid() = student_user_id);

-- Faculty and admin can update answers for grading (marks_obtained, faculty_notes, evaluated_at)
drop policy if exists descriptive_answers_faculty_grade on public.descriptive_student_answers;
create policy descriptive_answers_faculty_grade
on public.descriptive_student_answers
for update
using (public.current_user_role() in ('faculty', 'admin'))
with check (public.current_user_role() in ('faculty', 'admin'));
