import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import {
  isValidStudentRegistrationCourse,
  sanitizeRegistrationValue,
} from "@/lib/studentRegistration";

export const runtime = "nodejs";

type CreateStudentCredentialBody = {
  accessToken?: string;
  registrationId?: string;
  courseName?: string;
  registrationNumber?: string;
  studentName?: string;
  facultyName?: string;
  studentEmail?: string;
  studentPhone?: string;
  username?: string;
  defaultPassword?: string;
};

const FACULTY_OPTIONS = [
  "Ms Sadhana",
  "Ms Neelu Patel",
  "Dr Babli Mallick",
  "Dr Harendra K Tripathi",
  "Dr. Prem Shankar Pandey",
] as const;

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._-]{4,32}$/.test(value);
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

function getReadableErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    const chunks: string[] = [];
    if (err.message) chunks.push(err.message);
    if (err.details) chunks.push(err.details);
    if (err.hint) chunks.push(`Hint: ${err.hint}`);
    if (chunks.length > 0) {
      return chunks.join(" ");
    }

    if (err.code) {
      return `Database error (${err.code}).`;
    }
  }

  return "Failed to create student credentials.";
}

type AdminVerifyResult = {
  adminUserId: string | null;
  reason?: string;
};

async function verifyAdminFromToken(token: string): Promise<AdminVerifyResult> {
  const cleanedToken = token.trim();
  if (!cleanedToken) {
    return { adminUserId: null, reason: "Missing bearer token" };
  }

  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) {
    return {
      adminUserId: null,
      reason: "Supabase client configuration is missing",
    };
  }

  let userId: string | null = null;

  try {
    // Verify using the same project/session context as the frontend token.
    const anon = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${cleanedToken}` } },
    });

    const { data: tokenData, error: tokenError } = await anon.auth.getUser();
    if (!tokenError && tokenData.user) {
      userId = tokenData.user.id;

      // Primary role check via DB helper in JWT context.
      const { data: rpcRole } = await anon.rpc("current_user_role");
      const normalizedRpcRole = String(rpcRole || "").toLowerCase();
      const rpcIsAdmin =
        normalizedRpcRole === "admin" ||
        normalizedRpcRole === "super_admin" ||
        normalizedRpcRole === "administrator";

      if (rpcIsAdmin) {
        return { adminUserId: userId };
      }
    }
  } catch {
    // Fallback below handles environments where anon key is invalid on server.
  }

  // Service-key fallback for token validation + role checks.
  try {
    const service = createServerClient();

    if (!userId) {
      const { data: serviceTokenData, error: serviceTokenError } =
        await service.auth.getUser(cleanedToken);
      if (serviceTokenError || !serviceTokenData.user) {
        return {
          adminUserId: null,
          reason: "Invalid or expired session token",
        };
      }
      userId = serviceTokenData.user.id;
    }

    const { data: profile } = await service
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: adminProfile } = await service
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    const role = String(profile?.role || "").toLowerCase();
    const isAdminRole =
      role === "admin" || role === "super_admin" || role === "administrator";

    if (isAdminRole || adminProfile?.user_id) {
      return { adminUserId: userId };
    }
  } catch (error) {
    const message = getReadableErrorMessage(error).toLowerCase();
    if (message.includes("placeholder") && message.includes("service key")) {
      return {
        adminUserId: null,
        reason:
          "Supabase service key is still a placeholder in .env.local. Replace SUPABASE_SERVICE_ROLE_KEY with the real service_role key from the same project, then restart the dev server.",
      };
    }
    if (message.includes("invalid api key")) {
      return {
        adminUserId: null,
        reason:
          "Invalid API key. Please verify SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in your env and restart the server.",
      };
    }
    return { adminUserId: null, reason: getReadableErrorMessage(error) };
  }

  return {
    adminUserId: null,
    reason: "Authenticated user does not have admin role",
  };
}

export async function POST(req: NextRequest) {
  let createdUserId: string | null = null;

  try {
    const body = (await req.json()) as CreateStudentCredentialBody;

    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = headerToken || body.accessToken?.trim() || null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminUserId, reason } = await verifyAdminFromToken(token);
    if (!adminUserId) {
      return NextResponse.json(
        { error: reason || "Unauthorized" },
        { status: 401 },
      );
    }

    const registrationId = body.registrationId?.trim();
    const courseName = sanitizeRegistrationValue(body.courseName ?? "");
    const registrationNumber = sanitizeRegistrationValue(
      body.registrationNumber ?? "",
    );
    const studentName = sanitizeRegistrationValue(body.studentName ?? "");
    const facultyName = sanitizeRegistrationValue(body.facultyName ?? "");
    const studentEmail = sanitizeRegistrationValue(
      body.studentEmail ?? "",
    ).toLowerCase();
    const studentPhone = sanitizeRegistrationValue(body.studentPhone ?? "");
    const username = sanitizeRegistrationValue(
      body.username ?? "",
    ).toLowerCase();
    const defaultPassword = body.defaultPassword?.trim() || "LePearl@123";

    if (!isValidStudentRegistrationCourse(courseName)) {
      return NextResponse.json(
        { error: "Please select a valid course from the registration list." },
        { status: 400 },
      );
    }

    if (!registrationNumber) {
      return NextResponse.json(
        { error: "Registration Number is required." },
        { status: 400 },
      );
    }

    if (!studentName || studentName.length < 2) {
      return NextResponse.json(
        { error: "Student Name is required." },
        { status: 400 },
      );
    }

    if (
      !FACULTY_OPTIONS.includes(facultyName as (typeof FACULTY_OPTIONS)[number])
    ) {
      return NextResponse.json(
        { error: "Please select a faculty from the allowed list." },
        { status: 400 },
      );
    }

    if (!isValidEmail(studentEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid Student Email ID." },
        { status: 400 },
      );
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 4-32 characters and can contain letters, numbers, dot, underscore, or hyphen.",
        },
        { status: 400 },
      );
    }

    if (defaultPassword.length < 8) {
      return NextResponse.json(
        { error: "Default password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const service = createServerClient();

    const { data: existingUsername } = await service
      .from("profiles")
      .select("user_id")
      .ilike("username", username)
      .maybeSingle();

    if (existingUsername) {
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

    const { data: createdAuthUser, error: createUserError } =
      await service.auth.admin.createUser({
        email: studentEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          full_name: studentName,
          username,
        },
      });

    if (createUserError || !createdAuthUser.user) {
      const msg = createUserError?.message || "Failed to create auth user.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    createdUserId = createdAuthUser.user.id;

    const { error: profileInsertError } = await service
      .from("profiles")
      .insert({
        user_id: createdUserId,
        role: "student",
        full_name: studentName,
        registration_no: registrationNumber,
        email: studentEmail,
        phone: studentPhone || null,
        is_active: true,
        username,
      });

    if (profileInsertError) throw profileInsertError;

    const { error: studentProfileInsertError } = await service
      .from("student_profiles")
      .insert({
        user_id: createdUserId,
        registration_no: registrationNumber,
        target_exam: courseName,
        joined_on: new Date().toISOString().slice(0, 10),
        must_reset_password: true,
      });

    if (studentProfileInsertError) throw studentProfileInsertError;

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

    const { error: enrollmentError } = await service.from("enrollments").upsert(
      {
        student_user_id: createdUserId,
        batch_id: batchId,
        status: "active",
      },
      { onConflict: "student_user_id,batch_id" },
    );

    if (enrollmentError) throw enrollmentError;

    if (registrationId) {
      await service
        .from("student_registrations")
        .update({ status: "credentials_created" })
        .eq("id", registrationId);
    } else {
      await service
        .from("student_registrations")
        .update({ status: "credentials_created" })
        .eq("email", studentEmail)
        .eq("course", courseName)
        .eq("full_name", studentName)
        .eq("status", "pending");
    }

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: "create_student_credentials",
      entity_name: "profiles",
      entity_id: createdUserId,
      details: {
        student_name: studentName,
        username,
        course: courseName,
        faculty: faculty.full_name,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Student credentials created and assigned successfully.",
      data: {
        userId: createdUserId,
        username,
        email: studentEmail,
        course: courseName,
        faculty: faculty.full_name,
      },
    });
  } catch (error) {
    if (createdUserId) {
      try {
        const service = createServerClient();
        await service.auth.admin.deleteUser(createdUserId);
      } catch (rollbackError) {
        console.error(
          "Rollback failed after create-student error:",
          rollbackError,
        );
      }
    }

    console.error("create-student-credentials error:", error);
    const message = getReadableErrorMessage(error);

    // Friendly guidance for the known migration-dependent fields.
    if (
      message.toLowerCase().includes('column "username"') ||
      message.toLowerCase().includes("must_reset_password")
    ) {
      return NextResponse.json(
        {
          error:
            "Database migration is missing. Please apply migration 20260509_add_student_login_credentials_fields.sql and retry.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
