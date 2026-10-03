import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { getCanonicalPaidEnrollmentBatch } from "@/lib/paidEnrollmentBatchMapping";

export const runtime = "nodejs";

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

function normalizeCode(value: string) {
  const cleaned = value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 18);

  if (cleaned.length > 0) {
    return cleaned;
  }

  return `COURSE-${Date.now()}`;
}

function getDefaultFacultyForCourse(course: string) {
  const canonicalMapping = getCanonicalPaidEnrollmentBatch(course);
  if (canonicalMapping?.facultyName) {
    return canonicalMapping.facultyName;
  }

  const normalized = normalizeForMatch(course);

  if (normalized.includes("upgdc")) {
    return "Dr. Prem Shankar Pandey";
  }

  if (
    normalized.includes("uphesc") ||
    normalized.includes("interviewpreparationassistantprofessor") ||
    normalized.includes("interviewpreparationphdinterview") ||
    normalized.includes("communicationskills") ||
    normalized.includes("researchassistance")
  ) {
    return "Dr. Prem Shankar Pandey";
  }

  if (
    normalized.includes("netpaper1") ||
    normalized.includes("netpaper2") ||
    normalized.includes("netpaper2english") ||
    normalized.includes("ltgrade") ||
    normalized.includes("set")
  ) {
    return "Ms Sadhana";
  }

  if (normalized.includes("mppsc")) {
    return "Ms Neelu Patel";
  }

  if (normalized.includes("gic")) {
    return "Ms Sadhana";
  }

  return null;
}

async function getUserIdFromToken(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public env vars are missing.");
  }

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await anon.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = createServerClient();

    const { data: profile } = await service
      .from("profiles")
      .select("role, email, registration_no")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile || String(profile.role).toLowerCase() !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: existingEnrollment } = await service
      .from("enrollments")
      .select("id")
      .eq("student_user_id", userId)
      .limit(1)
      .maybeSingle();

    if (existingEnrollment?.id) {
      return NextResponse.json({ ok: true, ensured: false });
    }

    const { data: studentProfile } = await service
      .from("student_profiles")
      .select("target_exam, registration_no")
      .eq("user_id", userId)
      .maybeSingle();

    const profileEmail = String(profile.email ?? "")
      .trim()
      .toLowerCase();
    const registrationNo = String(
      studentProfile?.registration_no ?? profile.registration_no ?? "",
    )
      .trim()
      .toUpperCase();

    let courseName = String(studentProfile?.target_exam ?? "").trim();

    if (!courseName && (profileEmail || registrationNo)) {
      const registrationQuery = service
        .from("student_registrations")
        .select("course, mode, status, created_at")
        .eq("mode", "paid")
        .order("created_at", { ascending: false })
        .limit(1);

      const { data: registrationRow } = profileEmail
        ? await registrationQuery.ilike("email", profileEmail).maybeSingle()
        : await registrationQuery
            .ilike("registration_no", registrationNo)
            .maybeSingle();

      courseName = String(registrationRow?.course ?? "").trim();
    }

    if (!courseName) {
      return NextResponse.json({ ok: true, ensured: false });
    }

    const defaultFacultyName = getDefaultFacultyForCourse(courseName);
    const canonicalBatchName =
      getCanonicalPaidEnrollmentBatch(courseName)?.batchName;
    if (!defaultFacultyName) {
      return NextResponse.json({ ok: true, ensured: false });
    }

    const { data: facultyProfiles, error: facultyError } = await service
      .from("profiles")
      .select("user_id, full_name")
      .eq("role", "faculty");

    if (facultyError) throw facultyError;

    const faculty = (facultyProfiles ?? []).find(
      (f) => normalizeLabel(f.full_name) === normalizeLabel(defaultFacultyName),
    );

    if (!faculty?.user_id) {
      return NextResponse.json({ ok: true, ensured: false });
    }

    const { data: courseRows, error: courseError } = await service
      .from("courses")
      .select("id, title, code");

    if (courseError) throw courseError;

    // Resolve canonical course name via alias mapping so that e.g.
    // "NET Paper 2 (English)" correctly matches the DB title
    // "NTA NET Paper 2 (English)" and avoids creating a duplicate course.
    const canonicalCourseName =
      getCanonicalPaidEnrollmentBatch(courseName)?.courseName ?? courseName;

    const normalizedRequest = normalizeForMatch(canonicalCourseName);

    // 1st pass – exact match on canonical name
    let matchedCourse = (courseRows ?? []).find(
      (c) => normalizeForMatch(c.title) === normalizedRequest,
    );

    // 2nd pass – loose includes match (handles old/renamed legacy titles)
    if (!matchedCourse) {
      matchedCourse = (courseRows ?? []).find((c) => {
        const current = normalizeForMatch(c.title);
        return (
          current.includes(normalizedRequest) ||
          normalizedRequest.includes(current)
        );
      });
    }

    if (!matchedCourse) {
      const courseCode = `${normalizeCode(canonicalCourseName)}-${Date.now().toString().slice(-5)}`;
      const { data: createdCourse, error: createCourseError } = await service
        .from("courses")
        .insert({
          code: courseCode,
          title: canonicalCourseName,
          is_active: true,
        })
        .select("id, title, code")
        .single();

      if (createCourseError || !createdCourse) {
        throw createCourseError || new Error("Failed to create course");
      }

      matchedCourse = createdCourse;
    }

    const batchLookup = service
      .from("batches")
      .select("id")
      .eq("course_id", matchedCourse.id)
      .eq("faculty_user_id", faculty.user_id);

    const { data: existingBatch } = canonicalBatchName
      ? await batchLookup.eq("batch_name", canonicalBatchName).maybeSingle()
      : await batchLookup
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

    let batchId = existingBatch?.id ?? null;

    if (!batchId) {
      const batchName =
        canonicalBatchName ||
        `${normalizeCode(courseName).slice(0, 10)}-${faculty.full_name.split(" ").slice(-1)[0]}-A`;
      const { data: createdBatch, error: batchCreateError } = await service
        .from("batches")
        .insert({
          course_id: matchedCourse.id,
          batch_name: batchName,
          faculty_user_id: faculty.user_id,
          start_date: new Date().toISOString().slice(0, 10),
        })
        .select("id")
        .single();

      if (batchCreateError || !createdBatch) {
        throw batchCreateError || new Error("Failed to create batch");
      }

      batchId = createdBatch.id;
    }

    const { error: enrollmentError } = await service.from("enrollments").upsert(
      {
        student_user_id: userId,
        batch_id: batchId,
        status: "active",
      },
      { onConflict: "student_user_id,batch_id" },
    );

    if (enrollmentError) throw enrollmentError;

    return NextResponse.json({
      ok: true,
      ensured: true,
      data: {
        course: matchedCourse.title,
        batchId,
      },
    });
  } catch (error) {
    console.error("ensure-enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to ensure student enrollment." },
      { status: 500 },
    );
  }
}
