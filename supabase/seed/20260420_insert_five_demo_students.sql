-- ============================================================
-- 5 Demo Student accounts for the LePearl student dashboard.
-- Credentials:
--   priya.sharma@lepearl.education  / LpPriya#2026!
--   arjun.verma@lepearl.education   / LpArjun#2026!
--   sneha.patel@lepearl.education   / LpSneha#2026!
--   rohit.singh@lepearl.education   / LpRohit#2026!
--   meena.iyer@lepearl.education    / LpMeena#2026!
-- ============================================================

create extension if not exists pgcrypto;

-- Ensure the demo faculty account exists because this script references it
-- in batches.faculty_user_id, class_sessions.created_by, mock_tests.created_by,
-- and student_attendance.marked_by.
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
values (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'faculty@lepearl.education',
  crypt('LpFaculty#2026!', gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', 'faculty'),
  jsonb_build_object('full_name', 'Faculty Test User'),
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into public.profiles (user_id, role, full_name, phone, is_active)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'faculty',
    'Faculty Test User',
    '+91-9000000002',
    true
  )
on conflict (user_id) do update
set
  role = excluded.role,
  full_name = excluded.full_name,
  phone = excluded.phone,
  is_active = excluded.is_active,
  updated_at = now();

-- ─── 1. auth.users ───────────────────────────────────────────────────────────

with demo_students as (
  select * from (values
    ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'priya.sharma@lepearl.education', 'Priya Sharma',    'LpPriya#2026!'),
    ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'arjun.verma@lepearl.education',  'Arjun Verma',     'LpArjun#2026!'),
    ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'sneha.patel@lepearl.education',  'Sneha Patel',     'LpSneha#2026!'),
    ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'rohit.singh@lepearl.education',  'Rohit Singh',     'LpRohit#2026!'),
    ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'meena.iyer@lepearl.education',   'Meena Iyer',      'LpMeena#2026!')
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
  ds.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated',
  ds.email,
  crypt(ds.plain_password, gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', 'student'),
  jsonb_build_object('full_name', ds.full_name),
  now(), now(), '', '', '', ''
from demo_students ds
on conflict (id) do update
set
  email             = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_app_meta_data  = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at         = now();

-- ─── 2. public.profiles ──────────────────────────────────────────────────────

insert into public.profiles (user_id, role, full_name, phone, is_active)
values
  ('aaaa0001-0000-0000-0000-000000000001', 'student', 'Priya Sharma',  '+91-9811000001', true),
  ('aaaa0002-0000-0000-0000-000000000002', 'student', 'Arjun Verma',   '+91-9811000002', true),
  ('aaaa0003-0000-0000-0000-000000000003', 'student', 'Sneha Patel',   '+91-9811000003', true),
  ('aaaa0004-0000-0000-0000-000000000004', 'student', 'Rohit Singh',   '+91-9811000004', true),
  ('aaaa0005-0000-0000-0000-000000000005', 'student', 'Meena Iyer',    '+91-9811000005', true)
on conflict (user_id) do update
set
  full_name  = excluded.full_name,
  phone      = excluded.phone,
  is_active  = excluded.is_active,
  updated_at = now();

-- ─── 3. public.student_profiles ──────────────────────────────────────────────

insert into public.student_profiles (
  user_id, registration_no, target_exam, joined_on,
  guardian_name, guardian_phone
)
values
  ('aaaa0001-0000-0000-0000-000000000001', 'NTA-2024-847', 'UGC NET English',              '2024-01-10', 'Suresh Sharma',  '+91-9812000001'),
  ('aaaa0002-0000-0000-0000-000000000002', 'NTA-2024-921', 'UGC NET Hindi',                '2024-02-15', 'Mohan Verma',    '+91-9812000002'),
  ('aaaa0003-0000-0000-0000-000000000003', 'NTA-2024-1034','UGC NET Political Science',    '2024-03-01', 'Kavita Patel',   '+91-9812000003'),
  ('aaaa0004-0000-0000-0000-000000000004', 'NTA-2024-1156','UGC NET History',              '2024-03-20', 'Baldev Singh',   '+91-9812000004'),
  ('aaaa0005-0000-0000-0000-000000000005', 'NTA-2024-1287','UGC NET Sociology',            '2024-04-05', 'Krishnan Iyer',  '+91-9812000005')
on conflict (user_id) do update
set
  registration_no = excluded.registration_no,
  target_exam     = excluded.target_exam,
  guardian_name   = excluded.guardian_name,
  guardian_phone  = excluded.guardian_phone,
  updated_at      = now();

-- ─── 4. courses (ensure 3 courses used in demo) ──────────────────────────────

insert into public.courses (code, title, is_active)
values
  ('NET-P1',    'NTA NET Paper 1',                          true),
  ('NET-P2-ENG','NTA NET Paper 2 (English)',                true),
  ('ASST-PROF', 'Assistant Professor Preparation',         true),
  ('NET-P2-HIN','NTA NET Paper 2 (Hindi)',                  true),
  ('NET-P2-POL','NTA NET Paper 2 (Political Science)',      true),
  ('NET-P2-HIS','NTA NET Paper 2 (History)',                true),
  ('NET-P2-SOC','NTA NET Paper 2 (Sociology)',              true)
on conflict (code) do update
set title = excluded.title, is_active = excluded.is_active;

-- ─── 5. batches ──────────────────────────────────────────────────────────────

insert into public.batches (course_id, batch_name, faculty_user_id, start_date, end_date)
select c.id,
  case c.code
    when 'NET-P1'     then 'NET-P1-Morning'
    when 'NET-P2-ENG' then 'NET-P2-ENG-Eve'
    when 'ASST-PROF'  then 'ASST-PROF-Wknd'
    when 'NET-P2-HIN' then 'NET-P2-HIN-Mrng'
    when 'NET-P2-POL' then 'NET-P2-POL-Eve'
    when 'NET-P2-HIS' then 'NET-P2-HIS-Mrng'
    when 'NET-P2-SOC' then 'NET-P2-SOC-Eve'
  end,
  '22222222-2222-2222-2222-222222222222'::uuid,
  current_date - interval '90 day',
  current_date + interval '90 day'
from public.courses c
where c.code in ('NET-P1','NET-P2-ENG','ASST-PROF','NET-P2-HIN','NET-P2-POL','NET-P2-HIS','NET-P2-SOC')
on conflict (course_id, batch_name) do nothing;

-- ─── 6. enrollments ──────────────────────────────────────────────────────────
-- Priya enrolled in NET-P1, NET-P2-ENG, ASST-PROF
-- Arjun enrolled in NET-P1, NET-P2-HIN
-- Sneha enrolled in NET-P1, NET-P2-POL
-- Rohit enrolled in NET-P1, NET-P2-HIS
-- Meena enrolled in NET-P1, NET-P2-SOC

insert into public.enrollments (student_user_id, batch_id, enrolled_on, status)
select e.uid, b.id, e.enrolled_on, 'active'
from (values
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P1-Morning',   '2024-01-10'::date),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-ENG-Eve',   '2024-01-10'::date),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'ASST-PROF-Wknd',   '2024-01-10'::date),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P1-Morning',   '2024-02-15'::date),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P2-HIN-Mrng',  '2024-02-15'::date),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P1-Morning',   '2024-03-01'::date),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-POL-Eve',   '2024-03-01'::date),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P1-Morning',   '2024-03-20'::date),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P2-HIS-Mrng',  '2024-03-20'::date),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P1-Morning',   '2024-04-05'::date),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P2-SOC-Eve',   '2024-04-05'::date)
) as e(uid, batch_name, enrolled_on)
join public.batches b on b.batch_name = e.batch_name
on conflict (student_user_id, batch_id) do nothing;

