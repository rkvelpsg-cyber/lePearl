-- RLS Policies for Descriptive Tests
-- NOTE: Use mt.course_id joins so this works on schemas where mock_tests.batch_id is not present.

drop policy if exists descriptive_questions_faculty_read on public.descriptive_questions;
create policy descriptive_questions_faculty_read on public.descriptive_questions
for select using (
  current_user_role() = 'admin' or (
    current_user_role() = 'faculty' and exists (
      select 1
      from mock_tests mt
      join batches b on b.course_id = mt.course_id
      where mt.id = mock_test_id
        and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists descriptive_questions_student_read on public.descriptive_questions;
create policy descriptive_questions_student_read on public.descriptive_questions
for select using (
  current_user_role() = 'student' and exists (
    select 1
    from mock_tests mt
    where mt.id = mock_test_id
      and (mt.scheduled_at is null or mt.scheduled_at <= now())
      and exists (
        select 1
        from enrollments e
        join batches b on b.id = e.batch_id
        where e.student_user_id = auth.uid()
          and b.course_id = mt.course_id
      )
  )
);

drop policy if exists descriptive_student_answers_insert on public.descriptive_student_answers;
create policy descriptive_student_answers_insert on public.descriptive_student_answers
for insert with check (
  current_user_role() = 'student'
  and student_user_id = auth.uid()
  and exists (
    select 1
    from descriptive_questions dq
    join mock_tests mt on mt.id = dq.mock_test_id
    where dq.id = question_id
      and (mt.scheduled_at is null or mt.scheduled_at <= now())
      and exists (
        select 1
        from enrollments e
        join batches b on b.id = e.batch_id
        where e.student_user_id = auth.uid()
          and b.course_id = mt.course_id
      )
  )
);

drop policy if exists descriptive_student_answers_update on public.descriptive_student_answers;
create policy descriptive_student_answers_update on public.descriptive_student_answers
for update using (
  current_user_role() = 'student' and student_user_id = auth.uid()
) with check (
  current_user_role() = 'student' and student_user_id = auth.uid()
);

drop policy if exists descriptive_student_answers_faculty_read on public.descriptive_student_answers;
create policy descriptive_student_answers_faculty_read on public.descriptive_student_answers
for select using (
  current_user_role() = 'admin' or (
    current_user_role() = 'faculty' and exists (
      select 1
      from descriptive_questions dq
      join mock_tests mt on mt.id = dq.mock_test_id
      join batches b on b.course_id = mt.course_id
      where dq.id = question_id
        and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists descriptive_student_answers_faculty_update on public.descriptive_student_answers;
create policy descriptive_student_answers_faculty_update on public.descriptive_student_answers
for update using (
  current_user_role() = 'admin' or (
    current_user_role() = 'faculty' and exists (
      select 1
      from descriptive_questions dq
      join mock_tests mt on mt.id = dq.mock_test_id
      join batches b on b.course_id = mt.course_id
      where dq.id = question_id
        and b.faculty_user_id = auth.uid()
    )
  )
) with check (
  current_user_role() = 'admin' or (
    current_user_role() = 'faculty' and exists (
      select 1
      from descriptive_questions dq
      join mock_tests mt on mt.id = dq.mock_test_id
      join batches b on b.course_id = mt.course_id
      where dq.id = question_id
        and b.faculty_user_id = auth.uid()
    )
  )
);
