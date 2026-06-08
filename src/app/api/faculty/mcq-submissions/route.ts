import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type McqSubmissionRow = {
  id: number;
  mock_test_id: number;
  student_user_id: string;
  attempted_at: string | null;
  scored_marks: number | null;
};

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

async function getFacultyUserIdFromToken(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase client configuration is missing.");
  }

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await anon.auth.getUser(token);
  if (userError || !userData.user) return null;

  const service = createServerClient();
  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (profileError || profile?.role !== "faculty") return null;

  return userData.user.id;
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

    const facultyUserId = await getFacultyUserIdFromToken(token);
    if (!facultyUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { testId?: number | string };
    const testId = Number(body.testId);

    if (!Number.isFinite(testId) || testId <= 0) {
      return NextResponse.json({ error: "Invalid testId." }, { status: 400 });
    }

    const service = createServerClient();

    const { data: test, error: testError } = await service
      .from("mock_tests")
      .select("id, batch_id")
      .eq("id", testId)
      .maybeSingle();

    if (testError) throw testError;
    if (!test) {
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    if (!test.batch_id) {
      return NextResponse.json({ submissions: [] });
    }

    const { data: ownedBatch, error: batchError } = await service
      .from("batches")
      .select("id")
      .eq("id", test.batch_id)
      .eq("faculty_user_id", facultyUserId)
      .maybeSingle();

    if (batchError) throw batchError;
    if (!ownedBatch) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: enrollments, error: enrollmentError } = await service
      .from("enrollments")
      .select("student_user_id")
      .eq("batch_id", test.batch_id);

    if (enrollmentError) throw enrollmentError;

    const allowedStudentIds = [
      ...new Set((enrollments ?? []).map((row) => row.student_user_id)),
    ];

    if (allowedStudentIds.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    const { data: submissionsData, error: submissionsError } = await service
      .from("mock_test_attempts")
      .select("id, mock_test_id, student_user_id, attempted_at, scored_marks")
      .eq("mock_test_id", testId)
      .in("student_user_id", allowedStudentIds)
      .order("attempted_at", { ascending: false });

    if (submissionsError) throw submissionsError;

    const submissions = (submissionsData ?? []) as McqSubmissionRow[];
    const studentIdsInSubmissions = [
      ...new Set(submissions.map((row) => row.student_user_id).filter(Boolean)),
    ];

    const nameMap: Record<string, string> = {};
    if (studentIdsInSubmissions.length > 0) {
      const { data: profilesData, error: profilesError } = await service
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIdsInSubmissions);

      if (profilesError) throw profilesError;

      (profilesData ?? []).forEach((profile) => {
        if (profile.full_name) {
          nameMap[profile.user_id] = profile.full_name;
        }
      });

      const unresolvedIds = studentIdsInSubmissions.filter(
        (id) => !nameMap[id],
      );

      if (unresolvedIds.length > 0) {
        const { data: studentProfiles, error: studentProfilesError } =
          await service
            .from("student_profiles")
            .select("user_id, full_name")
            .in("user_id", unresolvedIds);

        if (studentProfilesError) throw studentProfilesError;

        (studentProfiles ?? []).forEach((profile) => {
          if (profile.full_name) {
            nameMap[profile.user_id] = profile.full_name;
          }
        });
      }
    }

    const rows = submissions.map((row) => ({
      ...row,
      submitted_at: row.attempted_at,
      student_name: nameMap[row.student_user_id] || "Student",
    }));

    return NextResponse.json({ submissions: rows });
  } catch (error) {
    console.error("faculty mcq submissions error:", error);
    return NextResponse.json(
      {
        error: toErrorMessage(error, "Failed to load MCQ submissions."),
      },
      { status: 500 },
    );
  }
}
