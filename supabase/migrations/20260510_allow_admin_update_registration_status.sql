-- Allow admins to update student registration statuses and normalize legacy values.

update public.student_registrations
set status = 'completed'
where status = 'credentials_created';

drop policy if exists "Allow admin to update registrations" on public.student_registrations;
create policy "Allow admin to update registrations"
  on public.student_registrations
  for update
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
