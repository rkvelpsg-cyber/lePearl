import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { createServerClient } from "@/lib/supabase/server";
import {
  isValidStudentRegistrationCourse,
  sanitizeRegistrationValue,
} from "@/lib/studentRegistration";
import { getCanonicalPaidEnrollmentBatch } from "@/lib/paidEnrollmentBatchMapping";

export const runtime = "nodejs";
export const maxDuration = 26;

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
  repairAllSameEmailEnrollments?: boolean;
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

function buildCourseScopedAuthEmail(params: {
  contactEmail: string;
  username: string;
  registrationNo: string;
}) {
  const [localRaw, domainRaw] = params.contactEmail.toLowerCase().split("@");
  const local = (localRaw ?? "student")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 20);
  const domain = (domainRaw ?? "lepearleducation.com")
    .replace(/[^a-z0-9.-]/g, "")
    .slice(0, 50);

  const token = `${params.username}-${params.registrationNo}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 18);
  const fallbackToken = Date.now().toString(36);

  return `${local || "student"}+lp-${token || fallbackToken}-${Date.now().toString(36)}@${domain || "lepearleducation.com"}`;
}

function normalizeUsernameBase(value: string) {
  const cleaned = sanitizeRegistrationValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 20);

  return cleaned || "student";
}

function buildCourseScopedUsername(params: {
  baseUsername: string;
  courseName: string;
  registrationNo: string;
}) {
  const base = normalizeUsernameBase(params.baseUsername);
  const courseToken = normalizeCode(params.courseName)
    .toLowerCase()
    .replace(/-/g, "")
    .slice(0, 8);
  const registrationToken = params.registrationNo
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(-6);

  const tokenParts = [
    base,
    courseToken || "course",
    registrationToken || "reg",
  ];
  return tokenParts.join("-").slice(0, 32).replace(/-+$/g, "");
}

function getDefaultFacultyForCourse(course: string) {
  const canonicalMapping = getCanonicalPaidEnrollmentBatch(course);
  if (canonicalMapping?.facultyName) {
    return canonicalMapping.facultyName;
  }

  const normalized = normalizeLabel(course);

  if (normalized.includes("upgdc")) {
    return "Dr. Prem Shankar Pandey";
  }

  if (
    normalized.includes("uphesc") ||
    normalized.includes("interview preparation") ||
    normalized.includes("interviewpreparation") ||
    normalized.includes("communicationskills") ||
    normalized.includes("researchassistance")
  ) {
    return "Dr. Prem Shankar Pandey";
  }

  if (
    normalized.includes("netpaper1") ||
    normalized.includes("netpaper2") ||
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

function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function buildCredentialEmailContent(params: {
  studentName: string;
  courseName: string;
  registrationNumber: string;
  username: string;
  temporaryPassword: string;
}) {
  const subject = `LePearl Login Credentials - ${params.courseName}`;
  const text = [
    `Dear ${params.studentName},`,
    "",
    "Your course-specific login credentials are ready.",
    "",
    `Course: ${params.courseName}`,
    `Registration No: ${params.registrationNumber}`,
    `Username: ${params.username}`,
    `Temporary Password: ${params.temporaryPassword}`,
    "",
    "Use your username and temporary password to sign in. If you have multiple course enrolments, each course will have its own separate login credentials.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${params.studentName},</p>
      <p>Your course-specific login credentials are ready.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.courseName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.registrationNumber}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Username</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.username}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Temporary Password</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.temporaryPassword}</td></tr>
        </tbody>
      </table>
      <p>Use your username and temporary password to sign in. If you have multiple course enrolments, each course will have its own separate login credentials.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildRepairAdminEmailContent(params: {
  studentName: string;
  courseName: string;
  registrationNumber: string;
  username: string;
  temporaryPassword: string;
}) {
  const subject = `Legacy paid enrolment repaired - ${params.studentName} - ${params.courseName}`;
  const text = [
    "Dear Admin,",
    "",
    "A legacy paid enrolment has been repaired and course-specific credentials were created.",
    "",
    `Student Name: ${params.studentName}`,
    `Course: ${params.courseName}`,
    `Registration No: ${params.registrationNumber}`,
    `Username: ${params.username}`,
    `Temporary Password: ${params.temporaryPassword}`,
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear Admin,</p>
      <p>A legacy paid enrolment has been repaired and course-specific credentials were created.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Name</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.studentName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.courseName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.registrationNumber}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Username</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.username}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Temporary Password</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${params.temporaryPassword}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
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

  const url = sanitizeEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  );
  const anonKey = sanitizeEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  );

  let userId: string | null = null;

  if (url && anonKey) {
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

async function repairLegacySameEmailEnrollments(params: {
  service: ReturnType<typeof createServerClient>;
  adminUserId: string;
  studentEmail: string;
  defaultPassword: string;
}) {
  const { service, adminUserId, studentEmail, defaultPassword } = params;

  const { data: registrations, error: registrationsError } = await service
    .from("student_registrations")
    .select(
      "id, full_name, course, email, phone, registration_no, username, submitted_password, created_at, status, mode, payment_amount, final_payable, payment_status, payment_tenure, selected_fee_label",
    )
    .eq("mode", "paid")
    .ilike("email", studentEmail)
    .in("status", ["pending", "completed"])
    .order("created_at", { ascending: true });

  if (registrationsError) {
    throw registrationsError;
  }

  const rows = (registrations ?? []) as {
    id: string;
    full_name: string;
    course: string;
    email: string;
    phone: string | null;
    registration_no: string | null;
    username: string | null;
    submitted_password: string | null;
    created_at: string;
    payment_amount: number | null;
    final_payable: number | null;
    payment_status: string | null;
    payment_tenure: string | null;
    selected_fee_label: string | null;
  }[];

  if (rows.length === 0) {
    return {
      repairedCount: 0,
      skippedCount: 0,
      message: `No paid enrolments were found for ${studentEmail}.`,
      repairedCourses: [] as string[],
    };
  }

  const transporter = getTransporter();
  const adminPaymentRecipient =
    process.env.ADMIN_PAYMENT_EMAIL ??
    process.env.PAYMENT_EMAIL_TO ??
    process.env.GMAIL_USER ??
    process.env.SMTP_USER ??
    "admin@lepearleducation.com";
  const fromAddress =
    process.env.PAYMENT_EMAIL_FROM ??
    process.env.GMAIL_USER ??
    process.env.SMTP_USER ??
    adminPaymentRecipient;
  const repairedCourses: string[] = [];
  let repairedCount = 0;
  let skippedCount = 0;

  const { data: facultyProfiles, error: facultyError } = await service
    .from("profiles")
    .select("user_id, full_name")
    .eq("role", "faculty");

  if (facultyError) {
    throw facultyError;
  }

  const { data: courseRows, error: courseError } = await service
    .from("courses")
    .select("id, title, code");

  if (courseError) {
    throw courseError;
  }

  for (const row of rows) {
    const registrationNumber = sanitizeRegistrationValue(
      row.registration_no ?? "",
    );
    const courseName = sanitizeRegistrationValue(row.course ?? "");
    const studentName = sanitizeRegistrationValue(row.full_name ?? "");
    const contactEmail = sanitizeRegistrationValue(
      row.email ?? "",
    ).toLowerCase();

    if (!registrationNumber || !courseName || !studentName || !contactEmail) {
      skippedCount += 1;
      continue;
    }

    const { data: existingProfile, error: existingProfileError } = await service
      .from("profiles")
      .select("user_id")
      .eq("role", "student")
      .eq("registration_no", registrationNumber)
      .maybeSingle();

    if (existingProfileError) {
      throw existingProfileError;
    }

    if (existingProfile?.user_id) {
      skippedCount += 1;
      continue;
    }

    const baseUsername = row.username?.trim()
      ? row.username.trim().toLowerCase()
      : contactEmail.split("@")[0] || "student";
    const username = buildCourseScopedUsername({
      baseUsername,
      courseName,
      registrationNo: registrationNumber,
    });
    const temporaryPassword =
      row.submitted_password?.trim() || defaultPassword || "LePearl@123";
    const authEmail = buildCourseScopedAuthEmail({
      contactEmail,
      username,
      registrationNo: registrationNumber,
    });

    const defaultFacultyName = getDefaultFacultyForCourse(courseName);
    if (!defaultFacultyName) {
      throw new Error(
        `Unable to resolve faculty for legacy course '${courseName}'.`,
      );
    }

    const faculty = (facultyProfiles ?? []).find(
      (f) => normalizeLabel(f.full_name) === normalizeLabel(defaultFacultyName),
    );

    if (!faculty?.user_id) {
      throw new Error(
        `Default faculty '${defaultFacultyName}' not found for '${courseName}'.`,
      );
    }

    let matchedCourse = (courseRows ?? []).find(
      (c) => normalizeLabel(c.title) === normalizeLabel(courseName),
    );

    if (!matchedCourse) {
      const courseCode = `${normalizeCode(courseName)}-${Date.now().toString().slice(-5)}`;
      const { data: createdCourse, error: createCourseError } = await service
        .from("courses")
        .insert({
          code: courseCode,
          title: courseName,
          is_active: true,
        })
        .select("id, title, code")
        .single();

      if (createCourseError || !createdCourse) {
        throw (
          createCourseError ||
          new Error(`Failed to create course '${courseName}'.`)
        );
      }

      matchedCourse = createdCourse;
      courseRows?.push(createdCourse);
    }

    const { data: createdAuthUser, error: createUserError } =
      await service.auth.admin.createUser({
        email: authEmail,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: studentName,
          username,
          contact_email: contactEmail,
        },
      });

    if (createUserError || !createdAuthUser.user) {
      throw createUserError || new Error("Failed to create auth user.");
    }

    const createdUserId = createdAuthUser.user.id;

    const { error: profileInsertError } = await service
      .from("profiles")
      .insert({
        user_id: createdUserId,
        role: "student",
        full_name: studentName,
        registration_no: registrationNumber,
        email: contactEmail,
        phone: row.phone || null,
        is_active: true,
        username,
      });

    if (profileInsertError) {
      await service.auth.admin.deleteUser(createdUserId);
      throw profileInsertError;
    }

    const { error: studentProfileInsertError } = await service
      .from("student_profiles")
      .insert({
        user_id: createdUserId,
        registration_no: registrationNumber,
        target_exam: courseName,
        joined_on: new Date().toISOString().slice(0, 10),
        must_reset_password: true,
      });

    if (studentProfileInsertError) {
      await service.auth.admin.deleteUser(createdUserId);
      throw studentProfileInsertError;
    }

    const canonicalBatchName =
      getCanonicalPaidEnrollmentBatch(courseName)?.batchName;
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
        await service.auth.admin.deleteUser(createdUserId);
        throw (
          batchCreateError ||
          new Error(`Failed to create batch for ${courseName}.`)
        );
      }

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

    if (enrollmentError) {
      await service.auth.admin.deleteUser(createdUserId);
      throw enrollmentError;
    }

    await service
      .from("student_registrations")
      .update({ status: "completed" })
      .eq("id", row.id);

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: "repair_legacy_paid_enrolment_credentials",
      entity_name: "student_registrations",
      entity_id: row.id,
      details: {
        student_name: studentName,
        student_email: contactEmail,
        course: courseName,
        registration_no: registrationNumber,
        username,
      },
    });

    if (transporter) {
      const adminEmail = buildRepairAdminEmailContent({
        studentName,
        courseName,
        registrationNumber,
        username,
        temporaryPassword,
      });
      const studentEmail = buildCredentialEmailContent({
        studentName,
        courseName,
        registrationNumber,
        username,
        temporaryPassword,
      });

      try {
        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: adminPaymentRecipient,
          replyTo: contactEmail,
          subject: adminEmail.subject,
          text: adminEmail.text,
          html: adminEmail.html,
        });

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: contactEmail,
          subject: studentEmail.subject,
          text: studentEmail.text,
          html: studentEmail.html,
        });
      } catch (emailError) {
        console.error(
          "repair-legacy-paid-enrolments email send failed (non-critical):",
          emailError instanceof Error ? emailError.message : emailError,
        );
      } finally {
        transporter.close();
      }
    }

    repairedCount += 1;
    repairedCourses.push(courseName);
  }

  return {
    repairedCount,
    skippedCount,
    repairedCourses,
    message:
      repairedCount > 0
        ? `Repaired ${repairedCount} legacy paid enrolment${repairedCount === 1 ? "" : "s"} for ${studentEmail}.`
        : `No missing course accounts were found for ${studentEmail}.`,
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

    if (!registrationId) {
      return NextResponse.json(
        {
          error:
            "Please select a registration row first. Manual credential creation is disabled.",
        },
        { status: 400 },
      );
    }

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

    if (studentEmail && !isValidEmail(studentEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid Student Email ID." },
        { status: 400 },
      );
    }

    const service = createServerClient();

    if (body.repairAllSameEmailEnrollments) {
      if (!studentEmail) {
        return NextResponse.json(
          { error: "Student Email ID is required for repair mode." },
          { status: 400 },
        );
      }

      const repairResult = await repairLegacySameEmailEnrollments({
        service,
        adminUserId,
        studentEmail,
        defaultPassword,
      });

      return NextResponse.json({ ok: true, ...repairResult });
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

    let usernameQuery = service
      .from("profiles")
      .select("user_id")
      .ilike("username", username);

    const { data: existingUsername } = await usernameQuery.maybeSingle();

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

    const effectiveFacultyName =
      getCanonicalPaidEnrollmentBatch(courseName)?.facultyName || facultyName;

    const faculty = (facultyProfiles ?? []).find(
      (f) =>
        normalizeLabel(f.full_name) === normalizeLabel(effectiveFacultyName),
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

    const authEmail = studentEmail
      ? buildCourseScopedAuthEmail({
          contactEmail: studentEmail,
          username,
          registrationNo: registrationNumber,
        })
      : `${registrationNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}@lepearl.internal`;

    const { data: createdAuthUser, error: createUserError } =
      await service.auth.admin.createUser({
        email: authEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          full_name: studentName,
          username,
          contact_email: studentEmail || null,
        },
      });

    if (createUserError || !createdAuthUser.user) {
      const msg = createUserError?.message || "Failed to create auth user.";
      if (msg.toLowerCase().includes("already exists")) {
        return NextResponse.json(
          {
            error:
              "This username or course-scoped login email already exists. Please choose a different username or registration number.",
          },
          { status: 409 },
        );
      }

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
        email: studentEmail || null,
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

    const canonicalBatchName =
      getCanonicalPaidEnrollmentBatch(courseName)?.batchName;
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

    await service
      .from("student_registrations")
      .update({ status: "completed" })
      .eq("id", registrationId);

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

    const transporter = getTransporter();
    if (transporter && studentEmail) {
      try {
        const fromAddress =
          process.env.PAYMENT_EMAIL_FROM ??
          process.env.GMAIL_USER ??
          process.env.SMTP_USER ??
          "admin@lepearleducation.com";
        const credentialEmail = buildCredentialEmailContent({
          studentName,
          courseName,
          registrationNumber,
          username,
          temporaryPassword: defaultPassword,
        });

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: studentEmail,
          subject: credentialEmail.subject,
          text: credentialEmail.text,
          html: credentialEmail.html,
        });
      } catch (emailError) {
        console.error(
          "create-student-credentials email send failed (non-critical):",
          emailError instanceof Error ? emailError.message : emailError,
        );
      } finally {
        transporter.close();
      }
    }

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
