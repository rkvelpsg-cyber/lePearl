-- ============================================================
-- Fix descriptive_questions RLS for faculty inserts/updates
-- ============================================================

-- Faculty and admin should be able to create/manage descriptive questions.
drop policy if exists descriptive_questions_admin_manage on public.descriptive_questions;
drop policy if exists descriptive_questions_faculty_admin_manage on public.descriptive_questions;

create policy descriptive_questions_faculty_admin_manage
on public.descriptive_questions
for all
using (public.current_user_role() in ('faculty', 'admin'))
with check (public.current_user_role() in ('faculty', 'admin'));
