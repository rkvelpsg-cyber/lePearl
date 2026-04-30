-- ============================================================
-- Fix Storage RLS for descriptive test submissions
-- ============================================================

-- Ensure bucket exists
insert into storage.buckets (id, name, public)
values ('test-submissions', 'test-submissions', true)
on conflict (id) do nothing;

-- Students can upload only to their own path:
-- descriptive/{mock_test_id}/{student_user_id}/{question_or_full}/file.pdf

drop policy if exists test_submissions_student_insert on storage.objects;
create policy test_submissions_student_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'test-submissions'
  and (storage.foldername(name))[1] = 'descriptive'
  and (storage.foldername(name))[3] = auth.uid()::text
);

drop policy if exists test_submissions_student_update on storage.objects;
create policy test_submissions_student_update on storage.objects
for update to authenticated
using (
  bucket_id = 'test-submissions'
  and (storage.foldername(name))[1] = 'descriptive'
  and (storage.foldername(name))[3] = auth.uid()::text
)
with check (
  bucket_id = 'test-submissions'
  and (storage.foldername(name))[1] = 'descriptive'
  and (storage.foldername(name))[3] = auth.uid()::text
);

drop policy if exists test_submissions_student_select on storage.objects;
create policy test_submissions_student_select on storage.objects
for select to authenticated
using (
  bucket_id = 'test-submissions'
  and (
    (storage.foldername(name))[1] = 'descriptive'
    and (storage.foldername(name))[3] = auth.uid()::text
  )
);

-- Optional: faculty/admin can read all descriptive submissions
-- (uses app helper function current_user_role available in public schema)
drop policy if exists test_submissions_faculty_admin_read on storage.objects;
create policy test_submissions_faculty_admin_read on storage.objects
for select to authenticated
using (
  bucket_id = 'test-submissions'
  and (storage.foldername(name))[1] = 'descriptive'
  and public.current_user_role() in ('faculty', 'admin')
);
