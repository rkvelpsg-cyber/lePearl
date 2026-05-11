import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ResultSummary = {
  score: number;
  rank: number | null;
  participantCount: number;
};

async function getStudentFromToken(token: string) {
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

  if (profileError || profile?.role !== "student") return null;

  return { userId: userData.user.id };
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

    const tokenStudent = await getStudentFromToken(token);
    if (!tokenStudent) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { testIds?: number[] };
    const requestedTestIds = Array.from(
      new Set(
        (body.testIds ?? [])
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value) && value > 0),
      ),
    );

    if (requestedTestIds.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    const service = createServerClient();

    const { data: enrollments, error: enrollmentError } = await service
      .from("enrollments")
      .select("batch_id, batches(course_id)")
      .eq("student_user_id", tokenStudent.userId);

    if (enrollmentError) throw enrollmentError;

    const allowedBatchIds = new Set<number>();
    const allowedCourseIds = new Set<number>();

    (
      (enrollments ?? []) as Array<{
        batch_id: number;
        batches:
          | { course_id: number | null }
          | { course_id: number | null }[]
          | null;
      }>
    ).forEach((row) => {
      if (row.batch_id) allowedBatchIds.add(row.batch_id);
      const batchObj = Array.isArray(row.batches)
        ? (row.batches[0] ?? null)
        : row.batches;
      if (batchObj?.course_id) allowedCourseIds.add(batchObj.course_id);
    });

    const { data: tests, error: testsError } = await service
      .from("mock_tests")
      .select("id, batch_id, course_id")
      .in("id", requestedTestIds);

    if (testsError) throw testsError;

    const accessibleTestIds = (
      (tests ?? []) as Array<{
        id: number;
        batch_id: number | null;
        course_id: number | null;
      }>
    )
      .filter((test) => {
        if (test.batch_id != null) return allowedBatchIds.has(test.batch_id);
        if (test.course_id != null) return allowedCourseIds.has(test.course_id);
        return false;
      })
      .map((test) => test.id);

    if (accessibleTestIds.length === 0) {
      return NextResponse.json({ summaries: {} });
    }

    const [ownAttemptsRes, allAttemptsRes] = await Promise.all([
      service
        .from("mock_test_attempts")
        .select("mock_test_id, scored_marks")
        .eq("student_user_id", tokenStudent.userId)
        .in("mock_test_id", accessibleTestIds),
      service
        .from("mock_test_attempts")
        .select("mock_test_id, student_user_id, scored_marks, attempted_at")
        .in("mock_test_id", accessibleTestIds),
    ]);

    if (ownAttemptsRes.error) throw ownAttemptsRes.error;
    if (allAttemptsRes.error) throw allAttemptsRes.error;

    const ownAttempts = new Map<number, number>();
    (
      (ownAttemptsRes.data ?? []) as Array<{
        mock_test_id: number;
        scored_marks: number;
      }>
    ).forEach((row) => {
      ownAttempts.set(row.mock_test_id, Number(row.scored_marks ?? 0));
    });

    const attemptsByTest = new Map<
      number,
      Array<{
        student_user_id: string;
        scored_marks: number;
        attempted_at: string | null;
      }>
    >();

    (
      (allAttemptsRes.data ?? []) as Array<{
        mock_test_id: number;
        student_user_id: string;
        scored_marks: number;
        attempted_at: string | null;
      }>
    ).forEach((row) => {
      const list = attemptsByTest.get(row.mock_test_id) ?? [];
      list.push({
        student_user_id: row.student_user_id,
        scored_marks: Number(row.scored_marks ?? 0),
        attempted_at: row.attempted_at,
      });
      attemptsByTest.set(row.mock_test_id, list);
    });

    const summaries: Record<number, ResultSummary> = {};

    accessibleTestIds.forEach((testId) => {
      const ownScore = ownAttempts.get(testId);
      if (ownScore == null) return;

      const ranked = (attemptsByTest.get(testId) ?? []).sort((a, b) => {
        if (b.scored_marks !== a.scored_marks) {
          return b.scored_marks - a.scored_marks;
        }
        const aTime = a.attempted_at ? new Date(a.attempted_at).getTime() : 0;
        const bTime = b.attempted_at ? new Date(b.attempted_at).getTime() : 0;
        return aTime - bTime;
      });

      let rank: number | null = null;
      let currentRank = 0;
      let previousScore: number | null = null;

      ranked.forEach((attempt, index) => {
        if (previousScore === null || attempt.scored_marks !== previousScore) {
          currentRank = index + 1;
          previousScore = attempt.scored_marks;
        }
        if (attempt.student_user_id === tokenStudent.userId && rank === null) {
          rank = currentRank;
        }
      });

      summaries[testId] = {
        score: ownScore,
        rank,
        participantCount: ranked.length,
      };
    });

    return NextResponse.json({ summaries });
  } catch (error) {
    console.error("student test-results error:", error);
    return NextResponse.json(
      { error: "Failed to load test results." },
      { status: 500 },
    );
  }
}
