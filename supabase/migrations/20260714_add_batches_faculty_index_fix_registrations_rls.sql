-- Add index on batches.faculty_user_id for efficient admin dashboard
-- faculty batch count computation.
create index if not exists idx_batches_faculty_user_id
  on public.batches (faculty_user_id);

-- Fix student_registrations RLS so students can only read their own
-- registration rows (matched by profiles.email or student_profiles.registration_no).
-- Admins and faculty can still read all registrations.
-- The public INSERT policy is kept as-is (registration form is public).

drop policy if exists "Allow admin to view registrations" on public.student_registrations;

create policy "registrations_scoped_read"
  on public.student_registrations
  for select
  using (
    -- Admin and faculty see all rows
    public.current_user_role() in ('admin', 'faculty')
    -- Students see only their own registrations matched by contact email
    or (
      public.current_user_role() = 'student'
      and email = (
        select p.email
        from public.profiles p
        where p.user_id = auth.uid()
        limit 1
      )
    )
    -- Students see registrations matched by registration number
    or (
      public.current_user_role() = 'student'
      and registration_no = (
        select sp.registration_no
        from public.student_profiles sp
        where sp.user_id = auth.uid()
        limit 1
      )
    )
  );
