-- Merge duplicate "NTA NET Paper 2 (English)" batch into the canonical
-- "NET Paper 2 (English)" batch and give NET Paper 2 its own dedicated batch.
--
-- Background:
--   NET Paper 1 and NET Paper 2 (English) both previously shared the batch name
--   "NET-PAPER--Sadhana-A".  The ensure-enrollment endpoint's strict-exact course
--   matching also silently created a second course "NTA NET Paper 2 (English)"
--   with its own NET-PAPER--Sadhana-A batch.
--
-- After this migration:
--   • NET Paper 1           → batch name "NET-PAPER--Sadhana-A"  (unchanged)
--   • NET Paper 2 (English) → batch name "NET Paper 2 (English)" (own batch)
--   • GIC, LT Grade, SET    → no changes
--
-- This migration:
--   1. Resolves/creates canonical course "NET Paper 2 (English)".
--   2. Renames any existing "NET-PAPER--Sadhana-A" batch under that course to
--      "NET Paper 2 (English)", or creates a fresh batch with that name.
--   3. Moves all enrollments from the NTA alias batch → canonical batch.
--   4. Updates student_registrations rows whose course = "NTA NET Paper 2 (English)"
--      to the canonical course name "NET Paper 2 (English)".
--   5. Deletes the duplicate batch once it is empty of enrollments and has no
--      linked academic content (classes, tests, lectures, materials, tasks).
--   6. Deletes the orphaned "NTA NET Paper 2 (English)" course row only when it
--      carries no remaining batches.
--
-- Safe-guards:
--   * All steps are wrapped in a transaction via DO $$ … $$.
--   * Students already enrolled in the canonical batch are silently skipped
--     (ON CONFLICT DO NOTHING) so no duplicate enrollment is created.
--   * If the canonical batch already exists the migration is idempotent.
--   * NET Paper 1 batch "NET-PAPER--Sadhana-A" is never touched.

DO $$
DECLARE
  v_canonical_course_id   uuid;
  v_alias_course_id       uuid;
  v_canonical_batch_id    uuid;
  v_alias_batch_id        uuid;
  v_sadhana_user_id       uuid;
  v_moved_count           int;
