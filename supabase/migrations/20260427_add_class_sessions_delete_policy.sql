-- Add DELETE RLS policy for class_sessions table
-- Allows faculty to delete their own class sessions and admins to delete any

drop policy if exists class_sessions_faculty_delete on public.class_sessions;

create policy class_sessions_faculty_delete
on public.class_sessions
for delete
using (
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
