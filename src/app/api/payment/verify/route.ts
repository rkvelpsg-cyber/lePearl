import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { sendStudentPaymentWhatsAppNotification } from "@/lib/whatsapp";

export const runtime = "nodejs";

const adminPaymentRecipient =
  process.env.PAYMENT_NOTIFICATION_EMAIL ??
  process.env.ADMIN_PAYMENT_EMAIL ??
  "lepearledu@gmail.com";

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function resolveConcernedFacultyEmails(courseName: string) {
  try {
    const service = createServerClient();

    const { data: courses, error: coursesError } = await service
      .from("courses")
      .select("id, title")
      .limit(100);

    if (coursesError || !courses || courses.length === 0) {
      return [] as string[];
    }

    const requested = normalizeForMatch(courseName);
    const matched = courses.filter((c) => {
      const current = normalizeForMatch(c.title);
      return (
        current === requested ||
        current.includes(requested) ||
        requested.includes(current)
      );
    });

    const courseIds = (matched.length > 0 ? matched : courses.slice(0, 0)).map(
      (c) => c.id,
    );
    if (courseIds.length === 0) {
      return [] as string[];
    }

    const { data: batches, error: batchesError } = await service
      .from("batches")
      .select("faculty_user_id, profiles(email)")
      .in("course_id", courseIds)
      .not("faculty_user_id", "is", null)
      .limit(200);

    if (batchesError || !batches) {
      return [] as string[];
    }

    const emails = new Set<string>();
    (
      batches as unknown as { profiles: { email: string | null } | null }[]
    ).forEach((row) => {
      const email = row.profiles?.email?.trim().toLowerCase();
      if (email && isValidEmail(email)) {
        emails.add(email);
      }
    });

    return [...emails];
  } catch {
    return [] as string[];
  }
}

function buildFacultyPaymentAlertEmail(params: {
  studentName: string;
  studentEmail: string | null;
  course: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
  registrationNo: string | null;
}) {
  const {
    studentName,
    studentEmail,
    course,
    amount,
    transactionId,
    paymentDate,
    registrationNo,
  } = params;

  const subject = `Faculty Alert - New Paid Registration: ${studentName} (${course})`;
  const text = [
    "Dear Faculty,",
    "",
    "A new student registration payment has been verified successfully.",
    "",
    `Student Name: ${studentName}`,
    `Student Email: ${studentEmail ?? "-"}`,
    `Course: ${course}`,
    `Registration No: ${registrationNo ?? "-"}`,
    `Amount Paid: ${formatPaymentAmount(amount)}`,
    `Transaction ID: ${transactionId}`,
    `Payment Date: ${formatPaymentDate(paymentDate)}`,
    "",
    "Regards,",
    "LePearl Education Website",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:680px;margin:0 auto;">
      <p>Dear Faculty,</p>
      <p>A new student registration payment has been verified successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
        <tbody>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Name</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentName}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Student Email</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${studentEmail ?? "-"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Course</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${course}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Registration No</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${registrationNo ?? "-"}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Amount Paid</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentAmount(amount)}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Transaction ID</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${transactionId}</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;">Payment Date</td><td style="padding:10px 14px;border:1px solid #e5e7eb;">${formatPaymentDate(paymentDate)}</td></tr>
        </tbody>
      </table>
      <p>Regards,<br />LePearl Education Website</p>
    </div>
  `;

  return { subject, text, html };
}

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
      .select("full_name, email, phone")
      .eq("user_id", userId)
      .maybeSingle();

    const studentName =
      profile?.full_name ||
      userData.user.user_metadata?.full_name ||
      userData.user.email ||
      "Student";
    const studentEmail = userData.user.email ?? profile?.email ?? null;
    const studentPhone = profile?.phone ?? null;

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
        const fallbackFacultyNotificationEmail =
          process.env.FACULTY_NOTIFICATION_EMAIL;

        const { data: pendingRows } = await supabase
          .from("student_registrations")
          .select(
            "id, mode, status, full_name, course, email, phone, registration_no, final_payable, created_at",
          )
          .eq("status", "pending")
          .eq("mode", "paid")
          .eq("email", studentEmail ?? "")
          .order("created_at", { ascending: false })
          .limit(5);

        const pendingPaid =
          (pendingRows as
            | {
                id: string;
                full_name: string;
                course: string;
                email: string;
                phone: string;
                registration_no: string | null;
                final_payable: number | null;
              }[]
            | null) ?? [];

        const matchedRegistration =
          pendingPaid.find((r) => {
            if (r.final_payable == null) return false;
            return Math.abs(Number(r.final_payable) - paymentAmount) <= 1;
          }) ?? pendingPaid[0];

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

        if (matchedRegistration?.course) {
          const concernedFacultyEmails = await resolveConcernedFacultyEmails(
            matchedRegistration.course,
          );
          const facultyRecipients = [
            ...new Set(
              [
                ...concernedFacultyEmails,
                fallbackFacultyNotificationEmail || "",
              ]
                .map((v) => v.trim().toLowerCase())
                .filter((v) => v && isValidEmail(v)),
            ),
          ];

          if (facultyRecipients.length > 0) {
            const facultyAlert = buildFacultyPaymentAlertEmail({
              studentName: matchedRegistration.full_name || studentName,
              studentEmail,
              course: matchedRegistration.course,
              amount: paymentAmount,
              transactionId: razorpay_payment_id,
              paymentDate,
              registrationNo: matchedRegistration.registration_no,
            });

            for (const facultyEmail of facultyRecipients) {
              await transporter.sendMail({
                from: `LePearl Education <${fromAddress}>`,
                to: facultyEmail,
                subject: facultyAlert.subject,
                text: facultyAlert.text,
                html: facultyAlert.html,
              });
            }

            // Keep an audit trail for faculty notification after verified payment.
            await supabase.from("activity_logs").insert({
              actor_user_id: userId,
              actor_role: "student",
              action: "faculty_notification_after_payment",
              entity_name: "student_registrations",
              entity_id: matchedRegistration.id,
              details: {
                course: matchedRegistration.course,
                registration_no: matchedRegistration.registration_no,
                student_name: matchedRegistration.full_name || studentName,
                student_email: studentEmail,
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
                amount: paymentAmount,
                recipients_count: facultyRecipients.length,
                recipients: facultyRecipients,
              },
            });
          }
        }
      } catch (error) {
        console.warn(
          "[payment/verify] Email send failed (non-critical):",
          error instanceof Error ? error.message : error,
        );
      }
    }

    const whatsappPhone =
      (typeof studentPhone === "string" && studentPhone.trim()) ||
      (typeof body.phone === "string" && body.phone.trim()) ||
      undefined;

    if (whatsappPhone) {
      const whatsappResult = await sendStudentPaymentWhatsAppNotification({
        studentName,
        phone: whatsappPhone,
        course:
          typeof body.course === "string" && body.course.trim().length > 0
            ? body.course
            : "LePearl Course",
        amount: paymentAmount,
        registrationNo:
          typeof body.registrationNo === "string" ? body.registrationNo : null,
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      if (!whatsappResult.sent) {
        console.warn(
          "[payment/verify] WhatsApp send failed (non-critical):",
          whatsappResult.reason ?? "Unknown error",
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
