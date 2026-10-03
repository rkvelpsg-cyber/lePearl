import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerClient } from "@/lib/supabase/server";
import {
  isMockOnlyCourse,
  UPHESC_MOCK_ONLY_COURSE,
  UPHESC_MOCK_ONLY_FEE,
} from "@/lib/mockOnlyBatch";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      amount?: number;
      description?: string;
      fullName?: string;
      email?: string;
      whatsapp?: string;
      course?: string;
      registrationNo?: string;
    };

    const amount = Number(body.amount ?? 0);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 500000) {
      return NextResponse.json(
        { error: "Invalid amount. Must be between Rs. 1 and Rs. 5,00,000." },
        { status: 400 },
      );
    }

    if (isMockOnlyCourse(body.course)) {
      if (amount !== UPHESC_MOCK_ONLY_FEE) {
        return NextResponse.json(
          { error: `The UPHESC mock-only fee is Rs. ${UPHESC_MOCK_ONLY_FEE}.` },
          { status: 400 },
        );
      }
      if (!body.registrationNo?.trim() || !body.email?.trim()) {
        return NextResponse.json(
          { error: "Registration number and email are required for mock-only payment." },
          { status: 400 },
        );
      }

      const service = createServerClient();
      const { data: batch, error: batchError } = await service
        .from("batches")
        .select("id, faculty_user_id, courses!inner(title, is_active)")
        .eq("batch_name", UPHESC_MOCK_ONLY_COURSE)
        .eq("courses.title", UPHESC_MOCK_ONLY_COURSE)
        .eq("courses.is_active", true)
        .maybeSingle();
      if (batchError) throw batchError;
      const { data: faculty, error: facultyError } = batch?.faculty_user_id
        ? await service.from("profiles")
            .select("full_name")
            .eq("user_id", batch.faculty_user_id)
            .eq("role", "faculty")
            .eq("is_active", true)
            .maybeSingle()
        : { data: null, error: null };
      if (facultyError) throw facultyError;
      if (!faculty || faculty.full_name.toLowerCase().replace(/[^a-z0-9]/g, "") !== "drpremshankarpandey") {
        return NextResponse.json(
          { error: "The UPHESC mock-only batch is not ready for enrolment. Please contact support." },
          { status: 503 },
        );
      }
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY;
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
    if (
      !keyId ||
      !keySecret ||
      keyId.includes("REPLACE") ||
      keySecret.includes("REPLACE")
    ) {
      return NextResponse.json(
        { error: "Payment gateway is not configured. Contact support." },
        { status: 503 },
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `reg_${Date.now()}`,
      notes: {
        description: String(body.description || "Paid enrolment").slice(0, 255),
        student_name: String(body.fullName || "").slice(0, 80),
        student_email: String(body.email || "").slice(0, 120),
        student_phone: String(body.whatsapp || "").slice(0, 24),
        course: String(body.course || "").slice(0, 120),
        registration_no: String(body.registrationNo || "").slice(0, 40),
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Order creation failed";
    const detail =
      typeof err === "object" && err !== null && "error" in err
        ? (err as { error?: { description?: string } }).error?.description
        : undefined;

    return NextResponse.json(
      { error: detail ? `${message}: ${detail}` : message },
      { status: 500 },
    );
  }
}
