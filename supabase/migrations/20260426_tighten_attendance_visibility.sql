-- Tighten attendance visibility and faculty write access.
-- Admin can see/manage all attendance.
-- Students can read only their own attendance for batches they are enrolled in.
-- Faculty can read/write attendance only for students enrolled in their assigned batches.

drop policy if exists class_sessions_faculty_insert on public.class_sessions;
create policy class_sessions_faculty_insert
on public.class_sessions
for insert
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.batches b
      where b.id = class_sessions.batch_id
      and b.faculty_user_id = auth.uid()
    )
  )
);

drop policy if exists student_attendance_role_read on public.student_attendance;
create policy student_attendance_role_read
on public.student_attendance
for select
using (
  public.current_user_role() = 'admin'
  or (
    student_user_id = auth.uid()
    and exists (
      select 1
      from public.class_sessions cs
      join public.enrollments e on e.batch_id = cs.batch_id
      where cs.id = student_attendance.session_id
      and e.student_user_id = auth.uid()
    )
  )
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      join public.enrollments e on e.batch_id = b.id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
      and e.student_user_id = student_attendance.student_user_id
    )
  )
);

drop policy if exists student_attendance_faculty_manage on public.student_attendance;
create policy student_attendance_faculty_manage
on public.student_attendance
for all
using (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      join public.enrollments e on e.batch_id = b.id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
      and e.student_user_id = student_attendance.student_user_id
    )
  )
)
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'faculty'
    and exists (
      select 1
      from public.class_sessions cs
      join public.batches b on b.id = cs.batch_id
      join public.enrollments e on e.batch_id = b.id
      where cs.id = student_attendance.session_id
      and b.faculty_user_id = auth.uid()
      and e.student_user_id = student_attendance.student_user_id
    )
  )
);