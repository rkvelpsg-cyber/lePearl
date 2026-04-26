-- ============================================================
-- Replace demo students and map them to faculty-assigned batches
-- as requested.
--
-- Faculty mapping:
--   Ms. Sadhana            -> NET-P2-ENG-Eve
--   Dr. Babli Mallick      -> ASST-PROF-Wknd
--   Ms. Neelu Patel        -> NET-P2-POL-Eve
--   Dr. Harendra K Tripathi-> NET-P1-Morning
--
-- Note: Ramesh Yadav is intentionally mapped to two faculties
-- via two enrollments (ASST-PROF-Wknd and NET-P2-POL-Eve).
-- ============================================================

create extension if not exists pgcrypto;

-- 1) Keep faculty assignments deterministic.
update public.batches
set faculty_user_id = 'bbbb0001-0000-0000-0000-000000000001'
where batch_name in ('NET-P2-ENG-Eve', 'NET-P2-HIN-Mrng');

update public.batches
set faculty_user_id = 'bbbb0002-0000-0000-0000-000000000002'
where batch_name = 'ASST-PROF-Wknd';

update public.batches
set faculty_user_id = 'bbbb0003-0000-0000-0000-000000000003'
where batch_name in ('NET-P2-POL-Eve', 'NET-P2-HIS-Mrng');

update public.batches
set faculty_user_id = 'bbbb0004-0000-0000-0000-000000000004'
where batch_name in ('NET-P1-Morning', 'NET-P2-SOC-Eve');

-- 2) Remove previous demo students (legacy + this script's ids).
--    This keeps dashboard data replaced with the requested roster.
delete from auth.users
where id in (
  'aaaa0001-0000-0000-0000-000000000001'::uuid,
  'aaaa0002-0000-0000-0000-000000000002'::uuid,
  'aaaa0003-0000-0000-0000-000000000003'::uuid,
  'aaaa0004-0000-0000-0000-000000000004'::uuid,
  'aaaa0005-0000-0000-0000-000000000005'::uuid,
  'cccc0001-0000-0000-0000-000000000001'::uuid,
  'cccc0002-0000-0000-0000-000000000002'::uuid,
  'cccc0003-0000-0000-0000-000000000003'::uuid,
  'cccc0004-0000-0000-0000-000000000004'::uuid,
  'cccc0005-0000-0000-0000-000000000005'::uuid,
  'cccc0006-0000-0000-0000-000000000006'::uuid,
  'cccc0007-0000-0000-0000-000000000007'::uuid,
  'cccc0008-0000-0000-0000-000000000008'::uuid,
  'cccc0009-0000-0000-0000-000000000009'::uuid,
  'cccc0010-0000-0000-0000-000000000010'::uuid,
  'cccc0011-0000-0000-0000-000000000011'::uuid,
  'cccc0012-0000-0000-0000-000000000012'::uuid
);

-- 3) Insert requested students into auth.users.
with requested_students as (
  select * from (values
    ('cccc0001-0000-0000-0000-000000000001'::uuid, 'arjun.reddy@lepearl.education',      'Arjun Reddy',      'LpArjunReddy#2026!'),
    ('cccc0002-0000-0000-0000-000000000002'::uuid, 'neha.sharma@lepearl.education',      'Neha Sharma',      'LpNehaSharma#2026!'),
    ('cccc0003-0000-0000-0000-000000000003'::uuid, 'abhinav.goyal@lepearl.education',    'Abhinav Goyal',    'LpAbhinavGoyal#2026!'),
    ('cccc0004-0000-0000-0000-000000000004'::uuid, 'ramesh.yadav@lepearl.education',     'Ramesh Yadav',     'LpRameshYadav#2026!'),
    ('cccc0005-0000-0000-0000-000000000005'::uuid, 'veena@lepearl.education',             'Veena',            'LpVeena#2026!'),
    ('cccc0006-0000-0000-0000-000000000006'::uuid, 'anjali.rao@lepearl.education',        'Anjali Rao',       'LpAnjaliRao#2026!'),
    ('cccc0007-0000-0000-0000-000000000007'::uuid, 'meena.kulkarni@lepearl.education',    'Meena Kulkarni',   'LpMeenaKulkarni#2026!'),
    ('cccc0008-0000-0000-0000-000000000008'::uuid, 'ashwarya@lepearl.education',          'Ashwarya',         'LpAshwarya#2026!'),
    ('cccc0009-0000-0000-0000-000000000009'::uuid, 'krishna.patel@lepearl.education',     'Krishna Patel',    'LpKrishnaPatel#2026!'),
    ('cccc0010-0000-0000-0000-000000000010'::uuid, 'siva@lepearl.education',              'Siva',             'LpSiva#2026!'),
    ('cccc0011-0000-0000-0000-000000000011'::uuid, 'kumaresan@lepearl.education',         'Kumaresan',        'LpKumaresan#2026!'),
    ('cccc0012-0000-0000-0000-000000000012'::uuid, 'vishnu.sharma@lepearl.education',     'Vishnu Sharma',    'LpVishnuSharma#2026!')
  ) as t(id, email, full_name, plain_password)
)
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
select
  rs.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated',
  rs.email,
  crypt(rs.plain_password, gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', 'student'),
  jsonb_build_object('full_name', rs.full_name),
  now(), now(), '', '', '', ''
from requested_students rs
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

-- 4) Insert profiles.
insert into public.profiles (user_id, role, full_name, phone, is_active)
values
  ('cccc0001-0000-0000-0000-000000000001', 'student', 'Arjun Reddy',    '+91-9813000001', true),
  ('cccc0002-0000-0000-0000-000000000002', 'student', 'Neha Sharma',    '+91-9813000002', true),
  ('cccc0003-0000-0000-0000-000000000003', 'student', 'Abhinav Goyal',  '+91-9813000003', true),
  ('cccc0004-0000-0000-0000-000000000004', 'student', 'Ramesh Yadav',   '+91-9813000004', true),
  ('cccc0005-0000-0000-0000-000000000005', 'student', 'Veena',          '+91-9813000005', true),
  ('cccc0006-0000-0000-0000-000000000006', 'student', 'Anjali Rao',     '+91-9813000006', true),
  ('cccc0007-0000-0000-0000-000000000007', 'student', 'Meena Kulkarni', '+91-9813000007', true),
  ('cccc0008-0000-0000-0000-000000000008', 'student', 'Ashwarya',       '+91-9813000008', true),
  ('cccc0009-0000-0000-0000-000000000009', 'student', 'Krishna Patel',  '+91-9813000009', true),
  ('cccc0010-0000-0000-0000-000000000010', 'student', 'Siva',           '+91-9813000010', true),
  ('cccc0011-0000-0000-0000-000000000011', 'student', 'Kumaresan',      '+91-9813000011', true),
  ('cccc0012-0000-0000-0000-000000000012', 'student', 'Vishnu Sharma',  '+91-9813000012', true)
