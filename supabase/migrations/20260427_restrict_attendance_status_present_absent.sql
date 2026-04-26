-- Enforce two-state attendance only: present or absent.
-- 1) Normalize existing 'late' records to 'absent'.
-- 2) Replace status check constraint to block future 'late' inserts/updates.

update public.student_attendance
set status = 'absent'
where status = 'late';

alter table public.student_attendance
drop constraint if exists student_attendance_status_check;

alter table public.student_attendance
add constraint student_attendance_status_check
check (status in ('present', 'absent'));
