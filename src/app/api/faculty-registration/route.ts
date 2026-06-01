import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { sendWhatsAppTextNotification } from "@/lib/whatsapp";

export const runtime = "nodejs";

const recipientEmail = "admin@lepearleducation.com";

type FacultyRegistrationPayload = {
  fullName: string;
  email: string;
  whatsapp: string;
  education: string;
  netCategory: string;
  address: string;
  guardianName?: string;
  skills: string;
  teachingMode: string;
  researchExperience?: string;
  papersPublished?: string;
  expertise: string;
};

function sanitize(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^\d{10}$/.test(value);
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isMissingFacultyRegistrationsTableError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("could not find the table") &&
    lower.includes("public.faculty_registrations")
  );
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

function buildMail(payload: FacultyRegistrationPayload) {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const subject = `New Faculty Registration - ${payload.fullName}`;
  const text = [
    "New faculty registration submission received:",
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `WhatsApp: ${payload.whatsapp}`,
    `Education: ${payload.education}`,
    `NET/JRF/PhD: ${payload.netCategory}`,
    `Address: ${payload.address}`,
    `Parent/Guardian: ${payload.guardianName || "N/A"}`,
    `Skills: ${payload.skills}`,
    `Teaching mode: ${payload.teachingMode}`,
    `Research experience: ${payload.researchExperience || "N/A"}`,
    `Papers published: ${payload.papersPublished || "N/A"}`,
    `Expertise: ${payload.expertise}`,
    `Submitted on: ${submittedAt}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <h2>New Faculty Registration</h2>
      <p>Submitted on ${submittedAt}</p>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;font-family:Consolas,monospace;">${text}</pre>
    </div>
  `;

  return { subject, text, html };
}

function buildFacultyConfirmationEmail(payload: FacultyRegistrationPayload) {
  const subject = "LePearl Faculty Registration Received";

  const text = [
    `Dear ${payload.fullName},`,
    "",
    "Your faculty registration has been received successfully.",
    "Our admin team will review your profile and contact you shortly.",
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${payload.fullName},</p>
      <p>Your faculty registration has been received successfully.</p>
      <p>Our admin team will review your profile and contact you shortly.</p>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildFacultyApplicantWhatsAppMessage(
  payload: FacultyRegistrationPayload,
) {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return [
    `Dear ${payload.fullName},`,
    "Your faculty registration has been received successfully.",
    `Email: ${payload.email}`,
    `Category: ${payload.netCategory}`,
    `Teaching Mode: ${payload.teachingMode}`,
    `Submitted: ${submittedAt}`,
    "Our admin team will review your profile and contact you shortly.",
    "LePearl Education",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FacultyRegistrationPayload>;

    const payload: FacultyRegistrationPayload = {
      fullName: sanitize(body.fullName),
      email: sanitize(body.email).toLowerCase(),
      whatsapp: normalizePhone(sanitize(body.whatsapp)),
      education: sanitize(body.education),
      netCategory: sanitize(body.netCategory),
      address: sanitize(body.address),
      guardianName: sanitize(body.guardianName),
      skills: sanitize(body.skills),
      teachingMode: sanitize(body.teachingMode),
      researchExperience: sanitize(body.researchExperience),
      papersPublished: sanitize(body.papersPublished),
      expertise: sanitize(body.expertise),
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.whatsapp ||
      !payload.education ||
      !payload.netCategory ||
      !payload.address ||
      !payload.skills ||
      !payload.teachingMode ||
      !payload.expertise
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!isValidPhone(payload.whatsapp)) {
      return NextResponse.json(
        {
          error: "Please enter a valid WhatsApp number (exactly 10 digits).",
        },
        { status: 400 },
      );
    }

    let storageFailed = false;
    let storageError: string | null = null;
    let usedLegacyStorage = false;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("faculty_registrations").insert([
          {
            full_name: payload.fullName,
            email: payload.email,
            whatsapp: payload.whatsapp,
            education: payload.education,
            net_category: payload.netCategory,
            address: payload.address,
            guardian_name: payload.guardianName || null,
            skills: payload.skills,
            teaching_mode: payload.teachingMode,
            research_experience: payload.researchExperience || null,
            papers_published: payload.papersPublished || null,
            expertise: payload.expertise,
            status: "pending",
          },
        ]);

        if (error) {
          if (isMissingFacultyRegistrationsTableError(error.message)) {
            const qualificationSummary = [
              `Education: ${payload.education}`,
              `Category: ${payload.netCategory}`,
              `Mode: ${payload.teachingMode}`,
            ].join(" | ");

            const { error: legacyError } = await supabase
              .from("student_registrations")
              .insert([
                {
                  full_name: payload.fullName,
                  qualification: qualificationSummary,
                  course: "Faculty Registration",
                  phone: payload.whatsapp,
                  email: payload.email,
                },
              ]);

            if (legacyError) {
              storageFailed = true;
              storageError = legacyError.message;
              console.error(
                "Legacy faculty storage fallback failed:",
                legacyError,
              );
            } else {
              usedLegacyStorage = true;
              console.warn(
                "faculty_registrations table is missing; used student_registrations fallback. Apply migration 20260517_create_faculty_registrations.sql.",
              );
            }
          } else {
            storageFailed = true;
            storageError = error.message;
            console.error(
              "Supabase faculty registration storage error:",
              error,
            );
          }
        }
      } catch (error) {
        storageFailed = true;
        storageError =
          error instanceof Error ? error.message : "Unknown storage error";
        console.error("Supabase faculty registration exception:", error);
      }
    } else {
      storageFailed = true;
      storageError = "Supabase is not configured";
    }

    if (storageFailed) {
      return NextResponse.json(
        {
          error:
            storageError ||
            "Faculty registration could not be stored. Please try again.",
        },
        { status: 500 },
      );
    }

    const transporter = getTransporter();
    if (transporter) {
      try {
        const emailContent = buildMail(payload);
        const applicantEmailContent = buildFacultyConfirmationEmail(payload);
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
          subject: applicantEmailContent.subject,
          text: applicantEmailContent.text,
          html: applicantEmailContent.html,
        });
      } catch (error) {
        console.warn(
          "Faculty registration email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    } else {
      console.warn(
        "Faculty registration email skipped: SMTP/Gmail environment variables are not configured.",
      );
    }

    let whatsappNotification: { sent: boolean; reason?: string } | null = null;

    try {
      whatsappNotification = await sendWhatsAppTextNotification({
        phone: payload.whatsapp,
        text: buildFacultyApplicantWhatsAppMessage(payload),
        event: "faculty_registration_submitted",
        context: {
          full_name: payload.fullName,
          email: payload.email,
        },
      });

      if (!whatsappNotification.sent) {
        console.warn(
          "Faculty registration WhatsApp send failed (non-critical):",
          whatsappNotification.reason || "Unknown error",
        );
      }
    } catch (error) {
      console.warn(
        "Faculty registration WhatsApp send failed (non-critical):",
        error instanceof Error ? error.message : error,
      );
    }

    return NextResponse.json({
      message: usedLegacyStorage
        ? "Faculty registration submitted successfully. Admin will review your profile shortly."
        : "Faculty registration submitted successfully. Admin will contact you after review.",
      whatsappNotification,
      usedLegacyStorage,
    });
  } catch (error) {
    console.error("Faculty registration submission failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit faculty registration.",
      },
      { status: 500 },
    );
  }
}