-- ─── 7. student_course_progress ──────────────────────────────────────────────

insert into public.student_course_progress (
  student_user_id, course_id, instructor_name, duration_label, exam_label, progress_percent
)
select cp.uid, c.id, cp.instructor, cp.duration, cp.exam, cp.progress
from (values
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P1',    'Dr. Rajesh Kumar',  '6 months', 'NTA NET June 2025', 68),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-ENG','Prof. Meera Singh', '6 months', 'NTA NET June 2025', 72),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'ASST-PROF', 'Dr. Anil Verma',    '8 months', 'University Recruitment 2025', 55),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P1',    'Dr. Rajesh Kumar',  '6 months', 'NTA NET June 2025', 80),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P2-HIN','Dr. Kavita Sharma', '6 months', 'NTA NET June 2025', 65),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P1',    'Dr. Rajesh Kumar',  '6 months', 'NTA NET June 2025', 55),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-POL','Prof. Suresh Nair', '6 months', 'NTA NET June 2025', 48),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P1',    'Dr. Rajesh Kumar',  '6 months', 'NTA NET Dec 2025',  90),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P2-HIS','Prof. Anita Bose',  '6 months', 'NTA NET Dec 2025',  78),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P1',    'Dr. Rajesh Kumar',  '6 months', 'NTA NET Dec 2025',  62),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P2-SOC','Dr. Priya Menon',   '6 months', 'NTA NET Dec 2025',  59)
) as cp(uid, course_code, instructor, duration, exam, progress)
join public.courses c on c.code = cp.course_code
on conflict (student_user_id, course_id) do update
set
  instructor_name  = excluded.instructor_name,
  progress_percent = excluded.progress_percent,
  updated_at       = now();

