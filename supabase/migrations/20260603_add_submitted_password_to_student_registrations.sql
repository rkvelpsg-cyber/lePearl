alter table public.student_registrations
  add column if not exists submitted_password text;