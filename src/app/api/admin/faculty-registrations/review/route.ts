import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ReviewBody = {
  id?: string;
  status?: "pending" | "approved" | "rejected";
  reviewNotes?: string;
};

type FacultyRegistrationRecord = {
  full_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
};

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
  if (!cleanedToken) return null;

  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) return null;

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${cleanedToken}` } },
  });

  const { data: tokenData, error: tokenError } = await anon.auth.getUser();
  if (tokenError || !tokenData.user) return null;

  const userId = tokenData.user.id;
  const { data: rpcRole } = await anon.rpc("current_user_role");
  const role = String(rpcRole || "").toLowerCase();
  if (role === "admin" || role === "super_admin" || role === "administrator") {
    return userId;
  }

  try {
    const service = createServerClient();
    const { data: adminProfile } = await service
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminProfile?.user_id) return userId;
  } catch {
    return null;
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

function buildFacultyStatusEmail(
  fullName: string,
  status: "pending" | "approved" | "rejected",
  reviewNotes?: string | null,
) {
  const subjectMap = {
    approved: "LePearl Faculty Registration Approved",
    rejected: "LePearl Faculty Registration Update",
    pending: "LePearl Faculty Registration Update",
  } as const;

  const messageMap = {
    approved:
      "Your faculty registration has been approved. Our team will contact you with the next steps shortly.",
    rejected: "Your faculty registration was not approved at this time.",
    pending: "Your faculty registration status has been updated.",
  } as const;

  const subject = subjectMap[status];
  const reviewLine = reviewNotes
    ? `<p><strong>Admin notes:</strong> ${reviewNotes}</p>`
    : "";
  const text = [
    `Dear ${fullName},`,
    "",
    messageMap[status],
    reviewNotes ? `Admin notes: ${reviewNotes}` : "",
    "",
    "Regards,",
    "LePearl Education",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${fullName},</p>
      <p>${messageMap[status]}</p>
      ${reviewLine}
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReviewBody;
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

    const id = body.id?.trim();
    if (!id) {
      return NextResponse.json(
        { error: "Faculty registration ID is required." },
        { status: 400 },
      );
    }

    const normalizedStatus = String(body.status || "").toLowerCase();
    if (
      normalizedStatus !== "pending" &&
      normalizedStatus !== "approved" &&
      normalizedStatus !== "rejected"
    ) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const service = createServerClient();
    const { data: existingRegistration, error: fetchError } = await service
      .from("faculty_registrations")
      .select("full_name, email, status, review_notes")
      .eq("id", id)
      .maybeSingle<FacultyRegistrationRecord>();

    if (fetchError) throw fetchError;

    const { error } = await service
      .from("faculty_registrations")
      .update({
        status: normalizedStatus,
        reviewed_by: adminUserId,
        reviewed_at: new Date().toISOString(),
        review_notes: body.reviewNotes?.trim() || null,
      })
      .eq("id", id);

    if (error) throw error;

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: `faculty_registration_${normalizedStatus}`,
      entity_name: "faculty_registrations",
      entity_id: id,
      details: {
        status: normalizedStatus,
        reviewNotes: body.reviewNotes?.trim() || null,
      },
    });

    const transporter = getTransporter();
    if (
      transporter &&
      existingRegistration?.email &&
      (normalizedStatus === "approved" || normalizedStatus === "rejected")
    ) {
      try {
        const emailContent = buildFacultyStatusEmail(
          existingRegistration.full_name,
          normalizedStatus,
          body.reviewNotes?.trim() || null,
        );
        const fromAddress =
          process.env.REGISTRATION_EMAIL_FROM ??
          process.env.GMAIL_USER ??
          process.env.SMTP_USER ??
          "admin@lepearleducation.com";

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: existingRegistration.email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });
      } catch (emailError) {
        console.warn(
          "Faculty status email send failed (non-critical):",
          emailError instanceof Error ? emailError.message : emailError,
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Faculty registration marked as ${normalizedStatus}.`,
    });
  } catch (error) {
    console.error("faculty registration review error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to review request.",
      },
      { status: 500 },
    );
  }
}
