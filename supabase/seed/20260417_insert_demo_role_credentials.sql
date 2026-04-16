-- Demo credentials for login portal roles:
-- student@lepearl.education / Student@123
-- faculty@lepearl.education / Faculty@123
-- admin@lepearl.education / Admin@123

create extension if not exists pgcrypto;

-- Deterministic UUIDs make local/dev resets repeatable.
with seed_users as (
  select
    '11111111-1111-1111-1111-111111111111'::uuid as id,
    'student@lepearl.education'::text as email,
    'Student Test User'::text as full_name,
    'student'::public.user_role as role,
    'Student@123'::text as plain_password
  union all
  select
    '22222222-2222-2222-2222-222222222222'::uuid,
    'faculty@lepearl.education',
    'Faculty Test User',
    'faculty'::public.user_role,
    'Faculty@123'
  union all
  select
    '33333333-3333-3333-3333-333333333333'::uuid,
    'admin@lepearl.education',
    'Admin Test User',
    'admin'::public.user_role,
    'Admin@123'
)
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
select
  s.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  s.email,
  crypt(s.plain_password, gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', s.role::text),
  jsonb_build_object('full_name', s.full_name),
  now(),
  now(),
  '',
  '',
  '',
  ''
from seed_users s
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into public.profiles (user_id, role, full_name, phone, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'student', 'Student Test User', '+91-9000000001', true),
  ('22222222-2222-2222-2222-222222222222', 'faculty', 'Faculty Test User', '+91-9000000002', true),
  ('33333333-3333-3333-3333-333333333333', 'admin', 'Admin Test User', '+91-9000000003', true)
on conflict (user_id) do update
set
  role = excluded.role,
  full_name = excluded.full_name,
  phone = excluded.phone,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.student_profiles (
  user_id,
  registration_no,
  target_exam,
  joined_on,
  guardian_name,
  guardian_phone
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'NTA-2026-0001',
    'UGC NET English',
    current_date,
    'Parent Test User',
    '+91-9000000011'
  )
on conflict (user_id) do update
set
  registration_no = excluded.registration_no,
  target_exam = excluded.target_exam,
  guardian_name = excluded.guardian_name,
  guardian_phone = excluded.guardian_phone,
  updated_at = now();

insert into public.faculty_profiles (
  user_id,
  employee_code,
  department,
  designation,
  specialization
)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'FAC-0001',
    'English',
    'Assistant Professor',
    'Literary Theory'
  )
on conflict (user_id) do update
set
  employee_code = excluded.employee_code,
  department = excluded.department,
  designation = excluded.designation,
  specialization = excluded.specialization,
  updated_at = now();

insert into public.admin_profiles (
  user_id,
  employee_code,
  access_level
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    'ADM-0001',
    'super_admin'
  )
on conflict (user_id) do update
set
  employee_code = excluded.employee_code,
  access_level = excluded.access_level,
  updated_at = now();

insert into public.courses (code, title, is_active)
values
  ('NET-P1', 'NTA NET Paper 1', true),
  ('NET-P2-ENG', 'NTA NET Paper 2 (English)', true)
on conflict (code) do update
set
  title = excluded.title,
  is_active = excluded.is_active;

insert into public.batches (course_id, batch_name, faculty_user_id, start_date, end_date)
select
  c.id,
  case when c.code = 'NET-P1' then 'NET-P1-Morning' else 'NET-P2-Evening' end,
  '22222222-2222-2222-2222-222222222222'::uuid,
  current_date,
  current_date + interval '180 day'
from public.courses c
where c.code in ('NET-P1', 'NET-P2-ENG')
on conflict (course_id, batch_name) do nothing;

insert into public.enrollments (student_user_id, batch_id, enrolled_on, status)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  b.id,
  current_date,
  'active'
from public.batches b
on conflict (student_user_id, batch_id) do nothing;
