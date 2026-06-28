-- Safe cleanup for legacy paid-enrolment alias batches.
--
-- This migration is intentionally NON-DESTRUCTIVE for live production data:
-- - It does NOT move enrolled students.
-- - It does NOT move classes, tests, lectures, study materials, tasks, or fee data.
-- - It deletes only alias batch rows that are completely unused.
--
-- Use this only after dashboard/UI filtering and canonical batch provisioning are
-- already deployed, so unwanted batches are hidden operationally while historical
-- data remains intact.
--
-- Run this AFTER 20260628_normalize_paid_enrollment_batches.sql.

-- 1. Normalize canonical batch-name casing where the correct row already exists
--    under the same course but only differs by case.
with canonical_map(course_title, batch_name) as (
  values
    ('MPPSC', 'MPPSC-Patel-A'),
    ('UPHESC', 'UPHESC-Pandey-A'),
    ('UP GDC', 'UP-GDC-Pandey-A'),
    ('NET Paper 1', 'NET-PAPER--Sadhana-A'),
    ('NET Paper 2 (English)', 'NET-PAPER--Sadhana-A'),
    ('GIC', 'GIC-Sadhana-A'),
    ('LT Grade', 'LT-GRADE-Sadhana-A'),
    ('Interview Preparation - Assistant Professor', 'INTERVIEW--Pandey-A'),
    ('Interview Preparation - Ph.D Interview', 'INTERVIEW--Pandey-A'),
    ('Communication Skills', 'COMMUNICAT-Pandey-A'),
    ('SET', 'SET-Sadhana-A'),
    ('Research Assistance', 'RESEARCH-A-Pandey-A')
)
update public.batches b
set batch_name = cm.batch_name
from canonical_map cm
join public.courses c on c.id = b.course_id
where regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
      regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  and lower(b.batch_name) = lower(cm.batch_name)
  and b.batch_name <> cm.batch_name
  and not exists (
    select 1
    from public.batches bx
    where bx.course_id = b.course_id
      and bx.batch_name = cm.batch_name
      and bx.id <> b.id
  );

-- 2. Delete only UNUSED alias batches.
--    If a batch has any linked students or academic content, leave it untouched.
with alias_batch_map(source_course_title, source_batch_name) as (
  values
    ('Assistant Professor Preparation', 'ASST-PROF-Wknd'),
    ('NTA NET Paper 1', 'NET-P1-Morning'),
    ('NTA NET Paper 2 (English)', 'NET-P2-ENG-Eve'),
    ('NTA NET Paper 2 (English)', 'NET-P2-Evening'),
    ('GIC', 'GIC-Mallick-A'),
    ('LT Grade', 'lt-grade-Mallick-A'),
    ('UP GDC', 'UP-GDC-Sadhana-A'),
    ('NET Paper 2 (English)', 'NET-PAPER--Patel-A')
),
resolved_aliases as (
  select b.id
  from alias_batch_map abm
  join public.courses c
    on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(abm.source_course_title), '[^a-z0-9]+', '', 'g')
  join public.batches b
    on b.course_id = c.id
   and lower(b.batch_name) = lower(abm.source_batch_name)
),
safe_to_delete as (
  select ra.id
  from resolved_aliases ra
  where not exists (
          select 1 from public.enrollments e where e.batch_id = ra.id
        )
    and not exists (
          select 1 from public.class_sessions cs where cs.batch_id = ra.id
        )
    and not exists (
          select 1 from public.mock_tests mt where mt.batch_id = ra.id
        )
    and not exists (
          select 1 from public.recorded_lectures rl where rl.batch_id = ra.id
        )
    and not exists (
          select 1 from public.study_materials sm where sm.batch_id = ra.id
        )
    and not exists (
          select 1 from public.faculty_tasks ft where ft.batch_id = ra.id
        )
)
delete from public.batches b
using safe_to_delete std
where b.id = std.id;
