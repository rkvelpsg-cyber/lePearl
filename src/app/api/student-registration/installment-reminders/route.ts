import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createServerClient } from "@/lib/supabase/server";
import {
  coursePaymentPlans,
  isValidStudentRegistrationCourse,
  StudentRegistrationCourse,
} from "@/lib/studentRegistration";

export const runtime = "nodejs";

const adminRecipient =
  process.env.REGISTRATION_ADMIN_EMAIL ?? "admin@lepearleducation.com";

type InstallmentReminderCandidate = {
  id: string;
  full_name: string;
  course: string;
  email: string;
  created_at: string;
};

type ReminderTarget = {
  registration: InstallmentReminderCandidate;
  installmentNumber: 2 | 3;
  amount: number;
  label: string;
  dueDateIso: string;
};

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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeZone: "Asia/Kolkata",
  }).format(new Date(dateIso));
}

function buildReminderEmail(target: ReminderTarget) {
  const { registration, installmentNumber, amount, label, dueDateIso } = target;
  const dueDateDisplay = formatDate(dueDateIso);
  const amountDisplay = formatCurrency(amount);

  const subject = `Installment Reminder - ${label} Due for ${registration.full_name}`;
  const text = [
    `Dear ${registration.full_name},`,
    "",
    `This is an automatic reminder for your ${label} payment.`,
    `Course: ${registration.course}`,
    `Due Amount: ${amountDisplay}`,
    `Due Date: ${dueDateDisplay}`,
    "",
    `Please complete installment ${installmentNumber} payment by the due date.`,
    "",
    "Admin copy included for payment tracking.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${registration.full_name},</p>
      <p>This is an automatic reminder for your <strong>${label}</strong> payment.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${registration.course}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Installment</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${label}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Due Amount</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${amountDisplay}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Due Date</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${dueDateDisplay}</td></tr>
        </tbody>
      </table>
      <p>Please complete installment ${installmentNumber} payment by the due date.</p>
      <p>Admin copy included for payment tracking.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function getInstallmentTarget(params: {
  registration: InstallmentReminderCandidate;
  now: Date;
  installmentNumber: 2 | 3;
}) {
  const { registration, now, installmentNumber } = params;

  if (!isValidStudentRegistrationCourse(registration.course)) {
    return null;
  }

  const plan =
    coursePaymentPlans[registration.course as StudentRegistrationCourse];
  const instalments = plan.instalments ?? [];

  const targetInstallment = instalments[installmentNumber - 1];
  if (!targetInstallment) {
    return null;
  }

  const dueDays = installmentNumber === 2 ? 30 : 60;
  const dueDate = new Date(registration.created_at);
  dueDate.setUTCDate(dueDate.getUTCDate() + dueDays);

  if (now < dueDate) {
    return null;
  }

  return {
    registration,
    installmentNumber,
    amount: targetInstallment.amount,
    label: targetInstallment.label,
    dueDateIso: dueDate.toISOString(),
  } satisfies ReminderTarget;
}

export async function POST(req: NextRequest) {
  try {
    const expectedSecret = process.env.INSTALLMENT_REMINDER_CRON_SECRET?.trim();
    if (expectedSecret) {
      const providedSecret =
        req.headers.get("x-installment-reminder-secret")?.trim() ?? "";
      if (!providedSecret || providedSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json(
        {
          message:
            "Reminder skipped: email transport is not configured (set GMAIL_* or SMTP_* env vars).",
          sent: 0,
          skipped: 0,
        },
        { status: 200 },
      );
    }

    const supabase = createServerClient();

    const { data: rows, error: rowsError } = await supabase
      .from("student_registrations")
      .select("id, full_name, course, email, created_at")
      .eq("mode", "paid")
      .eq("status", "completed")
      .eq("payment_tenure", "instalment")
      .not("email", "is", null)
      .order("created_at", { ascending: true });

    if (rowsError) {
      return NextResponse.json(
        { error: rowsError.message || "Failed to fetch installment rows." },
        { status: 500 },
      );
    }

    const registrations =
      (rows as InstallmentReminderCandidate[] | null)?.filter((r) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email),
      ) ?? [];

    if (registrations.length === 0) {
      return NextResponse.json({ sent: 0, skipped: 0, scanned: 0 });
    }

    const registrationIds = registrations.map((r) => r.id);
    const { data: sentLogs, error: sentLogsError } = await supabase
      .from("activity_logs")
      .select("entity_id, details")
      .eq("action", "installment_due_reminder_sent")
      .eq("entity_name", "student_registrations")
      .in("entity_id", registrationIds);

    if (sentLogsError) {
      return NextResponse.json(
        {
          error:
            sentLogsError.message ||
            "Failed to fetch installment reminder logs.",
        },
        { status: 500 },
      );
    }

    const sentKeys = new Set<string>();
    (
      (sentLogs as
        | {
            entity_id: string;
            details: { installmentNumber?: number } | null;
          }[]
        | null) ?? []
    ).forEach((row) => {
      const number = Number(row.details?.installmentNumber);
      if (Number.isFinite(number) && (number === 2 || number === 3)) {
        sentKeys.add(`${row.entity_id}:${number}`);
      }
    });

    const now = new Date();
    const targets: ReminderTarget[] = [];

    for (const registration of registrations) {
      const second = getInstallmentTarget({
        registration,
        now,
        installmentNumber: 2,
      });
      if (second && !sentKeys.has(`${registration.id}:2`)) {
        targets.push(second);
      }

      const third = getInstallmentTarget({
        registration,
        now,
        installmentNumber: 3,
      });
      if (third && !sentKeys.has(`${registration.id}:3`)) {
        targets.push(third);
      }
    }

    if (targets.length === 0) {
      return NextResponse.json({
        sent: 0,
        skipped: registrations.length,
        scanned: registrations.length,
      });
    }

    const fromAddress =
      process.env.REGISTRATION_EMAIL_FROM ??
      process.env.GMAIL_USER ??
      process.env.SMTP_USER ??
      adminRecipient;

    let sent = 0;

    for (const target of targets) {
      const emailContent = buildReminderEmail(target);
      const recipients = [
        ...new Set([target.registration.email, adminRecipient]),
      ]
        .map((v) => v.trim().toLowerCase())
        .filter((v) => v.length > 0);

      if (recipients.length === 0) {
        continue;
      }

      await transporter.sendMail({
        from: `LePearl Education <${fromAddress}>`,
        to: recipients.join(","),
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      await supabase.from("activity_logs").insert({
        actor_user_id: null,
        actor_role: null,
        action: "installment_due_reminder_sent",
        entity_name: "student_registrations",
        entity_id: target.registration.id,
        details: {
          installmentNumber: target.installmentNumber,
          installmentLabel: target.label,
          dueAmount: target.amount,
          dueDate: target.dueDateIso,
          recipients,
        },
      });

      sent += 1;
    }

    return NextResponse.json({
      sent,
      scanned: registrations.length,
      skipped: registrations.length - sent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process installment reminders.",
      },
      { status: 500 },
    );
  }
}
