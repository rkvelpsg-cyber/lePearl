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
import { getCanonicalPaidEnrollmentBatch } from "@/lib/paidEnrollmentBatchMapping";
import {
  sendStudentPaymentWhatsAppNotification,
  sendWhatsAppTextNotification,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

export const maxDuration = 26;

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
  communicationSkillsFeeLabel?: string;
  upgdcFeeLabel?: string;
  gicFeeLabel?: string;
  ltGradeFeeLabel?: string;
  interviewPrepFeeLabel?: string;
  heardAboutUs?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[+]?[(]?[0-9\s-]{10,20}$/.test(value);
}

function isValidTenDigitPhone(value: string) {
  return /^\d{10}$/.test(value);
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

  const token = normalizeForMatch(
    `${params.username}-${params.registrationNo}`,
  ).slice(0, 18);
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

function normalizeSubmittedUsername(value: string) {
  return normalizeUsernameBase(value);
}

async function isUsernameAlreadyUsed(params: {
  service: ReturnType<typeof createServerClient>;
  username: string;
  ignoreRegistrationNo?: string | null;
}) {
  const normalizedUsername = normalizeSubmittedUsername(params.username);
  if (!normalizedUsername) return false;

  const normalizedIgnoredRegistrationNo = sanitizeRegistrationValue(
    params.ignoreRegistrationNo ?? "",
  );

  const [profileUsernameRes, registrationUsernameRes] = await Promise.all([
    params.service
      .from("profiles")
      .select("user_id")
      .ilike("username", normalizedUsername)
      .limit(1)
      .maybeSingle(),
    (async () => {
      let query = params.service
        .from("student_registrations")
        .select("id")
        .eq("mode", "paid")
        .ilike("username", normalizedUsername);

      if (normalizedIgnoredRegistrationNo) {
        query = query.neq("registration_no", normalizedIgnoredRegistrationNo);
      }

      return query.limit(1).maybeSingle();
    })(),
  ]);

  if (profileUsernameRes.error) {
    throw profileUsernameRes.error;
  }

  if (registrationUsernameRes.error) {
    throw registrationUsernameRes.error;
  }

  return Boolean(
    profileUsernameRes.data?.user_id || registrationUsernameRes.data?.id,
  );
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
  const subject =
    mode === "free"
      ? "Free Registration"
      : `[${flowLabel}] ${payload.fullName} - ${payload.email}`;

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
      `Selected Fee Plan: ${body.researchAssistanceFeeLabel ?? body.communicationSkillsFeeLabel ?? body.upgdcFeeLabel ?? body.gicFeeLabel ?? body.ltGradeFeeLabel ?? body.interviewPrepFeeLabel ?? (body.paymentTenure === "full" ? "Full Payment – Rs. " + (body.finalPayable ?? 0) : body.paymentTenure === "instalment" ? "Instalment – Rs. " + (body.finalPayable ?? 0) : "N/A")}`,
      `Payment Tenure: ${body.paymentTenure ?? "N/A"}`,
      `Accepted Terms: ${body.acceptedTerms ? "Yes" : "No"}`,`
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
    `Selected Fee Plan: ${body.researchAssistanceFeeLabel ?? body.communicationSkillsFeeLabel ?? body.upgdcFeeLabel ?? body.gicFeeLabel ?? body.ltGradeFeeLabel ?? body.interviewPrepFeeLabel ?? (body.paymentTenure === "full" ? "Full Payment – Rs. " + (body.finalPayable ?? 0) : body.paymentTenure === "instalment" ? "Instalment – Rs. " + (body.finalPayable ?? 0) : "N/A")}`,
    `Payment Tenure: ${body.paymentTenure ?? "N/A"}`,
    `Amount Paid: Rs. ${body.paymentAmount ?? body.finalPayable ?? 0}`,`
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
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Selected Fee Plan</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${body.researchAssistanceFeeLabel ?? body.communicationSkillsFeeLabel ?? body.upgdcFeeLabel ?? body.gicFeeLabel ?? body.ltGradeFeeLabel ?? body.interviewPrepFeeLabel ?? (body.paymentTenure === "full" ? "Full Payment – Rs. " + (body.finalPayable ?? 0) : body.paymentTenure === "instalment" ? "Instalment – Rs. " + (body.finalPayable ?? 0) : "N/A")}</td></tr>
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
    mode === "paid" ? "LePearl Paid Enrolment Received" : "Free Registration";

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

  const submittedUsername = normalizeSubmittedUsername(body.username ?? "");
  const password = body.password?.trim() ?? "";
  const registrationNo = sanitizeRegistrationValue(body.registrationNo ?? "");

  if (!payload.email || !submittedUsername || !password || !registrationNo) {
    return {
      ensured: false,
      reason: "Missing login account fields",
      username: null,
    };
  }

  const service = createServerClient();

  const usernameAlreadyUsed = await isUsernameAlreadyUsed({
    service,
    username: submittedUsername,
    ignoreRegistrationNo: registrationNo,
  });
  if (usernameAlreadyUsed) {
    return {
      ensured: false,
      reason: "Username already exists",
      username: null,
    };
  }

  const username = submittedUsername;

  const { data: existingRegistrationNo } = await service
    .from("student_profiles")
    .select("user_id")
    .ilike("registration_no", registrationNo)
    .maybeSingle();

  if (existingRegistrationNo?.user_id) {
    return {
      ensured: false,
      reason: "Registration number already exists",
      username: null,
    };
  }

  const authEmail = buildCourseScopedAuthEmail({
    contactEmail: payload.email,
    username,
    registrationNo,
  });

  const { data: createdAuthUser, error: createUserError } =
    await service.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.fullName,
        username,
        contact_email: payload.email,
      },
    });

  if (createUserError || !createdAuthUser.user) {
    return {
      ensured: false,
      reason: createUserError?.message || "Failed to create auth user",
      username: null,
    };
  }

  const studentUserId = createdAuthUser.user.id;

  const { error: profileInsertError } = await service.from("profiles").insert({
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
    await service.auth.admin.deleteUser(studentUserId).catch(() => {});
    return {
      ensured: false,
      reason: profileInsertError.message,
      username: null,
    };
  }

  const { error: authUpdateError } = await service.auth.admin.updateUserById(
    studentUserId,
    {
      password,
      user_metadata: {
        full_name: payload.fullName,
        username,
        contact_email: payload.email,
      },
    },
  );

  if (authUpdateError) {
    return {
      ensured: false,
      reason: authUpdateError.message,
      username: null,
    };
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
    await service.auth.admin.deleteUser(studentUserId).catch(() => {});
    return {
      ensured: false,
      reason: studentProfileUpsertError.message,
      username: null,
    };
  }

  const defaultFacultyName = getDefaultFacultyForCourse(payload.course);
  if (defaultFacultyName) {
    const canonicalBatchName = getCanonicalPaidEnrollmentBatch(
      payload.course,
    )?.batchName;
    const { data: facultyProfiles, error: facultyError } = await service
      .from("profiles")
      .select("user_id, full_name")
      .eq("role", "faculty");

    if (facultyError) {
      return {
        ensured: false,
        reason: facultyError.message,
        username: null,
      };
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
        username: null,
      };
    }

    const { data: courseRows, error: courseError } = await service
      .from("courses")
      .select("id, title, code");

    if (courseError) {
      return {
        ensured: false,
        reason: courseError.message,
        username: null,
      };
    }

    // Resolve canonical course name via alias mapping first so that e.g.
    // "NET Paper 2 (English)" never accidentally lands on the legacy DB
    // course "NTA NET Paper 2 (English)" (which also satisfies an includes
    // match but is the wrong target).
    const canonicalRegistrationCourseName =
      getCanonicalPaidEnrollmentBatch(payload.course)?.courseName ??
      payload.course;
    const normalizedCanonical = normalizeForMatch(
      canonicalRegistrationCourseName,
    );

    // 1st pass – exact match on canonical name
    let matchedCourse = (courseRows ?? []).find(
      (row) => normalizeForMatch(row.title) === normalizedCanonical,
    );

    // 2nd pass – loose includes match (handles old/renamed legacy titles)
    if (!matchedCourse) {
      const normalizedRequested = normalizeForMatch(payload.course);
      matchedCourse = (courseRows ?? []).find((row) => {
        const current = normalizeForMatch(row.title);
        return (
          current.includes(normalizedRequested) ||
          normalizedRequested.includes(current)
        );
      });
    }

    if (!matchedCourse) {
      const courseCode = `${normalizeCode(canonicalRegistrationCourseName)}-${Date.now().toString().slice(-5)}`;
      const { data: createdCourse, error: createCourseError } = await service
        .from("courses")
        .insert({
          code: courseCode,
          title: canonicalRegistrationCourseName,
          is_active: true,
        })
        .select("id, title, code")
        .single();

      if (createCourseError || !createdCourse) {
        return {
          ensured: false,
          reason: createCourseError?.message || "Failed to create course",
          username: null,
        };
      }

      matchedCourse = createdCourse;
    }

    const batchLookup = service
      .from("batches")
      .select("id")
      .eq("course_id", matchedCourse.id)
      .eq("faculty_user_id", faculty.user_id);

    const { data: existingBatch, error: batchFetchError } = canonicalBatchName
      ? await batchLookup.eq("batch_name", canonicalBatchName).maybeSingle()
      : await batchLookup
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

    if (batchFetchError) {
      return {
        ensured: false,
        reason: batchFetchError.message,
        username: null,
      };
    }

    let batchId = existingBatch?.id ?? null;

    if (!batchId) {
      const facultyLastName = faculty.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-1)[0];
      const batchName =
        canonicalBatchName ||
        `${normalizeCode(payload.course).slice(0, 10)}-${facultyLastName || "FAC"}-A`;

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
          username: null,
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
      return {
        ensured: false,
        reason: enrollmentError.message,
        username: null,
      };
    }
  }

  return { ensured: true, reason: null, username };
}

