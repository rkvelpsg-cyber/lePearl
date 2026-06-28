-- Normalize paid-enrolment course -> batch -> faculty mappings.
-- This creates the canonical batches agreed for paid enrolments and moves
-- same-course student enrollments onto those canonical batches.
--
-- Intentionally conservative:
-- - Moves enrollments only when the course title already matches the canonical
--   paid-enrolment course title.
-- - Deletes duplicate batches only when they have no enrollments or batch-scoped
--   content left after reassignment.
-- - Leaves legacy alias courses/batches with different titles in place for
--   manual review if they still carry historical content.

with canonical_map(course_title, batch_name, faculty_name, course_code) as (
  values
    ('MPPSC', 'MPPSC-Patel-A', 'Ms. Neelu Patel', 'MPPSC'),
    ('UPHESC', 'UPHESC-Pandey-A', 'Dr Prem Shankar Pandey', 'UPHESC'),
    ('UP GDC', 'UP-GDC-Pandey-A', 'Dr Prem Shankar Pandey', 'UP-GDC'),
    ('NET Paper 1', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana', 'NET-PAPER-1'),
    ('NET Paper 2 (English)', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana', 'NET-PAPER-2-ENG'),
    ('GIC', 'GIC-Sadhana-A', 'Ms. Sadhana', 'GIC'),
    ('LT Grade', 'LT-GRADE-Sadhana-A', 'Ms. Sadhana', 'LT-GRADE'),
    ('Interview Preparation - Assistant Professor', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey', 'INTERVIEW-ASST-PROF'),
    ('Interview Preparation - Ph.D Interview', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey', 'INTERVIEW-PHD'),
    ('Communication Skills', 'COMMUNICAT-Pandey-A', 'Dr Prem Shankar Pandey', 'COMMUNICATION'),
    ('SET', 'SET-Sadhana-A', 'Ms. Sadhana', 'SET'),
    ('Research Assistance', 'RESEARCH-A-Pandey-A', 'Dr Prem Shankar Pandey', 'RESEARCH-A')
),
normalized_faculty as (
  select
    p.user_id,
    regexp_replace(lower(p.full_name), '[^a-z0-9]+', '', 'g') as faculty_key
  from public.profiles p
  where p.role = 'faculty'
),
normalized_courses as (
  select
    c.id,
    c.title,
    regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') as course_key
  from public.courses c
),
missing_courses as (
  select cm.course_title, cm.course_code
  from canonical_map cm
  left join normalized_courses c
    on c.course_key = regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  where c.id is null
)
insert into public.courses (code, title, is_active)
select mc.course_code, mc.course_title, true
from missing_courses mc;

with canonical_map(course_title, batch_name, faculty_name) as (
  values
    ('MPPSC', 'MPPSC-Patel-A', 'Ms. Neelu Patel'),
    ('UPHESC', 'UPHESC-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('UP GDC', 'UP-GDC-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('NET Paper 1', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana'),
    ('NET Paper 2 (English)', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana'),
    ('GIC', 'GIC-Sadhana-A', 'Ms. Sadhana'),
    ('LT Grade', 'LT-GRADE-Sadhana-A', 'Ms. Sadhana'),
    ('Interview Preparation - Assistant Professor', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey'),
    ('Interview Preparation - Ph.D Interview', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey'),
    ('Communication Skills', 'COMMUNICAT-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('SET', 'SET-Sadhana-A', 'Ms. Sadhana'),
    ('Research Assistance', 'RESEARCH-A-Pandey-A', 'Dr Prem Shankar Pandey')
),
canonical_targets as (
  select
    c.id as course_id,
    cm.course_title,
    cm.batch_name,
    p.user_id as faculty_user_id
  from canonical_map cm
  join public.courses c
    on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  join public.profiles p
    on p.role = 'faculty'
   and regexp_replace(lower(p.full_name), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(cm.faculty_name), '[^a-z0-9]+', '', 'g')
)
update public.batches b
set faculty_user_id = ct.faculty_user_id
from canonical_targets ct
where b.course_id = ct.course_id
  and lower(b.batch_name) = lower(ct.batch_name)
  and b.faculty_user_id is distinct from ct.faculty_user_id;

with canonical_map(course_title, batch_name, faculty_name) as (
  values
    ('MPPSC', 'MPPSC-Patel-A', 'Ms. Neelu Patel'),
    ('UPHESC', 'UPHESC-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('UP GDC', 'UP-GDC-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('NET Paper 1', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana'),
    ('NET Paper 2 (English)', 'NET-PAPER--Sadhana-A', 'Ms. Sadhana'),
    ('GIC', 'GIC-Sadhana-A', 'Ms. Sadhana'),
    ('LT Grade', 'LT-GRADE-Sadhana-A', 'Ms. Sadhana'),
    ('Interview Preparation - Assistant Professor', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey'),
    ('Interview Preparation - Ph.D Interview', 'INTERVIEW--Pandey-A', 'Dr Prem Shankar Pandey'),
    ('Communication Skills', 'COMMUNICAT-Pandey-A', 'Dr Prem Shankar Pandey'),
    ('SET', 'SET-Sadhana-A', 'Ms. Sadhana'),
    ('Research Assistance', 'RESEARCH-A-Pandey-A', 'Dr Prem Shankar Pandey')
)
insert into public.batches (course_id, batch_name, faculty_user_id, start_date)
select
  c.id,
  cm.batch_name,
  p.user_id,
  current_date
from canonical_map cm
join public.courses c
  on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
     regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
join public.profiles p
  on p.role = 'faculty'
 and regexp_replace(lower(p.full_name), '[^a-z0-9]+', '', 'g') =
     regexp_replace(lower(cm.faculty_name), '[^a-z0-9]+', '', 'g')
where not exists (
  select 1
  from public.batches b
  where b.course_id = c.id
    and lower(b.batch_name) = lower(cm.batch_name)
);

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
),
canonical_batches as (
  select
    c.id as course_id,
    b.id as batch_id,
    cm.batch_name
  from canonical_map cm
  join public.courses c
    on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  join public.batches b
    on b.course_id = c.id
   and lower(b.batch_name) = lower(cm.batch_name)
),
duplicate_enrollments as (
  select distinct
    e.student_user_id,
    e.batch_id as old_batch_id,
    cb.batch_id as canonical_batch_id
  from canonical_batches cb
  join public.batches b
    on b.course_id = cb.course_id
  join public.enrollments e
    on e.batch_id = b.id
  where b.id <> cb.batch_id
)
insert into public.enrollments (student_user_id, batch_id, enrolled_on, status)
select de.student_user_id, de.canonical_batch_id, current_date, 'active'
from duplicate_enrollments de
on conflict (student_user_id, batch_id)
do update set status = excluded.status;

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
),
canonical_batches as (
  select
    c.id as course_id,
    b.id as batch_id,
    cm.batch_name
  from canonical_map cm
  join public.courses c
    on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  join public.batches b
    on b.course_id = c.id
   and lower(b.batch_name) = lower(cm.batch_name)
),
duplicate_enrollments as (
  select distinct
    e.student_user_id,
    e.batch_id as old_batch_id,
    cb.batch_id as canonical_batch_id
  from canonical_batches cb
  join public.batches b
    on b.course_id = cb.course_id
  join public.enrollments e
    on e.batch_id = b.id
  where b.id <> cb.batch_id
)
delete from public.enrollments e
using duplicate_enrollments de
where e.student_user_id = de.student_user_id
  and e.batch_id = de.old_batch_id;

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
),
duplicate_batches as (
  select b.id
  from public.batches b
  join public.courses c on c.id = b.course_id
  join canonical_map cm
    on regexp_replace(lower(c.title), '[^a-z0-9]+', '', 'g') =
       regexp_replace(lower(cm.course_title), '[^a-z0-9]+', '', 'g')
  where lower(b.batch_name) <> lower(cm.batch_name)
    and not exists (select 1 from public.enrollments e where e.batch_id = b.id)
    and not exists (select 1 from public.class_sessions cs where cs.batch_id = b.id)
    and not exists (select 1 from public.mock_tests mt where mt.batch_id = b.id)
    and not exists (select 1 from public.recorded_lectures rl where rl.batch_id = b.id)
    and not exists (select 1 from public.study_materials sm where sm.batch_id = b.id)
    and not exists (select 1 from public.faculty_tasks ft where ft.batch_id = b.id)
)
delete from public.batches b
using duplicate_batches db
where b.id = db.id;