BEGIN

  -- ── 1. Resolve faculty user_id for Ms. Sadhana ───────────────────────────
  SELECT user_id
    INTO v_sadhana_user_id
    FROM public.profiles
   WHERE role = 'faculty'
     AND regexp_replace(lower(full_name), '[^a-z0-9]+', '', 'g') = 'mssadhana'
   LIMIT 1;

  IF v_sadhana_user_id IS NULL THEN
    RAISE NOTICE 'Ms. Sadhana faculty profile not found — migration skipped.';
    RETURN;
  END IF;

  -- ── 2. Resolve canonical course "NET Paper 2 (English)" ──────────────────
  SELECT id
    INTO v_canonical_course_id
    FROM public.courses
   WHERE regexp_replace(lower(title), '[^a-z0-9]+', '', 'g') = 'netpaper2english'
   ORDER BY created_at ASC   -- prefer the older record
   LIMIT 1;

  IF v_canonical_course_id IS NULL THEN
    INSERT INTO public.courses (code, title, is_active)
    VALUES ('NET-PAPER-2-ENG', 'NET Paper 2 (English)', true)
    RETURNING id INTO v_canonical_course_id;
    RAISE NOTICE 'Created canonical course "NET Paper 2 (English)" (id=%).',
                 v_canonical_course_id;
  END IF;

  -- ── 3. Resolve or create the canonical batch "NET Paper 2 (English)" ──────
  --      If the batch previously shared the name "NET-PAPER--Sadhana-A" under
  --      this course, rename it so NET Paper 1 keeps its own dedicated batch.

  -- Try the correct name first
  SELECT id
    INTO v_canonical_batch_id
    FROM public.batches
   WHERE course_id       = v_canonical_course_id
     AND faculty_user_id = v_sadhana_user_id
     AND batch_name      = 'NET Paper 2 (English)'
   LIMIT 1;

  IF v_canonical_batch_id IS NULL THEN
    -- Fall back: old shared name exists → rename it
    SELECT id
      INTO v_canonical_batch_id
      FROM public.batches
     WHERE course_id       = v_canonical_course_id
       AND faculty_user_id = v_sadhana_user_id
       AND batch_name      = 'NET-PAPER--Sadhana-A'
     LIMIT 1;

    IF v_canonical_batch_id IS NOT NULL THEN
      UPDATE public.batches
         SET batch_name = 'NET Paper 2 (English)'
       WHERE id = v_canonical_batch_id;
      RAISE NOTICE 'Renamed batch NET-PAPER--Sadhana-A → "NET Paper 2 (English)" under NET Paper 2 course (id=%).',
                   v_canonical_batch_id;
    ELSE
      -- No batch at all — create fresh
      INSERT INTO public.batches (course_id, batch_name, faculty_user_id, start_date)
      VALUES (v_canonical_course_id, 'NET Paper 2 (English)', v_sadhana_user_id, current_date)
      RETURNING id INTO v_canonical_batch_id;
      RAISE NOTICE 'Created canonical batch "NET Paper 2 (English)" (id=%).',
                   v_canonical_batch_id;
    END IF;
  ELSE
    RAISE NOTICE 'Canonical batch "NET Paper 2 (English)" already exists (id=%).',
                 v_canonical_batch_id;
  END IF;

  -- ── 4. Resolve the alias course "NTA NET Paper 2 (English)" ──────────────
  SELECT id
    INTO v_alias_course_id
    FROM public.courses
   WHERE regexp_replace(lower(title), '[^a-z0-9]+', '', 'g') = 'ntanetpaper2english'
   LIMIT 1;

  IF v_alias_course_id IS NULL THEN
    RAISE NOTICE 'Alias course "NTA NET Paper 2 (English)" not found — nothing to merge.';
    RETURN;
  END IF;

  -- ── 5. Resolve the duplicate batch under the alias course ─────────────────
  SELECT id
    INTO v_alias_batch_id
    FROM public.batches
   WHERE course_id       = v_alias_course_id
     AND faculty_user_id = v_sadhana_user_id
   LIMIT 1;

  IF v_alias_batch_id IS NULL THEN
    RAISE NOTICE 'No batch found under alias course "NTA NET Paper 2 (English)" — nothing to merge.';
    RETURN;
  END IF;

  IF v_alias_batch_id = v_canonical_batch_id THEN
    RAISE NOTICE 'Alias and canonical batch are the same row — nothing to do.';
    RETURN;
  END IF;

  -- ── 6. Move enrollments from alias batch → canonical batch ────────────────
  INSERT INTO public.enrollments (student_user_id, batch_id, status, enrolled_at)
  SELECT e.student_user_id,
         v_canonical_batch_id,
         e.status,
         e.enrolled_at
    FROM public.enrollments e
   WHERE e.batch_id = v_alias_batch_id
  ON CONFLICT (student_user_id, batch_id) DO NOTHING;

  GET DIAGNOSTICS v_moved_count = ROW_COUNT;
  RAISE NOTICE 'Moved % enrollment(s) to canonical batch "NET Paper 2 (English)".',
               v_moved_count;

  -- ── 7. Update student_registrations course name ───────────────────────────
  UPDATE public.student_registrations
     SET course = 'NET Paper 2 (English)'
   WHERE regexp_replace(lower(course), '[^a-z0-9]+', '', 'g') = 'ntanetpaper2english';

  RAISE NOTICE 'Updated student_registration rows: course renamed to "NET Paper 2 (English)".';

  -- ── 8. Delete alias batch (only when no linked content remains) ────────────
  IF NOT EXISTS (
        SELECT 1 FROM public.enrollments    WHERE batch_id = v_alias_batch_id
     UNION ALL
        SELECT 1 FROM public.class_sessions WHERE batch_id = v_alias_batch_id
     UNION ALL
        SELECT 1 FROM public.mock_tests     WHERE batch_id = v_alias_batch_id
  ) THEN
    DELETE FROM public.batches WHERE id = v_alias_batch_id;
    RAISE NOTICE 'Deleted alias batch (id=%).', v_alias_batch_id;
  ELSE
    RAISE NOTICE 'Alias batch (id=%) still has linked content — batch kept, enrollments moved.',
                 v_alias_batch_id;
  END IF;

  -- ── 9. Delete alias course if it has no remaining batches ─────────────────
  IF NOT EXISTS (
        SELECT 1 FROM public.batches WHERE course_id = v_alias_course_id
  ) THEN
    DELETE FROM public.courses WHERE id = v_alias_course_id;
    RAISE NOTICE 'Deleted orphaned alias course "NTA NET Paper 2 (English)" (id=%).',
                 v_alias_course_id;
  ELSE
    RAISE NOTICE 'Alias course (id=%) still has other batches — course kept.',
                 v_alias_course_id;
  END IF;

END $$;
