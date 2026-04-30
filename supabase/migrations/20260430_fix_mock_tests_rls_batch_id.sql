-- ============================================================
-- Fix mock_tests RLS: allow students to read tests assigned to
-- their specific batch (batch_id match), not just by course_id.
-- ============================================================

drop policy if exists mock_tests_role_read on public.mock_tests;
create policy mock_tests_role_read
on public.mock_tests
for select
using (
  public.current_user_role() = 'admin'
  or public.current_user_role() = 'faculty'
  or (
    -- Test assigned directly to a batch the student is enrolled in
    mock_tests.batch_id is not null
    and exists (
      select 1 from public.enrollments e
      where e.student_user_id = auth.uid()
      and e.batch_id = mock_tests.batch_id
    )
  )
  or (
    -- Fallback: test has no batch_id but matches student's enrolled course
    mock_tests.batch_id is null
    and exists (
      select 1
      from public.enrollments e
      join public.batches b on b.id = e.batch_id
      where e.student_user_id = auth.uid()
      and b.course_id = mock_tests.course_id
    )
  )
);
