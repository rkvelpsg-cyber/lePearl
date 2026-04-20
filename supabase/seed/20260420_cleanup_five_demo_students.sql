-- Cleanup script for the 5 demo students seeded by 20260420_insert_five_demo_students.sql
-- Safe to run before re-seeding to avoid duplicate dashboard data.

begin;

-- Fixed demo student UUIDs
with demo_students as (
  select unnest(array[
    'aaaa0001-0000-0000-0000-000000000001'::uuid,
    'aaaa0002-0000-0000-0000-000000000002'::uuid,
    'aaaa0003-0000-0000-0000-000000000003'::uuid,
    'aaaa0004-0000-0000-0000-000000000004'::uuid,
    'aaaa0005-0000-0000-0000-000000000005'::uuid
  ]) as user_id
)
-- 1) Remove student-linked child rows first
, deleted_attendance as (
  delete from public.student_attendance sa
  using demo_students ds
  where sa.student_user_id = ds.user_id
  returning sa.id
)
, deleted_mock_attempts as (
  delete from public.mock_test_attempts mta
  using demo_students ds
  where mta.student_user_id = ds.user_id
  returning mta.id
)
, deleted_payments as (
  delete from public.payments p
  using demo_students ds
  where p.student_user_id = ds.user_id
  returning p.id
)
, deleted_fee_plans as (
  delete from public.student_fee_plans sfp
  using demo_students ds
  where sfp.student_user_id = ds.user_id
  returning sfp.id
)
, deleted_progress as (
  delete from public.student_course_progress scp
  using demo_students ds
  where scp.student_user_id = ds.user_id
  returning scp.id
)
, deleted_enrollments as (
  delete from public.enrollments e
  using demo_students ds
  where e.student_user_id = ds.user_id
  returning e.id
)

-- 2) Remove the student profile layer
, deleted_student_profiles as (
  delete from public.student_profiles sp
  using demo_students ds
  where sp.user_id = ds.user_id
  returning sp.user_id
)
, deleted_profiles as (
  delete from public.profiles p
  using demo_students ds
  where p.user_id = ds.user_id
  returning p.user_id
)

-- 3) Remove auth identities for demo students
, deleted_auth_users as (
  delete from auth.users au
  using demo_students ds
  where au.id = ds.user_id
  returning au.id
)

-- 4) Remove seed-created mock tests and class sessions
, deleted_mock_tests as (
  delete from public.mock_tests mt
  where mt.created_by = '22222222-2222-2222-2222-222222222222'::uuid
    and mt.title in (
      'NET Paper 1 - Mock Test 1',
      'NET Paper 1 - Mock Test 2',
      'English Literature - Mock Test 1',
      'Hindi Sahitya - Mock Test 1',
      'Political Science - Mock Test 1',
      'History - Mock Test 1',
      'Sociology - Mock Test 1',
      'Interview Prep - Mock Test 1'
    )
  returning mt.id
)
, deleted_class_sessions as (
  delete from public.class_sessions cs
  where cs.created_by = '22222222-2222-2222-2222-222222222222'::uuid
    and cs.title in (
      'NTA NET Paper 1 - Teaching Aptitude',
      'English Literature - Modernism',
      'Interview Techniques Workshop',
      'Hindi Sahitya - Adhunik Kaal',
      'Political Theory - Justice & Rights',
      'Medieval Indian History',
      'Sociological Theories - Durkheim'
    )
  returning cs.id
)

select
  (select count(*) from deleted_attendance) as deleted_attendance,
  (select count(*) from deleted_mock_attempts) as deleted_mock_attempts,
  (select count(*) from deleted_payments) as deleted_payments,
  (select count(*) from deleted_fee_plans) as deleted_fee_plans,
  (select count(*) from deleted_progress) as deleted_progress,
  (select count(*) from deleted_enrollments) as deleted_enrollments,
  (select count(*) from deleted_student_profiles) as deleted_student_profiles,
  (select count(*) from deleted_profiles) as deleted_profiles,
  (select count(*) from deleted_auth_users) as deleted_auth_users,
  (select count(*) from deleted_mock_tests) as deleted_mock_tests,
  (select count(*) from deleted_class_sessions) as deleted_class_sessions;

commit;