-- ─── 8. payments ─────────────────────────────────────────────────────────────

insert into public.payments (student_user_id, amount, payment_date, payment_mode, reference_no, status)
values
  -- Priya Sharma: ₹30,000 paid out of ₹45,000
  ('aaaa0001-0000-0000-0000-000000000001', 15000, '2024-01-15', 'UPI',          'UPI-PRI-01', 'paid'),
  ('aaaa0001-0000-0000-0000-000000000001', 15000, '2024-02-15', 'Credit Card',  'CC-PRI-02',  'paid'),
  -- Arjun Verma: ₹20,000 paid out of ₹30,000
  ('aaaa0002-0000-0000-0000-000000000002', 10000, '2024-02-20', 'Net Banking',  'NB-ARJ-01',  'paid'),
  ('aaaa0002-0000-0000-0000-000000000002', 10000, '2024-03-20', 'UPI',          'UPI-ARJ-02', 'paid'),
  -- Sneha Patel: ₹15,000 paid out of ₹30,000
  ('aaaa0003-0000-0000-0000-000000000003', 15000, '2024-03-05', 'Cash',         'CSH-SNH-01', 'paid'),
  -- Rohit Singh: ₹25,000 paid out of ₹30,000
  ('aaaa0004-0000-0000-0000-000000000004', 15000, '2024-03-25', 'UPI',          'UPI-ROH-01', 'paid'),
  ('aaaa0004-0000-0000-0000-000000000004', 10000, '2024-04-10', 'Debit Card',   'DC-ROH-02',  'paid'),
  -- Meena Iyer: ₹10,000 paid out of ₹30,000
  ('aaaa0005-0000-0000-0000-000000000005', 10000, '2024-04-10', 'UPI',          'UPI-MEE-01', 'paid');

-- ─── 9. student_fee_plans ────────────────────────────────────────────────────

insert into public.student_fee_plans (
  student_user_id, total_fee, next_due_amount, next_due_date
)
values
  ('aaaa0001-0000-0000-0000-000000000001', 45000, 15000, '2025-04-30'),
  ('aaaa0002-0000-0000-0000-000000000002', 30000, 10000, '2025-05-15'),
  ('aaaa0003-0000-0000-0000-000000000003', 30000, 15000, '2025-05-01'),
  ('aaaa0004-0000-0000-0000-000000000004', 30000,  5000, '2025-05-20'),
  ('aaaa0005-0000-0000-0000-000000000005', 30000, 20000, '2025-04-25')
on conflict (student_user_id) do update
set
  total_fee       = excluded.total_fee,
  next_due_amount = excluded.next_due_amount,
  next_due_date   = excluded.next_due_date,
  updated_at      = now();

-- ─── 10. class_sessions ──────────────────────────────────────────────────────
-- Insert both past sessions (for attendance data) and future sessions (for upcoming classes)

insert into public.class_sessions (
  batch_id, title, session_date, start_time, end_time, meeting_link, created_by
)
select
  b.id,
  cs.title,
  current_date + cs.days_offset,
  cs.start_time::time,
  cs.end_time::time,
  cs.link,
  '22222222-2222-2222-2222-222222222222'::uuid