on conflict (user_id) do update
set
  role = excluded.role,
  full_name = excluded.full_name,
  phone = excluded.phone,
  is_active = excluded.is_active,
  updated_at = now();

-- 5) Insert student profiles (target exam/subject info replaced).
insert into public.student_profiles (
  user_id, registration_no, target_exam, joined_on, guardian_name, guardian_phone
)
values
  ('cccc0001-0000-0000-0000-000000000001', 'LPS-2026-001', 'UGC NET English',            current_date - interval '40 day', 'Reddy Guardian',     '+91-9824000001'),
  ('cccc0002-0000-0000-0000-000000000002', 'LPS-2026-002', 'UGC NET English',            current_date - interval '39 day', 'Sharma Guardian',    '+91-9824000002'),
  ('cccc0003-0000-0000-0000-000000000003', 'LPS-2026-003', 'UGC NET English',            current_date - interval '38 day', 'Goyal Guardian',     '+91-9824000003'),
  ('cccc0004-0000-0000-0000-000000000004', 'LPS-2026-004', 'Assistant Professor Prep',   current_date - interval '37 day', 'Yadav Guardian',     '+91-9824000004'),
  ('cccc0005-0000-0000-0000-000000000005', 'LPS-2026-005', 'Assistant Professor Prep',   current_date - interval '36 day', 'Veena Guardian',     '+91-9824000005'),
  ('cccc0006-0000-0000-0000-000000000006', 'LPS-2026-006', 'Assistant Professor Prep',   current_date - interval '35 day', 'Rao Guardian',       '+91-9824000006'),
  ('cccc0007-0000-0000-0000-000000000007', 'LPS-2026-007', 'Assistant Professor Prep',   current_date - interval '34 day', 'Kulkarni Guardian',  '+91-9824000007'),
  ('cccc0008-0000-0000-0000-000000000008', 'LPS-2026-008', 'UGC NET Political Science',  current_date - interval '33 day', 'Ashwarya Guardian',  '+91-9824000008'),
  ('cccc0009-0000-0000-0000-000000000009', 'LPS-2026-009', 'UGC NET Political Science',  current_date - interval '32 day', 'Patel Guardian',     '+91-9824000009'),
  ('cccc0010-0000-0000-0000-000000000010', 'LPS-2026-010', 'UGC NET Paper 1',            current_date - interval '31 day', 'Siva Guardian',      '+91-9824000010'),
  ('cccc0011-0000-0000-0000-000000000011', 'LPS-2026-011', 'UGC NET Paper 1',            current_date - interval '30 day', 'Kumaresan Guardian', '+91-9824000011'),
  ('cccc0012-0000-0000-0000-000000000012', 'LPS-2026-012', 'UGC NET Paper 1',            current_date - interval '29 day', 'Sharma Guardian',    '+91-9824000012')
on conflict (user_id) do update
set
  registration_no = excluded.registration_no,
  target_exam = excluded.target_exam,
  guardian_name = excluded.guardian_name,
  guardian_phone = excluded.guardian_phone,
  updated_at = now();

