-- Add a separate mock-only course and batch without moving existing enrollments.
begin;

do $$
declare
  v_faculty_id uuid;
  v_course_id bigint;
  v_batch_id bigint;
begin
  select user_id into strict v_faculty_id
  from public.profiles
  where role = 'faculty'
    and is_active = true
    and regexp_replace(lower(full_name), '[^a-z0-9]+', '', 'g') = 'drpremshankarpandey';

  select id into v_course_id
  from public.courses
  where lower(btrim(title)) = 'uphesc-mock only';

  if (select count(*) from public.courses where lower(btrim(title)) = 'uphesc-mock only') > 1 then
    raise exception 'Multiple UPHESC-Mock Only courses found. Resolve duplicates before enabling enrolment.';
  end if;

  if v_course_id is null then
    insert into public.courses (code, title, is_active)
    values ('UPHESC-MOCK-ONLY', 'UPHESC-Mock Only', true)
    returning id into v_course_id;
  end if;

  if exists (
    select 1 from public.batches
    where lower(btrim(batch_name)) = 'uphesc-mock only'
      and (course_id <> v_course_id or faculty_user_id is distinct from v_faculty_id)
  ) then
    raise exception 'UPHESC-Mock Only is assigned to an unexpected course or faculty. Review before enabling enrolment.';
  end if;

  select id into v_batch_id
  from public.batches
  where course_id = v_course_id and batch_name = 'UPHESC-Mock Only';

  if (select count(*) from public.batches where course_id = v_course_id and batch_name = 'UPHESC-Mock Only') > 1 then
    raise exception 'Multiple UPHESC-Mock Only batches found. Resolve duplicates before enabling enrolment.';
  end if;

  if v_batch_id is null then
    insert into public.batches (course_id, batch_name, faculty_user_id, start_date)
    values (v_course_id, 'UPHESC-Mock Only', v_faculty_id, current_date);
  end if;
end;
$$;

create or replace function public.is_uphesc_mock_only_course(p_course_id bigint)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.courses
    where id = p_course_id and lower(btrim(title)) = 'uphesc-mock only'
  );
$$;

create or replace function public.is_uphesc_mock_only_batch(p_batch_id bigint)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.batches b
    where b.id = p_batch_id
      and (
        lower(btrim(b.batch_name)) = 'uphesc-mock only'
        or public.is_uphesc_mock_only_course(b.course_id)
      )
  );
$$;

create or replace function public.is_uphesc_mock_only_student(p_student_user_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.student_profiles
    where user_id = p_student_user_id and lower(btrim(target_exam)) = 'uphesc-mock only'
  ) or (
    exists (
      select 1 from public.enrollments
      where student_user_id = p_student_user_id
        and public.is_uphesc_mock_only_batch(batch_id)
    ) and not exists (
      select 1 from public.enrollments
      where student_user_id = p_student_user_id
        and not public.is_uphesc_mock_only_batch(batch_id)
    )
  );
$$;

revoke all on function public.is_uphesc_mock_only_course(bigint) from public;
revoke all on function public.is_uphesc_mock_only_batch(bigint) from public;
revoke all on function public.is_uphesc_mock_only_student(uuid) from public;
grant execute on function public.is_uphesc_mock_only_course(bigint) to authenticated, service_role;
grant execute on function public.is_uphesc_mock_only_batch(bigint) to authenticated, service_role;
grant execute on function public.is_uphesc_mock_only_student(uuid) to authenticated, service_role;

-- Restrictive policies are ANDed with the existing policies; they do not grant
-- any new permissions or change access for existing full-course batches.
do $$
declare
  v_table text;
begin
  foreach v_table in array array['class_sessions', 'recorded_lectures', 'study_materials']
  loop
    execute format('drop policy if exists uphesc_mock_only_content_guard on public.%I', v_table);
    execute format(
      'create policy uphesc_mock_only_content_guard on public.%I as restrictive
       for all to authenticated
       using (not public.is_uphesc_mock_only_batch(batch_id)
              and not public.is_uphesc_mock_only_student(auth.uid()))
       with check (not public.is_uphesc_mock_only_batch(batch_id)
                   and not public.is_uphesc_mock_only_student(auth.uid()))',
      v_table
    );
  end loop;

  foreach v_table in array array['student_attendance', 'student_course_progress']
  loop
    execute format('drop policy if exists uphesc_mock_only_student_guard on public.%I', v_table);
    execute format(
      'create policy uphesc_mock_only_student_guard on public.%I as restrictive
       for all to authenticated
       using (not public.is_uphesc_mock_only_student(student_user_id)
              and not public.is_uphesc_mock_only_student(auth.uid()))
       with check (not public.is_uphesc_mock_only_student(student_user_id)
                   and not public.is_uphesc_mock_only_student(auth.uid()))',
      v_table
    );
  end loop;
end;
$$;

drop policy if exists uphesc_mock_only_tasks_guard on public.faculty_tasks;
create policy uphesc_mock_only_tasks_guard on public.faculty_tasks as restrictive
for all to authenticated
using (
  not public.is_uphesc_mock_only_batch(batch_id)
  and not public.is_uphesc_mock_only_student(student_user_id)
  and not public.is_uphesc_mock_only_student(auth.uid())
)
with check (
  not public.is_uphesc_mock_only_batch(batch_id)
  and not public.is_uphesc_mock_only_student(student_user_id)
  and not public.is_uphesc_mock_only_student(auth.uid())
);

drop policy if exists uphesc_mock_only_tests_guard on public.mock_tests;
create policy uphesc_mock_only_tests_guard on public.mock_tests as restrictive
for all to authenticated
using (
  (not public.is_uphesc_mock_only_batch(batch_id) and not public.is_uphesc_mock_only_course(course_id))
  or (
    public.is_uphesc_mock_only_batch(batch_id) and exam_type = 'mock'
    and exists (select 1 from public.batches b where b.id = batch_id and b.course_id = mock_tests.course_id)
  )
)
with check (
  (not public.is_uphesc_mock_only_batch(batch_id) and not public.is_uphesc_mock_only_course(course_id))
  or (
    public.is_uphesc_mock_only_batch(batch_id) and exam_type = 'mock'
    and exists (select 1 from public.batches b where b.id = batch_id and b.course_id = mock_tests.course_id)
  )
);

drop policy if exists uphesc_mock_only_questions_guard on public.mcq_questions;
create policy uphesc_mock_only_questions_guard on public.mcq_questions as restrictive
for select to authenticated
using (
  not public.is_uphesc_mock_only_student(auth.uid())
  or exists (
    select 1 from public.mock_tests t
    join public.enrollments e on e.batch_id = t.batch_id
    where t.id = mock_test_id and t.is_published = true
      and t.exam_type = 'mock' and e.student_user_id = auth.uid()
  )
);

create unique index if not exists idx_uphesc_mock_only_registration_payment
on public.student_registrations (razorpay_payment_id)
where mode = 'paid' and lower(btrim(course)) = 'uphesc-mock only'
  and razorpay_payment_id is not null;

commit;
