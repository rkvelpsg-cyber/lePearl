import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const adminRecipient =
  process.env.REGISTRATION_ADMIN_EMAIL ??
  process.env.PASSWORD_RESET_NOTIFICATION_EMAIL ??
  "admin@lepearleducation.com";

function isValidEmail(value?: string | null) {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

function buildUserEmail(params: {
  fullName: string;
  username: string | null;
  role: string;
  registrationNo: string | null;
}) {
  const { fullName, username, role, registrationNo } = params;
  const subject = "LePearl Password Reset Completed";
  const text = [
    `Dear ${fullName},`,
    "",
    "Your password has been updated successfully.",
    "",
    `Username: ${username ?? "N/A"}`,
    `Role: ${role}`,
    `Registration No: ${registrationNo ?? "N/A"}`,
    "",
    "If you did not make this change, please contact support immediately.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${fullName},</p>
      <p>Your password has been updated successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Username</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${username ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Role</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${role}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${registrationNo ?? "N/A"}</td></tr>
        </tbody>
      </table>
      <p>If you did not make this change, please contact support immediately.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildAdminEmail(params: {
  fullName: string;
  email: string | null;
  username: string | null;
  role: string;
  registrationNo: string | null;
}) {
  const { fullName, email, username, role, registrationNo } = params;
  const subject = `Password Reset Completed - ${fullName}`;
  const text = [
    "Dear Admin,",
    "",
    "A user has successfully reset their password.",
    "",
    `Name: ${fullName}`,
    `Email: ${email ?? "N/A"}`,
    `Username: ${username ?? "N/A"}`,
    `Role: ${role}`,
    `Registration No: ${registrationNo ?? "N/A"}`,
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear Admin,</p>
      <p>A user has successfully reset their password.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Name</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${fullName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Email</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${email ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Username</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${username ?? "N/A"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Role</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${role}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${registrationNo ?? "N/A"}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
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

    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: userData, error: userError } =
      await supabaseAnon.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { role?: string };
    const role = body.role ?? "student";
    const service = createServerClient();

    const [profileRes, studentProfileRes] = await Promise.all([
      service
        .from("profiles")
        .select("full_name, email, username, role")
        .eq("user_id", userData.user.id)
        .maybeSingle(),
      service
        .from("student_profiles")
        .select("registration_no")
        .eq("user_id", userData.user.id)
        .maybeSingle(),
    ]);

    const fullName =
      profileRes.data?.full_name ||
      userData.user.user_metadata?.full_name ||
      "User";
    const userEmail = userData.user.email ?? profileRes.data?.email ?? null;
    const username = profileRes.data?.username ?? null;
    const registrationNo = studentProfileRes.data?.registration_no ?? null;
    const resolvedRole = profileRes.data?.role ?? role;

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json({
        sent: false,
        warning: "Email configuration is not available.",
      });
    }

    const fromAddress =
      process.env.AUTH_EMAIL_FROM ??
      process.env.GMAIL_USER ??
      process.env.SMTP_USER ??
      adminRecipient;

    if (isValidEmail(userEmail)) {
      const userEmailContent = buildUserEmail({
        fullName,
        username,
        role: resolvedRole,
        registrationNo,
      });

      await transporter.sendMail({
        from: `LePearl Education <${fromAddress}>`,
        to: userEmail,
        subject: userEmailContent.subject,
        text: userEmailContent.text,
        html: userEmailContent.html,
      });
    }

    await transporter.sendMail({
      from: `LePearl Education <${fromAddress}>`,
      to: adminRecipient,
      replyTo: isValidEmail(userEmail) ? userEmail : undefined,
      subject: buildAdminEmail({
        fullName,
        email: userEmail,
        username,
        role: resolvedRole,
        registrationNo,
      }).subject,
      text: buildAdminEmail({
        fullName,
        email: userEmail,
        username,
        role: resolvedRole,
        registrationNo,
      }).text,
      html: buildAdminEmail({
        fullName,
        email: userEmail,
        username,
        role: resolvedRole,
        registrationNo,
      }).html,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("password-reset-notify error:", error);
    return NextResponse.json(
      { sent: false, error: "Unable to send password reset notifications." },
      { status: 200 },
    );
  }
}
