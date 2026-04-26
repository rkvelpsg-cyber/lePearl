import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import {
  isValidStudentRegistrationCourse,
  sanitizeRegistrationValue,
  StudentRegistrationPayload,
} from "@/lib/studentRegistration";

export const runtime = "nodejs";

const recipientEmail = "lepearledu@gmail.com";

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<StudentRegistrationPayload>;

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
      try {
        const { error } = await supabase.from("student_registrations").insert([
          {
            full_name: payload.fullName,
            qualification: payload.qualification,
            course: payload.course,
            phone: payload.phone,
            email: payload.email,
          },
        ]);

        if (error) {
          storageFailed = true;
          storageError = error.message;
          console.error("Supabase storage error:", error);
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

    // SECONDARY: Try to send email (best-effort, don't fail if this doesn't work)
    const transporter = getTransporter();
    if (transporter) {
      try {
        const emailContent = buildEmailContent(payload);
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
      } catch (error) {
        console.warn(
          "Email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    }

    return NextResponse.json({
      message:
        "Registration submitted successfully. The admissions team will contact you soon.",
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