-- 6) Replace enrollments for these students and assign to respective faculty batches.
delete from public.enrollments
where student_user_id in (
  'cccc0001-0000-0000-0000-000000000001'::uuid,
  'cccc0002-0000-0000-0000-000000000002'::uuid,
  'cccc0003-0000-0000-0000-000000000003'::uuid,
  'cccc0004-0000-0000-0000-000000000004'::uuid,
  'cccc0005-0000-0000-0000-000000000005'::uuid,
  'cccc0006-0000-0000-0000-000000000006'::uuid,
  'cccc0007-0000-0000-0000-000000000007'::uuid,
  'cccc0008-0000-0000-0000-000000000008'::uuid,
  'cccc0009-0000-0000-0000-000000000009'::uuid,
  'cccc0010-0000-0000-0000-000000000010'::uuid,
  'cccc0011-0000-0000-0000-000000000011'::uuid,
  'cccc0012-0000-0000-0000-000000000012'::uuid
);

insert into public.enrollments (student_user_id, batch_id, enrolled_on, status)
select m.student_id, b.id, current_date - interval '28 day', 'active'
from (values
  -- Faculty Sadhana
  ('cccc0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-ENG-Eve'),
  ('cccc0002-0000-0000-0000-000000000002'::uuid, 'NET-P2-ENG-Eve'),
  ('cccc0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-ENG-Eve'),

  -- Faculty Babli Mallick
  ('cccc0004-0000-0000-0000-000000000004'::uuid, 'ASST-PROF-Wknd'),
  ('cccc0005-0000-0000-0000-000000000005'::uuid, 'ASST-PROF-Wknd'),
  ('cccc0006-0000-0000-0000-000000000006'::uuid, 'ASST-PROF-Wknd'),
  ('cccc0007-0000-0000-0000-000000000007'::uuid, 'ASST-PROF-Wknd'),

  -- Faculty Neelu Patel
  ('cccc0008-0000-0000-0000-000000000008'::uuid, 'NET-P2-POL-Eve'),
  ('cccc0009-0000-0000-0000-000000000009'::uuid, 'NET-P2-POL-Eve'),
  ('cccc0004-0000-0000-0000-000000000004'::uuid, 'NET-P2-POL-Eve'),

  -- Faculty Harendra Tripathi
  ('cccc0010-0000-0000-0000-000000000010'::uuid, 'NET-P1-Morning'),
  ('cccc0011-0000-0000-0000-000000000011'::uuid, 'NET-P1-Morning'),
  ('cccc0012-0000-0000-0000-000000000012'::uuid, 'NET-P1-Morning')
) as m(student_id, batch_name)
join public.batches b on b.batch_name = m.batch_name
on conflict (student_user_id, batch_id) do nothing;

-- 7) Replace course progress for these students based on assigned batches.
delete from public.student_course_progress
where student_user_id in (
  'cccc0001-0000-0000-0000-000000000001'::uuid,
  'cccc0002-0000-0000-0000-000000000002'::uuid,
  'cccc0003-0000-0000-0000-000000000003'::uuid,
  'cccc0004-0000-0000-0000-000000000004'::uuid,
  'cccc0005-0000-0000-0000-000000000005'::uuid,
  'cccc0006-0000-0000-0000-000000000006'::uuid,
  'cccc0007-0000-0000-0000-000000000007'::uuid,
  'cccc0008-0000-0000-0000-000000000008'::uuid,
  'cccc0009-0000-0000-0000-000000000009'::uuid,
  'cccc0010-0000-0000-0000-000000000010'::uuid,
  'cccc0011-0000-0000-0000-000000000011'::uuid,
  'cccc0012-0000-0000-0000-000000000012'::uuid
);

insert into public.student_course_progress (
  student_user_id,
  course_id,
  instructor_name,
  duration_label,
  exam_label,
  progress_percent
)
select
  e.student_user_id,
  b.course_id,
  p.full_name,
  '6 months',
  coalesce(sp.target_exam, 'Target Exam'),
  40
from public.enrollments e
join public.batches b on b.id = e.batch_id
left join public.profiles p on p.user_id = b.faculty_user_id
left join public.student_profiles sp on sp.user_id = e.student_user_id
where e.student_user_id in (
  'cccc0001-0000-0000-0000-000000000001'::uuid,
  'cccc0002-0000-0000-0000-000000000002'::uuid,
  'cccc0003-0000-0000-0000-000000000003'::uuid,
  'cccc0004-0000-0000-0000-000000000004'::uuid,
  'cccc0005-0000-0000-0000-000000000005'::uuid,
  'cccc0006-0000-0000-0000-000000000006'::uuid,
  'cccc0007-0000-0000-0000-000000000007'::uuid,
  'cccc0008-0000-0000-0000-000000000008'::uuid,
  'cccc0009-0000-0000-0000-000000000009'::uuid,
  'cccc0010-0000-0000-0000-000000000010'::uuid,
  'cccc0011-0000-0000-0000-000000000011'::uuid,
  'cccc0012-0000-0000-0000-000000000012'::uuid
)
on conflict (student_user_id, course_id) do update
set
  instructor_name = excluded.instructor_name,
  duration_label = excluded.duration_label,
  exam_label = excluded.exam_label,
  progress_percent = excluded.progress_percent,
  updated_at = now();
