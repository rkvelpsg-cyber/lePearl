import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { isValidStudentRegistrationCourse } from "@/lib/studentRegistration";

export const runtime = "nodejs";

type AdminStudentsManageBody = {
  action?: "update" | "delete";
  studentUserId?: string;
  registrationNo?: string | null;
  phone?: string | null;
  courseName?: string | null;
  studentName?: string | null;
  facultyName?: string | null;
  studentEmail?: string | null;
  username?: string | null;
  password?: string | null;
};

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeCode(value: string) {
  return normalizeLabel(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeEnv(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

async function verifyAdminFromToken(token: string) {
  const cleanedToken = token.trim();
  if (!cleanedToken) {
    return null;
  }

  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) {
    return null;
  }

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${cleanedToken}` } },
  });

  const { data: tokenData, error: tokenError } = await anon.auth.getUser();
  if (tokenError || !tokenData.user) {
    return null;
  }

  const userId = tokenData.user.id;

  const { data: rpcRole } = await anon.rpc("current_user_role");
  const normalizedRpcRole = String(rpcRole || "").toLowerCase();
  if (
    normalizedRpcRole === "admin" ||
    normalizedRpcRole === "super_admin" ||
    normalizedRpcRole === "administrator"
  ) {
    return userId;
  }

  try {
    const service = createServerClient();
    const { data: adminProfile } = await service
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminProfile?.user_id) {
      return userId;
    }
  } catch {
    // fall through
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AdminStudentsManageBody;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserId = await verifyAdminFromToken(token);
    if (!adminUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentUserId = body.studentUserId?.trim();
    if (!studentUserId) {
      return NextResponse.json(
        { error: "Student user ID is required." },
        { status: 400 },
      );
    }

    const action = body.action;
    if (action !== "update" && action !== "delete") {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const service = createServerClient();

    if (action === "update") {
      const registrationNo = body.registrationNo?.trim() || null;
      const phone = body.phone?.trim() || null;
      const courseName = body.courseName?.trim() || null;
      const studentName = body.studentName?.trim() || null;
      const facultyName = body.facultyName?.trim() || null;
      const studentEmail = body.studentEmail?.trim().toLowerCase() || null;
      const username = body.username?.trim().toLowerCase() || null;
      const password = body.password?.trim() || null;

      if (!studentName) {
        return NextResponse.json(
          { error: "Student name is required." },
          { status: 400 },
        );
      }

      if (!registrationNo) {
        return NextResponse.json(
          { error: "Registration number is required." },
          { status: 400 },
        );
      }

      if (!courseName) {
        return NextResponse.json(
          { error: "Course name is required." },
          { status: 400 },
        );
      }

      if (!isValidStudentRegistrationCourse(courseName)) {
        return NextResponse.json(
          {
            error:
              "Please select a valid course from the New Registrations list.",
          },
          { status: 400 },
        );
      }

      if (!facultyName) {
        return NextResponse.json(
          { error: "Faculty name is required." },
          { status: 400 },
        );
      }

      if (!studentEmail || !isValidEmail(studentEmail)) {
        return NextResponse.json(
          { error: "Please enter a valid student email ID." },
          { status: 400 },
        );
      }

      if (!username || username.length < 4) {
        return NextResponse.json(
          { error: "Please enter a valid username." },
          { status: 400 },
        );
      }

      const { data: currentStudent, error: currentStudentError } = await service
        .from("profiles")
        .select("user_id, username")
        .eq("user_id", studentUserId)
        .eq("role", "student")
        .maybeSingle();

      if (currentStudentError) throw currentStudentError;
      if (!currentStudent?.user_id) {
        return NextResponse.json(
          { error: "Student account was not found." },
          { status: 404 },
        );
      }

      const { data: usernameConflict } = await service
        .from("profiles")
        .select("user_id")
        .ilike("username", username)
        .neq("user_id", studentUserId)
        .maybeSingle();

      if (usernameConflict) {
        return NextResponse.json(
          { error: "Username already exists. Please choose another username." },
          { status: 409 },
        );
      }

      const { data: facultyProfiles, error: facultyError } = await service
        .from("profiles")
        .select("user_id, full_name")
        .eq("role", "faculty");

      if (facultyError) throw facultyError;

      const faculty = (facultyProfiles ?? []).find(
        (f) => normalizeLabel(f.full_name) === normalizeLabel(facultyName),
      );

      if (!faculty) {
        return NextResponse.json(
          {
            error:
              "Selected faculty account was not found in the system. Please verify faculty setup.",
          },
          { status: 400 },
        );
      }

      const { data: courseRows, error: courseFetchError } = await service
        .from("courses")
        .select("id, title, code");

      if (courseFetchError) throw courseFetchError;

      let matchedCourse = (courseRows ?? []).find(
        (c) => normalizeLabel(c.title) === normalizeLabel(courseName),
      );

      if (!matchedCourse) {
        const courseCode = `${normalizeCode(courseName)}-${Date.now().toString().slice(-5)}`;
        const { data: createdCourse, error: courseCreateError } = await service
          .from("courses")
          .insert({
            code: courseCode,
            title: courseName,
            is_active: true,
          })
          .select("id, title, code")
          .single();

        if (courseCreateError) throw courseCreateError;
        matchedCourse = createdCourse;
      }

      const { data: existingBatch } = await service
        .from("batches")
        .select("id")
        .eq("course_id", matchedCourse.id)
        .eq("faculty_user_id", faculty.user_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let batchId = existingBatch?.id ?? null;

      if (!batchId) {
        const batchName = `${normalizeCode(courseName).slice(0, 10)}-${faculty.full_name.split(" ").slice(-1)[0]}-A`;
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

        if (batchCreateError) throw batchCreateError;
        batchId = createdBatch.id;
      }

      const shouldResetPassword = Boolean(password);

      const { error: authUpdateError } =
        await service.auth.admin.updateUserById(studentUserId, {
          email: studentEmail,
          password: password || undefined,
          email_confirm: true,
          user_metadata: {
            full_name: studentName,
            username,
          },
        });

      if (authUpdateError) throw authUpdateError;

      const { error: profileUpdateError } = await service
        .from("profiles")
        .update({
          full_name: studentName,
          phone,
          registration_no: registrationNo,
          email: studentEmail,
          username,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", studentUserId)
        .eq("role", "student");

      if (profileUpdateError) throw profileUpdateError;

      const { error: studentProfileUpdateError } = await service
        .from("student_profiles")
        .update({
          registration_no: registrationNo,
          target_exam: courseName,
          must_reset_password: shouldResetPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", studentUserId);

      if (studentProfileUpdateError) throw studentProfileUpdateError;

      const { error: deleteEnrollmentsError } = await service
        .from("enrollments")
        .delete()
        .eq("student_user_id", studentUserId);

      if (deleteEnrollmentsError) throw deleteEnrollmentsError;

      const { error: insertEnrollmentError } = await service
        .from("enrollments")
        .insert({
          student_user_id: studentUserId,
          batch_id: batchId,
          enrolled_on: new Date().toISOString().slice(0, 10),
          status: "active",
        });

      if (insertEnrollmentError) throw insertEnrollmentError;

      await service.from("activity_logs").insert({
        actor_user_id: adminUserId,
        actor_role: "admin",
        action: "update_student",
        entity_name: "profiles",
        entity_id: studentUserId,
        details: {
          registrationNo,
          phone,
          courseName,
          studentName,
          facultyName,
          studentEmail,
          username,
          passwordUpdated: Boolean(password),
        },
      });

      return NextResponse.json({
        ok: true,
        message: "Student details updated successfully.",
      });
    }

    const { error: deleteError } =
      await service.auth.admin.deleteUser(studentUserId);

    if (deleteError) throw deleteError;

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: "delete_student",
      entity_name: "profiles",
      entity_id: studentUserId,
      details: { studentUserId },
    });

    return NextResponse.json({
      ok: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("admin students manage error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to manage student.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