export async function GET(req: NextRequest) {
  try {
    const username = normalizeSubmittedUsername(
      req.nextUrl.searchParams.get("username") ?? "",
    );

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username is required." },
        { status: 400 },
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        {
          available: false,
          message: "Username must be at least 3 characters.",
        },
        { status: 400 },
      );
    }

    const service = createServerClient();
    const alreadyUsed = await isUsernameAlreadyUsed({ service, username });

    return NextResponse.json({
      available: !alreadyUsed,
      username,
      message: alreadyUsed
        ? "This username is already in use. Please try another username or contact support."
        : "The user name is not present and you can use it.",
    });
  } catch (error) {
    console.error("student registration username availability error:", error);
    return NextResponse.json(
      {
        available: false,
        message: "Unable to validate username right now. Please try again.",
      },
      { status: 500 },
    );
  }
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

    if (mode === "free") {
      payload.phone = payload.phone.replace(/\D/g, "");
      if (!isValidTenDigitPhone(payload.phone)) {
        return NextResponse.json(
          { error: "WhatsApp number must be exactly 10 digits." },
          { status: 400 },
        );
      }
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

    if (mode === "paid") {
      const username = normalizeSubmittedUsername(body.username ?? "");
      if (!username) {
        return NextResponse.json(
          { error: "Please enter a valid username for paid enrolment." },
          { status: 400 },
        );
      }

      if (username.length < 3) {
        return NextResponse.json(
          { error: "Username must be at least 3 characters long." },
          { status: 400 },
        );
      }

      const service = createServerClient();
      const alreadyUsed = await isUsernameAlreadyUsed({ service, username });
      if (alreadyUsed) {
        return NextResponse.json(
          {
            error:
              "This username is already in use. Please try another username or contact support.",
          },
          { status: 409 },
        );
      }
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
                body.researchAssistanceFeeLabel ??
                  body.communicationSkillsFeeLabel ??
                  body.upgdcFeeLabel ??
                  body.gicFeeLabel ??
                  body.ltGradeFeeLabel ??
                  body.interviewPrepFeeLabel ??
                  "",
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
                              body.gicFeeLabel ??
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

    let issuedUsername =
      mode === "paid"
        ? sanitizeRegistrationValue(body.username ?? "").toLowerCase()
        : "";

    // Track account setup result — we delay the error return until AFTER
    // emails are sent so that both admin and student are always notified
    // when a Razorpay payment completes, even if provisioning fails.
    let accountSetupFailed = false;
    let accountSetupError: string | null = null;
    let accountSetupErrorStatus: 409 | 500 = 500;

    if (mode === "paid" && isRazorpayPayment) {
      try {
        const ensureResult = await ensurePaidStudentAccount({ payload, body });
        if (!ensureResult.ensured) {
          const reason = ensureResult.reason ?? "Account provisioning failed";
          const normalizedReason = reason.toLowerCase();
          accountSetupFailed = true;
          accountSetupError = normalizedReason.includes("username already exists")
            ? "This username is already in use. Please try another username or contact support."
            : normalizedReason.includes("registration number already exists")
              ? "A registration number conflict occurred. Please refresh and retry the enrolment form."
              : `Paid registration completed but login account setup failed: ${reason}`;
          accountSetupErrorStatus =
            normalizedReason.includes("username already exists") ||
            normalizedReason.includes("registration number already exists")
              ? 409
              : 500;
        } else {
          if (ensureResult.username) {
            issuedUsername = ensureResult.username;
            if (
              supabase &&
              issuedUsername !==
                sanitizeRegistrationValue(body.username ?? "").toLowerCase()
            ) {
              await supabase
                .from("student_registrations")
                .update({ username: issuedUsername })
                .eq(
                  "registration_no",
                  sanitizeRegistrationValue(body.registrationNo ?? ""),
                )
                .eq("email", payload.email)
                .eq("mode", "paid");
            }
          }
        }
      } catch (error) {
        accountSetupFailed = true;
        accountSetupError = `Paid registration completed but login account setup failed: ${error instanceof Error ? error.message : "Unknown error"}`;
        accountSetupErrorStatus = 500;
      }
    }

    // SECONDARY: Try to send email (best-effort, don't fail if this doesn't work).
    // Emails are sent regardless of accountSetupFailed so both admin and student
    // are always notified when a Razorpay payment completes, even if account
    // provisioning encountered an issue. The admin email is flagged so the team
    // can manually provision the account when needed.
    const transporter = getTransporter();
    if (transporter) {
      try {
        const emailContent = buildModeAwareAdminEmail(payload, body, mode);
        const adminSubject = accountSetupFailed
          ? `[Action Required – Setup Failed] ${emailContent.subject}`
          : emailContent.subject;
        const adminSetupNote = accountSetupFailed
          ? `\n\n⚠ ACCOUNT SETUP FAILED: ${accountSetupError}\nPlease provision this student's account manually.`
          : "";
        const adminHtmlNote = accountSetupFailed
          ? `<p style="color:#dc2626;font-weight:600;padding:10px 14px;border:1px solid #dc2626;border-radius:6px;margin-bottom:16px;">⚠ Account setup failed: ${accountSetupError} — please provision manually.</p>`
          : "";

        const studentEmail =
          mode === "paid"
            ? buildStudentPaidPaymentEmail(payload, {
                ...body,
                username: issuedUsername || body.username,
              })
            : buildStudentConfirmationEmail(payload, mode);
        const fromAddress =
          process.env.REGISTRATION_EMAIL_FROM ??
          process.env.GMAIL_USER ??
          process.env.SMTP_USER ??
          recipientEmail;

        // Admin email — independent try so a failure here does NOT
        // prevent the student confirmation email from being sent.
        try {
          await transporter.sendMail({
            from: `LePearl Education <${fromAddress}>`,
            to: recipientEmail,
            replyTo: payload.email,
            subject: adminSubject,
            text: emailContent.text + adminSetupNote,
            html: adminHtmlNote + emailContent.html,
          });
        } catch (adminEmailErr) {
          console.error(
            "[student-registration] Admin email send failed (non-critical):",
            adminEmailErr instanceof Error
              ? adminEmailErr.message
              : adminEmailErr,
          );
        }

        // Student confirmation email — sent independently of the admin email.
        if (isValidEmail(payload.email)) {
          try {
            await transporter.sendMail({
              from: `LePearl Education <${fromAddress}>`,
              to: payload.email,
              subject: studentEmail.subject,
              text: studentEmail.text,
              html: studentEmail.html,
            });
          } catch (studentEmailErr) {
            console.error(
              "[student-registration] Student email send failed (non-critical):",
              studentEmailErr instanceof Error
                ? studentEmailErr.message
                : studentEmailErr,
            );
          }
        }
      } catch (error) {
        console.error(
          "Email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      } finally {
        transporter.close();
      }
    }

    if (accountSetupFailed) {
      return NextResponse.json(
        { error: accountSetupError ?? "Account provisioning failed" },
        { status: accountSetupErrorStatus },
      );
    }

    if (mode === "paid") {
      const whatsappResult = await sendStudentPaymentWhatsAppNotification({
        studentName: payload.fullName,
        phone: payload.phone,
        course: payload.course,
        amount: Number(body.paymentAmount ?? body.finalPayable ?? 0),
        registrationNo: body.registrationNo ?? null,
        username: issuedUsername || body.username || null,
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
