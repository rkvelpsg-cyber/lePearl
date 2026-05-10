import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const adminPaymentRecipient =
  process.env.PAYMENT_NOTIFICATION_EMAIL ??
  process.env.ADMIN_PAYMENT_EMAIL ??
  "lepearledu@gmail.com";

function isValidEmail(value?: string | null) {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

function formatPaymentDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatPaymentAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildStudentPaymentEmail(params: {
  studentName: string;
  amount: number;
  paymentMode: string;
  transactionId: string;
  paymentDate: string;
  description: string;
}) {
  const {
    studentName,
    amount,
    paymentMode,
    transactionId,
    paymentDate,
    description,
  } = params;
  const subject = `Payment received - ${formatPaymentAmount(amount)} - LePearl Education`;
  const text = [
    `Dear ${studentName},`,
    "",
    "Your payment has been received successfully.",
    "",
    `Amount Paid: ${formatPaymentAmount(amount)}`,
    `Payment Method: ${paymentMode}`,
    `Transaction ID: ${transactionId}`,
    `Payment Date: ${formatPaymentDate(paymentDate)}`,
    `Description: ${description}`,
    "",
    "Regards,",
    "LePearl Education",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear ${studentName},</p>
      <p>Your payment has been received successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Amount Paid</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentAmount(amount)}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Method</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${paymentMode}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Transaction ID</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${transactionId}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Date</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentDate(paymentDate)}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Description</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${description}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education</p>
    </div>
  `;

  return { subject, text, html };
}

function buildAdminPaymentEmail(params: {
  studentName: string;
  studentEmail: string | null;
  amount: number;
  paymentMode: string;
  transactionId: string;
  paymentDate: string;
  description: string;
}) {
  const {
    studentName,
    studentEmail,
    amount,
    paymentMode,
    transactionId,
    paymentDate,
    description,
  } = params;
  const subject = `Payment received from ${studentName} - ${formatPaymentAmount(amount)}`;
  const text = [
    "Dear Admin,",
    "",
    "A student payment has been completed successfully.",
    "",
    `Student Name: ${studentName}`,
    `Student Email: ${studentEmail ?? "-"}`,
    `Amount Paid: ${formatPaymentAmount(amount)}`,
    `Payment Method: ${paymentMode}`,
    `Transaction ID: ${transactionId}`,
    `Payment Date: ${formatPaymentDate(paymentDate)}`,
    `Description: ${description}`,
    "",
    "Regards,",
    "LePearl Education Website",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear Admin,</p>
      <p>A student payment has been completed successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Name</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Email</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentEmail ?? "-"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Amount Paid</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentAmount(amount)}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Method</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${paymentMode}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Transaction ID</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${transactionId}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Date</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentDate(paymentDate)}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Description</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${description}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education Website</p>
    </div>
  `;

  return { subject, text, html };
}

export async function POST(req: NextRequest) {
  try {
    /* ── verify caller is authenticated ── */
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
    const { data: userData, error: userErr } =
      await supabaseAnon.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = userData.user.id;

    /* ── parse and validate body ── */
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      description,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 },
      );
    }

    /* ── verify Razorpay signature ── */
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret.includes("REPLACE")) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 503 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature mismatch. Possible tampering detected." },
        { status: 400 },
      );
    }

    /* ── save verified payment to database ── */
    const supabase = createServerClient();
    const paymentAmount = Number(amount) / 100;
    const paymentMode = "razorpay";
    const paymentDescription = String(
      description || "Course fee payment",
    ).slice(0, 255);
    const paymentDate = new Date().toISOString();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .maybeSingle();

    const studentName =
      profile?.full_name ||
      userData.user.user_metadata?.full_name ||
      userData.user.email ||
      "Student";
    const studentEmail = userData.user.email ?? profile?.email ?? null;

    const { error: insertError } = await supabase.from("payments").insert({
      student_user_id: userId,
      amount: paymentAmount,
      status: "paid",
      payment_mode: paymentMode,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      description: paymentDescription,
      payment_date: paymentDate,
    });

    if (insertError) {
      console.error("[payment/verify] DB insert error:", insertError);
      return NextResponse.json(
        {
          error:
            "Payment recorded by Razorpay but failed to save. Contact support with payment ID: " +
            razorpay_payment_id,
        },
        { status: 500 },
      );
    }

    const transporter = getTransporter();
    if (transporter) {
      const fromAddress =
        process.env.PAYMENT_EMAIL_FROM ??
        process.env.GMAIL_USER ??
        process.env.SMTP_USER ??
        adminPaymentRecipient;

      try {
        const adminEmail = buildAdminPaymentEmail({
          studentName,
          studentEmail,
          amount: paymentAmount,
          paymentMode,
          transactionId: razorpay_payment_id,
          paymentDate,
          description: paymentDescription,
        });

        await transporter.sendMail({
          from: `LePearl Education <${fromAddress}>`,
          to: adminPaymentRecipient,
          replyTo: studentEmail ?? undefined,
          subject: adminEmail.subject,
          text: adminEmail.text,
          html: adminEmail.html,
        });

        if (isValidEmail(studentEmail)) {
          const studentEmailContent = buildStudentPaymentEmail({
            studentName,
            amount: paymentAmount,
            paymentMode,
            transactionId: razorpay_payment_id,
            paymentDate,
            description: paymentDescription,
          });

          await transporter.sendMail({
            from: `LePearl Education <${fromAddress}>`,
            to: studentEmail,
            subject: studentEmailContent.subject,
            text: studentEmailContent.text,
            html: studentEmailContent.html,
          });
        }
      } catch (error) {
        console.warn(
          "[payment/verify] Email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        amount: paymentAmount,
        payment_mode: paymentMode,
        transaction_id: razorpay_payment_id,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
