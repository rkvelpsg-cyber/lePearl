import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipientEmail = "lepearledu@gmail.com";

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
    `Guardian: ${payload.guardianName || "N/A"}`,
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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FacultyRegistrationPayload>;

    const payload: FacultyRegistrationPayload = {
      fullName: sanitize(body.fullName),
      email: sanitize(body.email).toLowerCase(),
      whatsapp: sanitize(body.whatsapp),
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
        { error: "Please enter a valid WhatsApp number." },
        { status: 400 },
      );
    }

    let storageFailed = false;
    let storageError: string | null = null;

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
          storageFailed = true;
          storageError = error.message;
          console.error("Supabase faculty registration storage error:", error);
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
      const emailContent = buildMail(payload);
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
    }

    return NextResponse.json({
      message:
        "Faculty registration submitted successfully. Admin will contact you after review.",
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
