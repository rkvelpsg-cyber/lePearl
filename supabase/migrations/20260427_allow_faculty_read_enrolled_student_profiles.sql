-- Allow faculty to read profile names of students enrolled in their own batches.
-- This is required for attendance and student lists to show actual student names.

drop policy if exists profiles_faculty_read_enrolled_students on public.profiles;
create policy profiles_faculty_read_enrolled_students
on public.profiles
for select
using (
  public.current_user_role() = 'faculty'
  and exists (
    select 1
    from public.enrollments e
    join public.batches b on b.id = e.batch_id
    where e.student_user_id = profiles.user_id
      and b.faculty_user_id = auth.uid()
  )
);
