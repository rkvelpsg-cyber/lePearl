-- Apply before deploying the PGT-Pandey-A application mapping.
-- Create a separate PGT course/batch under Dr Pandey.
-- Do not rename or transfer the existing PGT-TGT-Sadhana-A/TGT batch.
-- Existing students, academic content, and other assignments are untouched.
DO $$
DECLARE
  v_faculty_id uuid;
  v_course_id bigint;
  v_batch_id bigint;
  v_count integer;
BEGIN
  LOCK TABLE public.courses, public.batches IN SHARE ROW EXCLUSIVE MODE;

  SELECT count(*) INTO v_count
  FROM public.profiles
  WHERE role = 'faculty'
    AND regexp_replace(lower(full_name), '[^a-z0-9]+', '', 'g') = 'drpremshankarpandey';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one faculty profile for Dr Prem Shankar Pandey; found %.', v_count;
  END IF;
  SELECT user_id INTO v_faculty_id
  FROM public.profiles
  WHERE role = 'faculty'
    AND regexp_replace(lower(full_name), '[^a-z0-9]+', '', 'g') = 'drpremshankarpandey';

  SELECT count(*) INTO v_count
  FROM public.courses
  WHERE regexp_replace(lower(title), '[^a-z0-9]+', '', 'g') = 'pgt';
  IF v_count > 1 THEN
    RAISE EXCEPTION 'Multiple PGT courses found. Resolve duplicate courses before retrying.';
  END IF;
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE regexp_replace(lower(title), '[^a-z0-9]+', '', 'g') = 'pgt';

  IF v_course_id IS NULL THEN
    IF EXISTS (SELECT 1 FROM public.courses WHERE lower(code) = 'pgt') THEN
      RAISE EXCEPTION 'Course code PGT is already used by a different course. No changes made.';
    END IF;
    INSERT INTO public.courses (code, title, is_active)
    VALUES ('PGT', 'PGT', true)
    RETURNING id INTO v_course_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = v_course_id AND NOT is_active
  ) THEN
    RAISE EXCEPTION 'Existing PGT course is inactive. Review it before retrying.';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.batches
  WHERE lower(trim(batch_name)) = 'pgt-pandey-a';
  IF v_count > 1 THEN
    RAISE EXCEPTION 'Multiple PGT-Pandey-A batches found. Resolve duplicates before retrying.';
  END IF;

  IF v_count = 1 THEN
    SELECT id INTO v_batch_id
    FROM public.batches
    WHERE lower(trim(batch_name)) = 'pgt-pandey-a'
      AND batch_name = 'PGT-Pandey-A'
      AND course_id = v_course_id
      AND faculty_user_id = v_faculty_id;
    IF v_batch_id IS NULL THEN
      RAISE EXCEPTION 'Existing PGT-Pandey-A batch has a conflicting name, course or faculty. No changes made.';
    END IF;
  ELSE
    INSERT INTO public.batches (course_id, batch_name, faculty_user_id, start_date)
    VALUES (v_course_id, 'PGT-Pandey-A', v_faculty_id, current_date)
    RETURNING id INTO v_batch_id;
  END IF;

  RAISE NOTICE 'PGT course %, batch % (PGT-Pandey-A), is assigned to Dr Prem Shankar Pandey. Existing TGT/combined batches, enrollments and academic content are unchanged.', v_course_id, v_batch_id;
END;
$$;
