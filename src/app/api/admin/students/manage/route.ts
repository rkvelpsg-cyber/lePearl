import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { createServerClient } from "@/lib/supabase/server";
import { isValidStudentRegistrationCourse } from "@/lib/studentRegistration";

export const runtime = "nodejs";

type AdminStudentsManageBody = {
  action?: "update" | "delete" | "deleteEnrollment";
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function buildStudentEnrollmentDeletedEmail(params: {
  studentName: string;
  courseName: string;
  deletedAt: string;
}) {
  const { studentName, courseName, deletedAt } = params;
  const subject = `Enrollment Update - ${courseName} access removed`;
  const text = [
    `Dear ${studentName},`,
    "",
    `Your enrollment for the course '${courseName}' has been removed by the admin team.`,
    `Updated On: ${formatDateTime(deletedAt)}`,
    "",
    "If this was not expected, please contact LePearl Education support.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${studentName},</p>
      <p>Your enrollment for the course <strong>${courseName}</strong> has been removed by the admin team.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${courseName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Updated On</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatDateTime(deletedAt)}</td></tr>
        </tbody>
      </table>
      <p>If this was not expected, please contact LePearl Education support.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildAdminEnrollmentDeletedEmail(params: {
  studentName: string;
  studentEmail: string | null;
  registrationNo: string | null;
  courseName: string;
  deletedAt: string;
}) {
  const { studentName, studentEmail, registrationNo, courseName, deletedAt } =
    params;
  const subject = `Admin Alert - Enrollment removed (${courseName})`;
  const text = [
    "Dear Admin,",
    "",
    "A student enrollment has been removed by admin action.",
    "",
    `Student Name: ${studentName}`,
    `Student Email: ${studentEmail ?? "-"}`,
    `Registration No: ${registrationNo ?? "-"}`,
    `Course Removed: ${courseName}`,
    `Updated On: ${formatDateTime(deletedAt)}`,
    "",
    "Regards,",
    "LePearl Education Website",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear Admin,</p>
      <p>A student enrollment has been removed by admin action.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Name</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Email</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentEmail ?? "-"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${registrationNo ?? "-"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course Removed</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${courseName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Updated On</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatDateTime(deletedAt)}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education Website</p>
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
    if (
      action !== "update" &&
      action !== "delete" &&
      action !== "deleteEnrollment"
    ) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const service = createServerClient();

    if (action === "deleteEnrollment") {
      const courseName = body.courseName?.trim() || null;
      if (!courseName) {
        return NextResponse.json(
          { error: "Course name is required for enrollment deletion." },
          { status: 400 },
        );
      }

      const { data: studentProfile, error: studentProfileError } = await service
        .from("profiles")
        .select("user_id, full_name, email, registration_no")
        .eq("user_id", studentUserId)
        .eq("role", "student")
        .maybeSingle();

      if (studentProfileError) throw studentProfileError;
      if (!studentProfile?.user_id) {
        return NextResponse.json(
          { error: "Student account not found." },
          { status: 404 },
        );
      }

      const { data: courseRows, error: courseRowsError } = await service
        .from("courses")
        .select("id, title");

      if (courseRowsError) throw courseRowsError;

      const matchedCourseIds = (courseRows ?? [])
        .filter((c) => normalizeLabel(c.title) === normalizeLabel(courseName))
        .map((c) => c.id);

      if (matchedCourseIds.length === 0) {
        return NextResponse.json(
          { error: `No course found for '${courseName}'.` },
          { status: 404 },
        );
      }

      const { data: batchRows, error: batchRowsError } = await service
        .from("batches")
        .select("id")
        .in("course_id", matchedCourseIds);

      if (batchRowsError) throw batchRowsError;

      const matchedBatchIds = (batchRows ?? []).map((b) => b.id);

      if (matchedBatchIds.length === 0) {
        return NextResponse.json(
          { error: `No batch is mapped for '${courseName}'.` },
          { status: 404 },
        );
      }

      const { data: deletedEnrollments, error: deleteEnrollmentError } =
        await service
          .from("enrollments")
          .delete()
          .eq("student_user_id", studentUserId)
          .in("batch_id", matchedBatchIds)
          .select("student_user_id, batch_id");

      if (deleteEnrollmentError) throw deleteEnrollmentError;

      const deletedCount = deletedEnrollments?.length ?? 0;
      if (deletedCount === 0) {
        return NextResponse.json(
          {
            error: `Student is not enrolled in '${courseName}', nothing was deleted.`,
          },
          { status: 404 },
        );
      }

      const deletedAt = new Date().toISOString();
      const studentName = studentProfile.full_name || "Student";
      const studentEmail = studentProfile.email?.trim().toLowerCase() || null;
      const registrationNo = studentProfile.registration_no || null;

      const transporter = getTransporter();
      if (transporter) {
        const fromAddress =
          process.env.REGISTRATION_EMAIL_FROM ??
          process.env.GMAIL_USER ??
          process.env.SMTP_USER ??
          "admin@lepearleducation.com";

        try {
          if (studentEmail && isValidEmail(studentEmail)) {
            const studentEmailContent = buildStudentEnrollmentDeletedEmail({
              studentName,
              courseName,
              deletedAt,
            });

            await transporter.sendMail({
              from: `LePearl Education <${fromAddress}>`,
              to: studentEmail,
              subject: studentEmailContent.subject,
              text: studentEmailContent.text,
              html: studentEmailContent.html,
            });
          }

          const adminEmailContent = buildAdminEnrollmentDeletedEmail({
            studentName,
            studentEmail,
            registrationNo,
            courseName,
            deletedAt,
          });

          await transporter.sendMail({
            from: `LePearl Education <${fromAddress}>`,
            to: "admin@leperaleducation.com",
            subject: adminEmailContent.subject,
            text: adminEmailContent.text,
            html: adminEmailContent.html,
          });
        } catch (mailError) {
          console.warn(
            "Enrollment deletion emails failed (non-critical):",
            mailError,
          );
        }
      }

      await service.from("activity_logs").insert({
        actor_user_id: adminUserId,
        actor_role: "admin",
        action: "delete_student_enrollment",
        entity_name: "enrollments",
        entity_id: studentUserId,
        details: {
          studentUserId,
          courseName,
          deletedCount,
          studentEmail,
          registrationNo,
        },
      });

      return NextResponse.json({
        ok: true,
        message: `Enrollment for '${courseName}' deleted successfully.${studentEmail ? " Student and admin notifications were attempted." : " Admin notification was attempted."}`,
      });
    }

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