from (values
  -- Past sessions (for attendance records)
  ('NET-P1-Morning',  'NTA NET Paper 1 - Teaching Aptitude', -7, '10:00', '12:00', 'https://meet.google.com/demo-net-p1'),
  ('NET-P2-ENG-Eve',  'English Literature - Modernism',       -6, '15:00', '17:00', 'https://meet.google.com/demo-net-p2-eng'),
  ('ASST-PROF-Wknd',  'Interview Techniques Workshop',        -5, '09:00', '11:00', 'https://meet.google.com/demo-asst-prof'),
  ('NET-P2-HIN-Mrng', 'Hindi Sahitya - Adhunik Kaal',         -4, '08:00', '10:00', 'https://meet.google.com/demo-net-p2-hin'),
  ('NET-P2-POL-Eve',  'Political Theory - Justice & Rights',  -3, '16:00', '18:00', 'https://meet.google.com/demo-net-p2-pol'),
  ('NET-P2-HIS-Mrng', 'Medieval Indian History',              -2, '10:00', '12:00', 'https://meet.google.com/demo-net-p2-his'),
  ('NET-P2-SOC-Eve',  'Sociological Theories - Durkheim',     -1, '15:00', '17:00', 'https://meet.google.com/demo-net-p2-soc'),
  -- Upcoming sessions (for future classes display)
  ('NET-P1-Morning',  'NTA NET Paper 1 - Teaching Aptitude (Upcoming)', 3, '10:00', '12:00', 'https://meet.google.com/demo-net-p1'),
  ('NET-P2-ENG-Eve',  'English Literature - Modernism (Upcoming)',       3, '15:00', '17:00', 'https://meet.google.com/demo-net-p2-eng'),
  ('ASST-PROF-Wknd',  'Interview Techniques Workshop (Upcoming)',        5, '09:00', '11:00', 'https://meet.google.com/demo-asst-prof'),
  ('NET-P2-HIN-Mrng', 'Hindi Sahitya - Adhunik Kaal (Upcoming)',         3, '08:00', '10:00', 'https://meet.google.com/demo-net-p2-hin'),
  ('NET-P2-POL-Eve',  'Political Theory - Justice & Rights (Upcoming)',  4, '16:00', '18:00', 'https://meet.google.com/demo-net-p2-pol'),
  ('NET-P2-HIS-Mrng', 'Medieval Indian History (Upcoming)',              3, '10:00', '12:00', 'https://meet.google.com/demo-net-p2-his'),
  ('NET-P2-SOC-Eve',  'Sociological Theories - Durkheim (Upcoming)',     4, '15:00', '17:00', 'https://meet.google.com/demo-net-p2-soc')
) as cs(batch_name, title, days_offset, start_time, end_time, link)
join public.batches b on b.batch_name = cs.batch_name;

-- ─── 11. student_attendance ──────────────────────────────────────────────────
-- Mark attendance for all sessions already past (days_offset < 0 ones were seeded above future, skip).
-- We seed mock attendance from earlier batches. Derive attendance percent from existing records.
-- For demo purposes insert historical attendance records.

insert into public.student_attendance (session_id, student_user_id, status, marked_by)
select cs.id, e.student_user_id,
  case (random() * 10)::int % 10
    when 0 then 'absent'
    else 'present'
  end,
  '22222222-2222-2222-2222-222222222222'::uuid
from public.class_sessions cs
join public.batches b on b.id = cs.batch_id
join public.enrollments e on e.batch_id = b.id
where cs.session_date < current_date
on conflict (session_id, student_user_id) do nothing;

-- ─── 12. mock_tests & attempts ───────────────────────────────────────────────

insert into public.mock_tests (course_id, title, total_marks, scheduled_at, created_by)
select c.id, mt.title, mt.total_marks, now() - interval '30 day',
  '22222222-2222-2222-2222-222222222222'::uuid
from (values
  ('NET-P1',    'NET Paper 1 - Mock Test 1',       150),
  ('NET-P1',    'NET Paper 1 - Mock Test 2',       150),
  ('NET-P2-ENG','English Literature - Mock Test 1', 150),
  ('NET-P2-HIN','Hindi Sahitya - Mock Test 1',      150),
  ('NET-P2-POL','Political Science - Mock Test 1',  150),
  ('NET-P2-HIS','History - Mock Test 1',            150),
  ('NET-P2-SOC','Sociology - Mock Test 1',          150),
  ('ASST-PROF', 'Interview Prep - Mock Test 1',     100)
) as mt(course_code, title, total_marks)
join public.courses c on c.code = mt.course_code;

-- Insert mock test attempts per student
insert into public.mock_test_attempts (mock_test_id, student_user_id, scored_marks)
select mt.id, ea.uid, (mt.total_marks * ea.score_pct / 100.0)::numeric(6,2)
from (values
  -- (student_uid, course_code, score_pct)
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P1',    75),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'NET-P2-ENG',72),
  ('aaaa0001-0000-0000-0000-000000000001'::uuid, 'ASST-PROF', 80),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P1',    68),
  ('aaaa0002-0000-0000-0000-000000000002'::uuid, 'NET-P2-HIN',70),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P1',    60),
  ('aaaa0003-0000-0000-0000-000000000003'::uuid, 'NET-P2-POL',55),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P1',    88),
  ('aaaa0004-0000-0000-0000-000000000004'::uuid, 'NET-P2-HIS',82),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P1',    65),
  ('aaaa0005-0000-0000-0000-000000000005'::uuid, 'NET-P2-SOC',58)
) as ea(uid, course_code, score_pct)
join public.mock_tests mt
  on mt.course_id = (select id from public.courses where code = ea.course_code limit 1)
  and mt.title like '%Mock Test 1'
on conflict (mock_test_id, student_user_id) do nothing;
