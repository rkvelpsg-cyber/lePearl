-- ============================================================
-- 4 Real Faculty accounts for LePearl Education
--
-- Credentials:
--   sadhana@lepearl.education        / LpSadhana#2026!
--   babli.mallick@lepearl.education  / LpBabli#2026!
--   neelu.patel@lepearl.education    / LpNeelu#2026!
--   harendra.tripathi@lepearl.education / LpHarendra#2026!
--
-- Batch assignments:
--   Ms. Sadhana        → NET-P2-ENG-Eve, NET-P2-HIN-Mrng
--   Dr. Babli Mallick  → ASST-PROF-Wknd
--   Ms. Neelu Patel    → NET-P2-POL-Eve, NET-P2-HIS-Mrng
--   Dr. Harendra K T.  → NET-P1-Morning, NET-P2-SOC-Eve
-- ============================================================

create extension if not exists pgcrypto;

-- ─── 1. auth.users ───────────────────────────────────────────────────────────

with faculty_data as (
  select * from (values
    ('bbbb0001-0000-0000-0000-000000000001'::uuid, 'sadhana@lepearl.education',            'Ms. Sadhana',             'LpSadhana#2026!'),
    ('bbbb0002-0000-0000-0000-000000000002'::uuid, 'babli.mallick@lepearl.education',      'Dr. Babli Mallick',       'LpBabli#2026!'),
    ('bbbb0003-0000-0000-0000-000000000003'::uuid, 'neelu.patel@lepearl.education',        'Ms. Neelu Patel',         'LpNeelu#2026!'),
    ('bbbb0004-0000-0000-0000-000000000004'::uuid, 'harendra.tripathi@lepearl.education',  'Dr. Harendra K Tripathi', 'LpHarendra#2026!')
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
  fd.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated',
  fd.email,
  crypt(fd.plain_password, gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', 'faculty'),
  jsonb_build_object('full_name', fd.full_name),
  now(), now(), '', '', '', ''
from faculty_data fd
on conflict (id) do update
set
  email              = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_app_meta_data  = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at         = now();

-- ─── 2. public.profiles ──────────────────────────────────────────────────────

insert into public.profiles (user_id, role, full_name, phone, is_active)
values
  ('bbbb0001-0000-0000-0000-000000000001', 'faculty', 'Ms. Sadhana',             '+91-9800000011', true),
  ('bbbb0002-0000-0000-0000-000000000002', 'faculty', 'Dr. Babli Mallick',       '+91-9800000012', true),
  ('bbbb0003-0000-0000-0000-000000000003', 'faculty', 'Ms. Neelu Patel',         '+91-9800000013', true),
  ('bbbb0004-0000-0000-0000-000000000004', 'faculty', 'Dr. Harendra K Tripathi', '+91-9800000014', true)
on conflict (user_id) do update
set
  role       = excluded.role,
  full_name  = excluded.full_name,
  phone      = excluded.phone,
  is_active  = excluded.is_active,
  updated_at = now();

-- ─── 3. public.faculty_profiles ──────────────────────────────────────────────

insert into public.faculty_profiles (user_id, employee_code, department, designation, specialization)
values
  ('bbbb0001-0000-0000-0000-000000000001', 'FAC-001', 'English',   'Assistant Professor',
   'UGC-NET Expert, English Literature, Competitive Exam Mentor'),
  ('bbbb0002-0000-0000-0000-000000000002', 'FAC-002', 'English',   'Assistant Professor',
   'Research Writing, Thesis Writing, Research Paper Reviewer'),
  ('bbbb0003-0000-0000-0000-000000000003', 'FAC-003', 'English',   'Assistant Professor',
   'English Literature, MPPSC AP, UGC-NET Guidance'),
  ('bbbb0004-0000-0000-0000-000000000004', 'FAC-004', 'Sociology', 'Faculty',
   'General Studies, UGC NET Paper 1, Sociology of Health')
on conflict (user_id) do update
set
  employee_code  = excluded.employee_code,
  department     = excluded.department,
  designation    = excluded.designation,
  specialization = excluded.specialization,
  updated_at     = now();

-- ─── 4. Reassign batches to real faculty ─────────────────────────────────────

-- Ms. Sadhana → NET-P2-ENG-Eve and NET-P2-HIN-Mrng
update public.batches set faculty_user_id = 'bbbb0001-0000-0000-0000-000000000001'
where batch_name in ('NET-P2-ENG-Eve', 'NET-P2-HIN-Mrng');

-- Dr. Babli Mallick → ASST-PROF-Wknd
update public.batches set faculty_user_id = 'bbbb0002-0000-0000-0000-000000000002'
where batch_name = 'ASST-PROF-Wknd';

-- Ms. Neelu Patel → NET-P2-POL-Eve and NET-P2-HIS-Mrng
update public.batches set faculty_user_id = 'bbbb0003-0000-0000-0000-000000000003'
where batch_name in ('NET-P2-POL-Eve', 'NET-P2-HIS-Mrng');

-- Dr. Harendra → NET-P1-Morning and NET-P2-SOC-Eve
update public.batches set faculty_user_id = 'bbbb0004-0000-0000-0000-000000000004'
where batch_name in ('NET-P1-Morning', 'NET-P2-SOC-Eve');

-- ─── 5. Reassign class sessions created_by to matching faculty ───────────────

update public.class_sessions cs
set created_by = b.faculty_user_id
from public.batches b
where cs.batch_id = b.id
  and b.faculty_user_id is not null;

-- ─── 6. Reassign mock tests created_by to faculty based on course ────────────

-- NET-P1 and NET-P2-SOC → Dr. Harendra
update public.mock_tests mt
set created_by = 'bbbb0004-0000-0000-0000-000000000004'
from public.courses c
where mt.course_id = c.id
  and c.code in ('NET-P1', 'NET-P2-SOC');

-- NET-P2-ENG and NET-P2-HIN → Ms. Sadhana
update public.mock_tests mt
set created_by = 'bbbb0001-0000-0000-0000-000000000001'
from public.courses c
where mt.course_id = c.id
  and c.code in ('NET-P2-ENG', 'NET-P2-HIN');

-- ASST-PROF → Dr. Babli Mallick
update public.mock_tests mt
set created_by = 'bbbb0002-0000-0000-0000-000000000002'
from public.courses c
where mt.course_id = c.id
  and c.code = 'ASST-PROF';

-- NET-P2-POL and NET-P2-HIS → Ms. Neelu Patel
update public.mock_tests mt
set created_by = 'bbbb0003-0000-0000-0000-000000000003'
from public.courses c
where mt.course_id = c.id
  and c.code in ('NET-P2-POL', 'NET-P2-HIS');

-- ─── 7. Demo tasks assigned by each faculty ──────────────────────────────────
-- Tasks assigned to entire batch (student_user_id = null) and to individuals

insert into public.faculty_tasks
  (faculty_user_id, batch_id, student_user_id, title, description, due_date, status)
select f.uid, b.id, null,
  f.title, f.description,
  current_date + f.days_ahead,
  'pending'
from (values
  -- Ms. Sadhana tasks
  ('bbbb0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-ENG-Eve',
   'Read Chapter 5 - Modernism', 'Read and summarise T.S. Eliot''s The Waste Land. Submit a 500-word analysis.', 5),
  ('bbbb0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-HIN-Mrng',
   'Hindi Kahani Analysis', 'Premchand ki kahani "Kafan" ka samikshatmak vishleshan likhen.', 7),

  -- Dr. Babli Mallick tasks
  ('bbbb0002-0000-0000-0000-000000000002'::uuid, 'ASST-PROF-Wknd',
   'Draft Research Abstract', 'Write a 200-word abstract for your proposed research topic. Use APA 7th edition.', 6),
  ('bbbb0002-0000-0000-0000-000000000002'::uuid, 'ASST-PROF-Wknd',
   'Review 2 Research Papers', 'Download and critically review 2 papers from JSTOR on your chosen subject area.', 10),

  -- Ms. Neelu Patel tasks
  ('bbbb0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-POL-Eve',
   'Political Theory Essay', 'Write a 600-word essay on Rawls'' Theory of Justice and its critique.', 5),
  ('bbbb0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-HIS-Mrng',
   'Medieval India Timeline', 'Create a chronological timeline of key events in Medieval Indian History (1206–1707).', 8),

  -- Dr. Harendra tasks
  ('bbbb0004-0000-0000-0000-000000000004'::uuid, 'NET-P1-Morning',
   'Teaching Aptitude Mock Quiz', 'Complete the 25-question Teaching Aptitude practice set and submit your answers.', 3),
  ('bbbb0004-0000-0000-0000-000000000004'::uuid, 'NET-P2-SOC-Eve',
   'Durkheim Concept Notes', 'Prepare concise notes on Durkheim''s concepts of Social Solidarity and Anomie.', 6)
) as f(uid, batch_name, title, description, days_ahead)
join public.batches b on b.batch_name = f.batch_name
on conflict do nothing;

-- Individual task: Dr. Harendra assigns personal study plan to Rohit Singh (high performer)
insert into public.faculty_tasks
  (faculty_user_id, batch_id, student_user_id, title, description, due_date, status)
select
  'bbbb0004-0000-0000-0000-000000000004',
  b.id,
  'aaaa0004-0000-0000-0000-000000000004',
  'Advanced Paper 1 Revision',
  'You are at 90% progress. Complete the full syllabus revision and attempt Mock Test 2 this week.',
  current_date + 4,
  'pending'
from public.batches b
where b.batch_name = 'NET-P1-Morning'
on conflict do nothing;

-- Individual task: Ms. Sadhana assigns to Priya Sharma
insert into public.faculty_tasks
  (faculty_user_id, batch_id, student_user_id, title, description, due_date, status)
select
  'bbbb0001-0000-0000-0000-000000000001',
  b.id,
  'aaaa0001-0000-0000-0000-000000000001',
  'Poetry Presentation',
  'Prepare a 10-minute presentation on any Victorian poet of your choice for next Saturday''s live class.',
  current_date + 8,
  'pending'
from public.batches b
where b.batch_name = 'NET-P2-ENG-Eve'
on conflict do nothing;
