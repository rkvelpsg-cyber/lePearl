import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { createServerClient } from "@/lib/supabase/server";
import {
  isValidStudentRegistrationCourse,
  sanitizeRegistrationValue,
  StudentRegistrationPayload,
} from "@/lib/studentRegistration";
import {
  sendStudentPaymentWhatsAppNotification,
  sendWhatsAppTextNotification,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

const recipientEmail =
  process.env.REGISTRATION_ADMIN_EMAIL ?? "admin@lepearleducation.com";

type RegistrationMode = "paid" | "free";

type RegistrationRequestBody = Partial<StudentRegistrationPayload> & {
  mode?: RegistrationMode;
  registrationNo?: string;
  username?: string;
  password?: string;
  paymentTenure?: "full" | "instalment" | null;
  paymentMode?: string;
  paymentAmount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  acceptedTerms?: boolean;
  acceptedPrivacy?: boolean;
  acceptedRefund?: boolean;
  isPearlian?: boolean;
  pearlianEligible?: boolean;
  includeBooksAddon?: boolean;
  baseCourseFee?: number;
  discountAmount?: number;
  booksFee?: number;
  finalPayable?: number;
  researchAssistanceFeeLabel?: string;
  upgdcFeeLabel?: string;
  heardAboutUs?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[+]?[(]?[0-9\s-]{10,20}$/.test(value);
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
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
    return null; // Email is optional
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

function toNullableNumber(value: number | undefined) {
  return Number.isFinite(value) ? value : null;
}

function isMissingColumnError(message?: string | null) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("could not find") &&
    lower.includes("column") &&
    lower.includes("student_registrations")
  );
}

function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}) {
  const expectedSignature = crypto
    .createHmac("sha256", params.secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return expectedSignature === params.signature;
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
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
  const normalized = normalizeForMatch(course);

  if (normalized.includes("upgdc")) {
    return "Dr. Prem Shankar Pandey";
  }

  if (
    normalized.includes("netpaper1") ||
    normalized.includes("netpaper2") ||
    normalized.includes("netpaper2english") ||
    normalized.includes("ltgrade")
  ) {
    return "Ms Sadhana";
  }

  if (normalized.includes("mppsc")) {
    return "Ms Neelu Patel";
  }

  if (normalized.includes("gic")) {
    return "Dr Babli Mallick";
  }

  return null;
}

function buildEmailContent(payload: StudentRegistrationPayload) {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const subject = `New Student Registration Request - ${payload.fullName} - ${payload.course}`;

  const text = [
    "Dear LePearl Admissions Team,",
    "",
    "A new student registration request has been submitted through the website.",
    "",
    `Student Name: ${payload.fullName}`,
    `Qualification: ${payload.qualification}`,
    `Course Interested In: ${payload.course}`,
    `Contact Number: ${payload.phone}`,
    `Email ID: ${payload.email}`,
    `Submitted On: ${submittedAt}`,
    "",
    "Please contact the student regarding enrollment and login credential assistance.",
    "",
    "Regards,",
    "LePearl Education Website",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear LePearl Admissions Team,</p>
      <p>A new student registration request has been submitted through the website.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Name</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.fullName}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Qualification</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.qualification}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course Interested In</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.course}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Contact Number</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Email ID</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.email}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Submitted On</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${submittedAt}</td>
          </tr>
        </tbody>
      </table>
      <p>Please contact the student regarding enrollment and login credential assistance.</p>
      <p>Regards,<br />LePearl Education Website</p>
    </div>
  `;

  return { subject, text, html };
}

function buildModeAwareAdminEmail(
  payload: StudentRegistrationPayload,
  body: RegistrationRequestBody,
  mode: RegistrationMode,
) {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const flowLabel = mode === "paid" ? "Paid Enrolment" : "Free Registration";
  const subject = `[${flowLabel}] ${payload.fullName} - ${payload.email}`;

  const lines = [
    `Flow: ${flowLabel}`,
    `Student Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `WhatsApp: ${payload.phone}`,
    `Course: ${payload.course}`,
    `Qualification / Exam: ${payload.qualification}`,
  ];

  if (mode === "paid") {
    lines.push(
      `Registration No: ${body.registrationNo ?? "N/A"}`,
      `User ID / Username: ${body.username ?? "N/A"}`,
      `Temporary Password: ${body.password ?? "N/A"}`,
      `Selected Fee Plan: ${body.researchAssistanceFeeLabel ?? body.upgdcFeeLabel ?? "N/A"}`,
      `Payment Tenure: ${body.paymentTenure ?? "N/A"}`,
      `Accepted Terms: ${body.acceptedTerms ? "Yes" : "No"}`,
      `Accepted Privacy: ${body.acceptedPrivacy ? "Yes" : "No"}`,
      `Accepted Refund: ${body.acceptedRefund ? "Yes" : "No"}`,
      `Pearlian: ${body.isPearlian ? "Yes" : "No"}`,
      `Pearlian Eligible: ${body.pearlianEligible ? "Yes" : "No"}`,
      `Books Add-on: ${body.includeBooksAddon ? "Yes" : "No"}`,
      `Base Fee: ${body.baseCourseFee ?? 0}`,
      `Discount: ${body.discountAmount ?? 0}`,
      `Books Fee: ${body.booksFee ?? 0}`,
      `Final Payable: ${body.finalPayable ?? 0}`,
      `Payment Mode: ${body.paymentMode ?? "razorpay"}`,
      `Payment Amount: ${body.paymentAmount ?? 0}`,
      `Razorpay Order ID: ${body.razorpayOrderId ?? "N/A"}`,
      `Razorpay Payment ID: ${body.razorpayPaymentId ?? "N/A"}`,
    );
  } else {
    lines.push(`How did you hear about us: ${body.heardAboutUs ?? "N/A"}`);
  }

  lines.push(`Submitted On: ${submittedAt}`);

  const text = lines.join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <h2 style="margin-bottom:8px;">${flowLabel}</h2>
      <p style="margin-top:0;color:#475569;">Submitted on ${submittedAt}</p>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;font-family:Consolas,monospace;">${text}</pre>
    </div>
  `;

  return { subject, text, html };
}

function buildStudentPaidPaymentEmail(
  payload: StudentRegistrationPayload,
  body: RegistrationRequestBody,
) {
  const paymentAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const subject = "LePearl Payment Receipt - Paid Enrolment Confirmed";
  const text = [
    `Dear ${payload.fullName},`,
    "",
    "Your secure payment has been verified and your paid enrolment request is received.",
    "",
    `Course: ${payload.course}`,
    `Registration No: ${body.registrationNo ?? "N/A"}`,
    `User ID / Username: ${body.username ?? "N/A"}`,
    `Temporary Password: ${body.password ?? "N/A"}`,
    `Selected Fee Plan: ${body.researchAssistanceFeeLabel ?? body.upgdcFeeLabel ?? "N/A"}`,
    `Payment Tenure: ${body.paymentTenure ?? "N/A"}`,
    `Amount Paid: Rs. ${body.paymentAmount ?? body.finalPayable ?? 0}`,
    `Payment Mode: ${body.paymentMode ?? "razorpay"}`,
    `Transaction ID: ${body.razorpayPaymentId ?? "N/A"}`,
    `Order ID: ${body.razorpayOrderId ?? "N/A"}`,
    `Verified On: ${paymentAt}`,
    "",
    "Our team will process onboarding and share next steps shortly.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${payload.fullName},</p>
      <p>Your secure payment has been verified and your paid enrolment request is received.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${payload.course}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.registrationNo ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">User ID / Username</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.username ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Temporary Password</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.password ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Selected Fee Plan</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.researchAssistanceFeeLabel ?? body.upgdcFeeLabel ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Tenure</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.paymentTenure ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Amount Paid</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">Rs. ${body.paymentAmount ?? body.finalPayable ?? 0}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Mode</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.paymentMode ?? "razorpay"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Transaction ID</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.razorpayPaymentId ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Order ID</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.razorpayOrderId ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Verified On</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${paymentAt}</td></tr>
        </tbody>
      </table>
      <p>Our team will process onboarding and share next steps shortly.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildStudentConfirmationEmail(
  payload: StudentRegistrationPayload,
  mode: RegistrationMode,
) {
  const subject =
    mode === "paid"
      ? "LePearl Paid Enrolment Received"
      : "LePearl Free Registration Received";

  const coursesPageUrl = "https://www.lepearleducation.com/all-courses";

  const text =
    mode === "paid"
      ? `Dear ${payload.fullName},\n\nYour paid enrolment request has been received successfully. Our team will process your dashboard access and share next steps shortly.\n\nRegards,\nLePearl Education`
      : `Dear ${payload.fullName},\n\nYour free registration is complete. You can now explore PYQs and demo resources.\n\nBrowse all courses: ${coursesPageUrl}\n\nRegards,\nLePearl Education`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${payload.fullName},</p>
      <p>${
        mode === "paid"
          ? "Your paid enrolment request has been received successfully."
          : "Your free registration is complete."
      }</p>
      <p>${
        mode === "paid"
          ? "Our team will process your dashboard access and share next steps shortly."
          : "You can now explore PYQs and demo resources from the website."
      }</p>
      ${
        mode === "free"
          ? `<p>Browse all courses here: <a href="${coursesPageUrl}" target="_blank" rel="noopener noreferrer">${coursesPageUrl}</a></p>`
          : ""
      }
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildStudentFreeWhatsAppMessage(
  payload: StudentRegistrationPayload,
  heardAboutUs?: string,
) {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return [
    `Dear ${payload.fullName},`,
    "Your free registration for PYQs and demo access has been received successfully.",
    `Exam/Course: ${payload.course}`,
    `Submitted: ${submittedAt}`,
    heardAboutUs ? `Source: ${heardAboutUs}` : "",
    "Our team will share relevant updates shortly.",
    "LePearl Education",
  ]
    .filter(Boolean)
    .join("\n");
}

async function ensurePaidStudentAccount(params: {
  payload: StudentRegistrationPayload;
  body: RegistrationRequestBody;
}) {
  const { payload, body } = params;

  const username = sanitizeRegistrationValue(body.username ?? "").toLowerCase();
  const password = body.password?.trim() ?? "";
  const registrationNo = sanitizeRegistrationValue(body.registrationNo ?? "");

  if (!payload.email || !username || !password || !registrationNo) {
    return { ensured: false, reason: "Missing login account fields" };
  }

  const service = createServerClient();

  const { data: existingProfileByEmail } = await service
    .from("profiles")
    .select("user_id, username")
    .eq("role", "student")
    .ilike("email", payload.email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let studentUserId = existingProfileByEmail?.user_id ?? null;

  const { data: existingUsername } = await service
    .from("profiles")
    .select("user_id")
    .eq("role", "student")
    .ilike("username", username)
    .maybeSingle();

  if (
    existingUsername?.user_id &&
    (!studentUserId || existingUsername.user_id !== studentUserId)
  ) {
    return { ensured: false, reason: "Username already exists" };
  }

  if (!studentUserId) {
    const { data: createdAuthUser, error: createUserError } =
      await service.auth.admin.createUser({
        email: payload.email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: payload.fullName,
          username,
        },
      });

    if (createUserError || !createdAuthUser.user) {
      return {
        ensured: false,
        reason: createUserError?.message || "Failed to create auth user",
      };
    }

    studentUserId = createdAuthUser.user.id;

    const { error: profileInsertError } = await service
      .from("profiles")
      .insert({
        user_id: studentUserId,
        role: "student",
        full_name: payload.fullName,
        registration_no: registrationNo,
        email: payload.email,
        phone: payload.phone,
        is_active: true,
        username,
      });

    if (profileInsertError) {
      return { ensured: false, reason: profileInsertError.message };
    }
  } else {
    const { error: profileUpdateError } = await service
      .from("profiles")
      .update({
        full_name: payload.fullName,
        registration_no: registrationNo,
        email: payload.email,
        phone: payload.phone,
        username,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", studentUserId)
      .eq("role", "student");

    if (profileUpdateError) {
      return { ensured: false, reason: profileUpdateError.message };
    }
  }

  const { error: authUpdateError } = await service.auth.admin.updateUserById(
    studentUserId,
    {
      password,
      user_metadata: {
        full_name: payload.fullName,
        username,
      },
    },
  );

  if (authUpdateError) {
    return { ensured: false, reason: authUpdateError.message };
  }

  const { error: studentProfileUpsertError } = await service
    .from("student_profiles")
    .upsert(
      {
        user_id: studentUserId,
        registration_no: registrationNo,
        target_exam: payload.course,
        joined_on: new Date().toISOString().slice(0, 10),
        must_reset_password: true,
      },
      { onConflict: "user_id" },
    );

  if (studentProfileUpsertError) {
    return { ensured: false, reason: studentProfileUpsertError.message };
  }

  const defaultFacultyName = getDefaultFacultyForCourse(payload.course);
  if (defaultFacultyName) {
    const { data: facultyProfiles, error: facultyError } = await service
      .from("profiles")
      .select("user_id, full_name")
      .eq("role", "faculty");

    if (facultyError) {
      return { ensured: false, reason: facultyError.message };
    }

    const faculty = (facultyProfiles ?? []).find(
      (row) =>
        normalizeForMatch(row.full_name) ===
        normalizeForMatch(defaultFacultyName),
    );

    if (!faculty?.user_id) {
      return {
        ensured: false,
        reason: `Default faculty '${defaultFacultyName}' not found in profiles`,
      };
    }

    const { data: courseRows, error: courseError } = await service
      .from("courses")
      .select("id, title, code");

    if (courseError) {
      return { ensured: false, reason: courseError.message };
    }

    const requestedCourse = normalizeForMatch(payload.course);
    let matchedCourse = (courseRows ?? []).find((row) => {
      const current = normalizeForMatch(row.title);
      return (
        current === requestedCourse ||
        current.includes(requestedCourse) ||
        requestedCourse.includes(current)
      );
    });

    if (!matchedCourse) {
      const courseCode = `${normalizeCode(payload.course)}-${Date.now().toString().slice(-5)}`;
      const { data: createdCourse, error: createCourseError } = await service
        .from("courses")
        .insert({
          code: courseCode,
          title: payload.course,
          is_active: true,
        })
        .select("id, title, code")
        .single();

      if (createCourseError || !createdCourse) {
        return {
          ensured: false,
          reason: createCourseError?.message || "Failed to create course",
        };
      }

      matchedCourse = createdCourse;
    }

    const { data: existingBatch, error: batchFetchError } = await service
      .from("batches")
      .select("id")
      .eq("course_id", matchedCourse.id)
      .eq("faculty_user_id", faculty.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (batchFetchError) {
      return { ensured: false, reason: batchFetchError.message };
    }

    let batchId = existingBatch?.id ?? null;

    if (!batchId) {
      const facultyLastName = faculty.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-1)[0];
      const batchName = `${normalizeCode(payload.course).slice(0, 10)}-${facultyLastName || "FAC"}-A`;

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
        return {
          ensured: false,
          reason: batchCreateError?.message || "Failed to create batch",
        };
      }

      batchId = createdBatch.id;
    }

    const { error: enrollmentError } = await service.from("enrollments").upsert(
      {
        student_user_id: studentUserId,
        batch_id: batchId,
        status: "active",
      },
      { onConflict: "student_user_id,batch_id" },
    );

    if (enrollmentError) {
      return { ensured: false, reason: enrollmentError.message };
    }
  }

  return { ensured: true, reason: null };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegistrationRequestBody;
    const mode: RegistrationMode = body.mode === "free" ? "free" : "paid";

    const payload: StudentRegistrationPayload = {
      fullName: sanitizeRegistrationValue(body.fullName ?? ""),
      qualification: sanitizeRegistrationValue(body.qualification ?? ""),
      course: sanitizeRegistrationValue(
        body.course ?? "",
      ) as StudentRegistrationPayload["course"],
      phone: sanitizeRegistrationValue(body.phone ?? ""),
      email: sanitizeRegistrationValue(body.email ?? "").toLowerCase(),
    };

    if (
      !payload.fullName ||
      !payload.qualification ||
      !payload.phone ||
      !payload.email
    ) {
      return NextResponse.json(
        { error: "Please complete all required registration fields." },
        { status: 400 },
      );
    }

    if (
      mode === "paid" &&
      (!body.acceptedTerms || !body.acceptedPrivacy || !body.acceptedRefund)
    ) {
      return NextResponse.json(
        {
          error:
            "Please accept Terms, Privacy Policy and Refund Rules to continue paid enrolment.",
        },
        { status: 400 },
      );
    }

    const normalizedPaymentMode =
      mode === "paid"
        ? sanitizeRegistrationValue(
            body.paymentMode ?? "razorpay",
          ).toLowerCase()
        : null;
    const isRazorpayPayment =
      mode === "paid" &&
      (normalizedPaymentMode === null ||
        normalizedPaymentMode === "" ||
        normalizedPaymentMode === "razorpay");
    const paidStatus =
      mode === "paid"
        ? isRazorpayPayment
          ? "completed"
          : "pending"
        : "pending";
    const paidPaymentStatus =
      mode === "paid"
        ? isRazorpayPayment
          ? "successful"
          : "pending_verification"
        : null;

    if (mode === "paid" && isRazorpayPayment) {
      const orderId = sanitizeRegistrationValue(body.razorpayOrderId ?? "");
      const paymentId = sanitizeRegistrationValue(body.razorpayPaymentId ?? "");
      const signature = sanitizeRegistrationValue(body.razorpaySignature ?? "");

      if (!orderId || !paymentId || !signature) {
        return NextResponse.json(
          {
            error:
              "Secure Razorpay payment verification is required before paid enrolment submission.",
          },
          { status: 400 },
        );
      }

      const keySecret =
        process.env.RAZORPAY_KEY_SECRET ||
        process.env.RAZORPAY_SECRET ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.includes("REPLACE")) {
        return NextResponse.json(
          {
            error: "Payment gateway is not configured. Please contact support.",
          },
          { status: 503 },
        );
      }

      const isVerified = verifyRazorpaySignature({
        orderId,
        paymentId,
        signature,
        secret: keySecret,
      });

      if (!isVerified) {
        return NextResponse.json(
          {
            error:
              "Payment signature mismatch. Please retry payment or contact support.",
          },
          { status: 400 },
        );
      }

      const paymentAmount = Number(body.paymentAmount ?? 0);
      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        return NextResponse.json(
          { error: "Invalid payment amount received for paid enrolment." },
          { status: 400 },
        );
      }

      const expectedPayable = Number(body.finalPayable ?? 0);
      if (
        Number.isFinite(expectedPayable) &&
        expectedPayable > 0 &&
        Math.abs(paymentAmount - expectedPayable) > 1
      ) {
        return NextResponse.json(
          {
            error:
              "Payment amount does not match the final payable amount. Please try again.",
          },
          { status: 400 },
        );
      }
    }

    if (!isValidStudentRegistrationCourse(payload.course)) {
      return NextResponse.json(
        { error: "Please select a valid course." },
        { status: 400 },
      );
    }

    if (!isValidPhone(payload.phone)) {
      return NextResponse.json(
        { error: "Please enter a valid contact number." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // PRIMARY: Store in Supabase
    let storageFailed = false;
    let storageError: string | null = null;

    const supabase = getSupabaseClient();
    if (supabase) {
      const registrationRow = {
        status: paidStatus,
        mode,
        full_name: payload.fullName,
        qualification: payload.qualification,
        course: payload.course,
        phone: payload.phone,
        email: payload.email,
        registration_no:
          mode === "paid"
            ? sanitizeRegistrationValue(body.registrationNo ?? "")
            : null,
        username:
          mode === "paid"
            ? sanitizeRegistrationValue(body.username ?? "").toLowerCase()
            : null,
        submitted_password:
          mode === "paid" ? body.password?.trim() || null : null,
        accepted_terms: mode === "paid" ? Boolean(body.acceptedTerms) : false,
        accepted_privacy:
          mode === "paid" ? Boolean(body.acceptedPrivacy) : false,
        accepted_refund: mode === "paid" ? Boolean(body.acceptedRefund) : false,
        is_pearlian: mode === "paid" ? Boolean(body.isPearlian) : false,
        pearlian_eligible:
          mode === "paid" ? Boolean(body.pearlianEligible) : false,
        include_books_addon:
          mode === "paid" ? Boolean(body.includeBooksAddon) : false,
        base_course_fee: toNullableNumber(body.baseCourseFee),
        discount_amount: toNullableNumber(body.discountAmount),
        books_fee: toNullableNumber(body.booksFee),
        final_payable: toNullableNumber(body.finalPayable),
        payment_tenure:
          mode === "paid"
            ? sanitizeRegistrationValue(body.paymentTenure ?? "") || null
            : null,
        selected_fee_label:
          mode === "paid"
            ? sanitizeRegistrationValue(
                body.researchAssistanceFeeLabel ?? body.upgdcFeeLabel ?? "",
              ) || null
            : null,
        payment_mode:
          mode === "paid"
            ? sanitizeRegistrationValue(body.paymentMode ?? "razorpay")
            : null,
        payment_status: paidPaymentStatus,
        payment_amount:
          mode === "paid" ? toNullableNumber(body.paymentAmount) : null,
        razorpay_order_id:
          mode === "paid" && isRazorpayPayment
            ? sanitizeRegistrationValue(body.razorpayOrderId ?? "") || null
            : null,
        razorpay_payment_id:
          mode === "paid" && isRazorpayPayment
            ? sanitizeRegistrationValue(body.razorpayPaymentId ?? "") || null
            : null,
        razorpay_signature:
          mode === "paid" && isRazorpayPayment
            ? sanitizeRegistrationValue(body.razorpaySignature ?? "") || null
            : null,
        payment_verified_at:
          mode === "paid" && isRazorpayPayment
            ? new Date().toISOString()
            : null,
        heard_about_us:
          mode === "free"
            ? sanitizeRegistrationValue(body.heardAboutUs ?? "") || null
            : null,
      };

      try {
        const { error } = await supabase
          .from("student_registrations")
          .insert([registrationRow]);

        if (error) {
          if (isMissingColumnError(error.message)) {
            const {
              submitted_password: _ignoredSubmittedPassword,
              ...legacyCompatibleRow
            } = registrationRow;

            const { error: legacyError } = await supabase
              .from("student_registrations")
              .insert([legacyCompatibleRow]);

            if (legacyError) {
              const { error: minimalLegacyError } = await supabase
                .from("student_registrations")
                .insert([
                  {
                    status: paidStatus,
                    mode,
                    full_name: payload.fullName,
                    qualification: payload.qualification,
                    course: payload.course,
                    phone: payload.phone,
                    email: payload.email,
                    registration_no:
                      mode === "paid"
                        ? sanitizeRegistrationValue(
                            body.registrationNo ?? "",
                          ) || null
                        : null,
                    username:
                      mode === "paid"
                        ? sanitizeRegistrationValue(
                            body.username ?? "",
                          ).toLowerCase() || null
                        : null,
                    payment_amount:
                      mode === "paid"
                        ? toNullableNumber(body.paymentAmount)
                        : null,
                    payment_status: paidPaymentStatus,
                    payment_tenure:
                      mode === "paid"
                        ? sanitizeRegistrationValue(body.paymentTenure ?? "") ||
                          null
                        : null,
                    selected_fee_label:
                      mode === "paid"
                        ? sanitizeRegistrationValue(
                            body.researchAssistanceFeeLabel ??
                              body.upgdcFeeLabel ??
                              "",
                          ) || null
                        : null,
                  },
                ]);

              if (minimalLegacyError) {
                storageFailed = true;
                storageError = minimalLegacyError.message;
                console.error(
                  "Supabase legacy storage fallback failed:",
                  minimalLegacyError,
                );
              } else {
                console.warn(
                  "student_registrations schema is outdated; used minimal legacy insert fallback. Apply latest migrations.",
                );
              }
            } else {
              console.warn(
                "student_registrations schema is outdated; used compatible legacy insert fallback. Apply latest migrations.",
              );
            }
          } else {
            storageFailed = true;
            storageError = error.message;
            console.error("Supabase storage error:", error);
          }
        }
      } catch (error) {
        storageFailed = true;
        storageError =
          error instanceof Error ? error.message : "Unknown storage error";
        console.error("Supabase storage exception:", error);
      }
    } else {
      storageFailed = true;
      storageError = "Supabase is not configured";
    }

    // If storage failed, reject immediately
    if (storageFailed) {
      return NextResponse.json(
        {
          error:
            storageError ||
            "Registration could not be stored. Please try again.",
        },
        { status: 500 },
      );
    }

    if (mode === "paid" && isRazorpayPayment) {
      try {
        const ensureResult = await ensurePaidStudentAccount({ payload, body });
        if (!ensureResult.ensured) {
          const reason = ensureResult.reason ?? "Account provisioning failed";
          const normalizedReason = reason.toLowerCase();
          return NextResponse.json(
            {
              error:
                normalizedReason.includes("username already exists") ||
                normalizedReason.includes("already registered")
                  ? "This username/email is already in use. Please try another username or contact support."
                  : `Paid registration completed but login account setup failed: ${reason}`,
            },
            {
              status:
                normalizedReason.includes("username already exists") ||
                normalizedReason.includes("already registered")
                  ? 409
                  : 500,
            },
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            error: `Paid registration completed but login account setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
          { status: 500 },
        );
      }
    }

    // SECONDARY: Try to send email (best-effort, don't fail if this doesn't work)
    const transporter = getTransporter();
    if (transporter) {
      try {
        const emailContent = buildModeAwareAdminEmail(payload, body, mode);
        const studentEmail =
          mode === "paid"
            ? buildStudentPaidPaymentEmail(payload, body)
            : buildStudentConfirmationEmail(payload, mode);
        const fromAddress =
          process.env.REGISTRATION_EMAIL_FROM ??
          process.env.GMAIL_USER ??
          process.env.SMTP_USER ??
          recipientEmail;

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: recipientEmail,
          replyTo: payload.email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: payload.email,
          subject: studentEmail.subject,
          text: studentEmail.text,
          html: studentEmail.html,
        });
      } catch (error) {
        console.warn(
          "Email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    }

    if (mode === "paid") {
      const whatsappResult = await sendStudentPaymentWhatsAppNotification({
        studentName: payload.fullName,
        phone: payload.phone,
        course: payload.course,
        amount: Number(body.paymentAmount ?? body.finalPayable ?? 0),
        registrationNo: body.registrationNo ?? null,
        username: body.username ?? null,
        temporaryPassword: body.password ?? null,
        transactionId: body.razorpayPaymentId ?? null,
        orderId: body.razorpayOrderId ?? null,
      });

      if (!whatsappResult.sent) {
        console.warn(
          "WhatsApp send failed (non-critical):",
          whatsappResult.reason ?? "Unknown error",
        );
      }
    } else {
      try {
        const whatsappResult = await sendWhatsAppTextNotification({
          phone: payload.phone,
          text: buildStudentFreeWhatsAppMessage(
            payload,
            body.heardAboutUs
              ? sanitizeRegistrationValue(body.heardAboutUs)
              : "",
          ),
          event: "student_free_registration_submitted",
          context: {
            full_name: payload.fullName,
            email: payload.email,
            course: payload.course,
          },
        });

        if (!whatsappResult.sent) {
          console.warn(
            "WhatsApp send failed (non-critical):",
            whatsappResult.reason ?? "Unknown error",
          );
        }
      } catch (error) {
        console.warn(
          "WhatsApp send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    }

    return NextResponse.json({
      message:
        mode === "paid"
          ? isRazorpayPayment
            ? "Payment successful. Paid registration completed. Confirmation email sent to student and admin."
            : "Registration submitted in pending verification mode. Our team will confirm payment and activate your login credentials."
          : "Free registration submitted successfully. You can now access PYQs and demo resources.",
    });
  } catch (error) {
    console.error("Student registration submission failed", error);

    const message =
      error instanceof Error
        ? error.message
        : "Registration could not be submitted right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
